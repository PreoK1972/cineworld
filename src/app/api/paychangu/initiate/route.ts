import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const PAYCHANGU_SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, first_name, last_name, phone, channel } = body;

    // Generate a unique transaction reference for this payment
    const tx_ref = `CW-VIP-${randomUUID().slice(0, 12).toUpperCase()}`;

    // Plan details — MKW 2,000 for 7 days
    const planAmount = 2000;
    const planCurrency = 'MWK';

    const paychanguPayload = {
      amount: planAmount.toString(),
      currency: planCurrency,
      email: email || 'user@cineworld.com',
      first_name: first_name || 'CineWorld',
      last_name: last_name || 'User',
      phone_number: phone || '',
      callback_url: `${SITE_URL}/api/paychangu/webhook`,
      return_url: `${SITE_URL}/payment/success?tx_ref=${tx_ref}`,
      tx_ref,
      customization: {
        title: 'CineWorld VIP Pass',
        description: '7 Days of Unlimited 4K Streaming · Zero Ads · Fast Downloads via Airtel Money, TNM Mpamba & Cards',
        logo: `${SITE_URL}/logo.png`,
      },
    };

    // POST to Paychangu's payment initiation endpoint
    const paychanguRes = await fetch('https://api.paychangu.com/payment', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PAYCHANGU_SECRET_KEY}`,
      },
      body: JSON.stringify(paychanguPayload),
    });

    const paychanguData = await paychanguRes.json();

    if (!paychanguRes.ok || paychanguData.status !== 'success') {
      console.error('Paychangu initiation error:', paychanguData);
      return NextResponse.json(
        { 
          success: false, 
          message: paychanguData?.message || 'Payment initiation failed. Please try again.',
          error: paychanguData,
        },
        { status: 400 }
      );
    }

    // Return the hosted checkout URL from Paychangu
    return NextResponse.json({
      success: true,
      tx_ref,
      payment_url: paychanguData.data?.checkout_url || paychanguData.data?.link,
      message: 'Payment initiated successfully',
    });

  } catch (error: any) {
    console.error('Paychangu initiate error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error while initiating payment. Check your PAYCHANGU_SECRET_KEY in .env.local',
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
