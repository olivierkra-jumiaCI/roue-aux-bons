import { getAdminStats } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

// Optional: In a real app, you would want to add authentication here
// to prevent unauthorized access to the admin stats.

export async function GET() {
  try {
    const stats = await getAdminStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
