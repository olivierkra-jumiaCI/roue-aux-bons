import { checkHasPlayedToday } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const hasPlayed = await checkHasPlayedToday(email);

    return NextResponse.json({ hasPlayed });
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
