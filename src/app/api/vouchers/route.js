import { getAvailableVouchersCount } from '@/lib/googleSheets';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const count = await getAvailableVouchersCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Vouchers API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
