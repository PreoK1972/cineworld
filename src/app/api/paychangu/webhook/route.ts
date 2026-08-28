import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

const PAYCHANGU_SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY || '';

// In a real app you'd store verified tx_refs in a database (e.g. Supabase)
// For now we log and confirm — replace with real DB writes later
const verifiedTransactions = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signatureFromPaychangu = req.headers.get('Signature') || req.headers.get('signature') || '';

    // ===== SECURITY: Verify the webhook signature =====
    // Paychangu signs the payload with your secret key using HMAC SHA-256
    if (PAYCHANGU_SECRET_KEY && signatureFromPaychangu) {
      const expectedSignature = createHmac('sha256', PAYCHANGU_SECRET_KEY)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signatureFromPaychangu) {
        console.warn('⚠️ Paychangu webhook signature mismatch — possible spoofed request');
        return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    console.log('Paychangu Webhook Received:', JSON.stringify(payload, null, 2));

    // Extract payment data from Paychangu payload
    const { tx_ref, status, amount, currency, customer } = payload?.data || payload;

    if (!tx_ref) {
      return NextResponse.json({ message: 'Missing tx_ref' }, { status: 400 });
    }

    // Handle different Paychangu event statuses
    if (status === 'successful' || status === 'success' || status === 'completed') {

      // Verify the amount is correct (MKW 2,000)
      if (Number(amount) < 2000 || currency !== 'MWK') {
        console.warn(`⚠️ Incorrect payment amount: ${amount} ${currency} for tx_ref: ${tx_ref}`);
        return NextResponse.json({ message: 'Incorrect payment amount' }, { status: 400 });
      }

      // Prevent duplicate webhook processing
      if (verifiedTransactions.has(tx_ref)) {
        return NextResponse.json({ message: 'Already processed', tx_ref });
      }

      verifiedTransactions.add(tx_ref);

      // ===== ACTIVATE VIP FOR THIS USER =====
      // In production: look up the user by customer.email in your database
      // and set their vip_active_until = NOW() + 7 days
      // Example: await db.users.update({ where: { email: customer?.email }, data: { vip_until: addDays(new Date(), 7) } })

      console.log(`✅ VIP ACTIVATED for: ${customer?.email || customer?.phone_number}`);
      console.log(`   Transaction: ${tx_ref} | Amount: MKW ${amount} | Status: ${status}`);

      // TODO: Send confirmation SMS/email to the customer
      // TODO: Log to your database

      return NextResponse.json({
        success: true,
        message: `VIP activated for ${customer?.email || customer?.phone_number}`,
        tx_ref,
      });

    } else if (status === 'failed' || status === 'cancelled') {
      console.log(`❌ Payment ${status}: ${tx_ref}`);
      return NextResponse.json({ message: `Payment ${status}`, tx_ref });
    }

    return NextResponse.json({ message: 'Event received', status });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { message: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}

// Allow Paychangu to reach this endpoint (no CORS restrictions needed for webhooks)
export async function GET() {
  return NextResponse.json({ status: 'Paychangu Webhook Listener Active ✅' });
}
