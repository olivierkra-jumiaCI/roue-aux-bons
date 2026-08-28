import { processSpinResult } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, phone, address, result } = await request.json();

    if (!name || !email || !phone || !result) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (result === 'Win' && !address) {
      return NextResponse.json({ error: 'Address is required for winners' }, { status: 400 });
    }

    try {
      const response = await processSpinResult(name, email, phone, address, result);
      return NextResponse.json(response);
    } catch (error) {
      console.error("Spin API Error:", error);
      return NextResponse.json({ error: 'Failed to process spin' }, { status: 500 });
    }
  } catch (error) {
    console.error("Request Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
