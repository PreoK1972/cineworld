import { NextRequest, NextResponse } from 'next/server';

const PAYCHANGU_SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY || '';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get('tx_ref');

  if (!tx_ref) {
    return NextResponse.json({ message: 'Missing transaction reference' }, { status: 400 });
  }

  try {
    // Verify transaction directly with Paychangu API
    const paychanguRes = await fetch(`https://api.paychangu.com/verify-payment/${tx_ref}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${PAYCHANGU_SECRET_KEY}`,
      },
    });

    const paychanguData = await paychanguRes.json();

    if (!paychanguRes.ok || paychanguData.status !== 'success') {
      return NextResponse.json(
        { success: false, message: paychanguData?.message || 'Transaction verification failed' },
        { status: 400 }
      );
    }

    const txData = paychanguData.data;

    return NextResponse.json({
      success: true,
      status: txData.status,
      tx_ref: txData.tx_ref,
      amount: txData.amount,
      customer: txData.customer,
      isVerified: txData.status === 'successful' || txData.status === 'success',
    });

  } catch (error: any) {
    console.error('Paychangu verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Server verification error', error: error?.message },
      { status: 500 }
    );
  }
}
