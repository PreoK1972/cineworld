import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in-memory — resets on server restart)
// For production, replace with Redis or a database
const attempts: Record<string, { count: number; lockedUntil: number }> = {};

const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';

  // Check if this IP is currently locked out
  const record = attempts[ip];
  if (record && record.lockedUntil > Date.now()) {
    const minutesLeft = Math.ceil((record.lockedUntil - Date.now()) / 60000);
    return NextResponse.json(
      { 
        success: false, 
        locked: true,
        message: `Too many failed attempts. Try again in ${minutesLeft} minute(s).`
      },
      { status: 429 }
    );
  }

  const { pin } = await req.json();

  // PIN is stored ONLY in .env.local — NEVER in the source code
  // .env.local is in .gitignore — it never goes to GitHub
  const correctPin = process.env.ADMIN_PIN;

  if (!correctPin) {
    return NextResponse.json(
      { success: false, message: 'Admin PIN not configured. Set ADMIN_PIN in .env.local' },
      { status: 500 }
    );
  }

  if (pin === correctPin) {
    // Correct PIN — clear any failed attempt records for this IP
    delete attempts[ip];

    // Generate a simple session token (in production use JWT or NextAuth)
    const sessionToken = Buffer.from(`${ip}:${Date.now()}:${correctPin}`).toString('base64');

    return NextResponse.json({ 
      success: true, 
      token: sessionToken,
      message: 'Authenticated successfully'
    });
  }

  // Wrong PIN — increment attempt counter
  if (!attempts[ip]) {
    attempts[ip] = { count: 0, lockedUntil: 0 };
  }
  attempts[ip].count += 1;

  const remaining = MAX_ATTEMPTS - attempts[ip].count;

  if (attempts[ip].count >= MAX_ATTEMPTS) {
    attempts[ip].lockedUntil = Date.now() + LOCKOUT_MS;
    return NextResponse.json(
      { 
        success: false, 
        locked: true,
        message: `Too many failed attempts. Admin access locked for 30 minutes.`
      },
      { status: 429 }
    );
  }

  return NextResponse.json(
    { 
      success: false, 
      message: `Incorrect PIN. ${remaining} attempt(s) remaining before lockout.`,
      attemptsRemaining: remaining
    },
    { status: 401 }
  );
}
