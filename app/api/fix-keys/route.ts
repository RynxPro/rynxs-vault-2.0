import { NextRequest, NextResponse } from 'next/server';
import { fixMissingKeys } from '@/lib/actions';

export async function POST(request: NextRequest) {
  try {
    const result = await fixMissingKeys();
    
    if (result.status === 'SUCCESS') {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error in fix-keys API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 