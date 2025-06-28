import { NextResponse } from 'next/server';
import { initializeGameFollowers } from '@/lib/actions';

export async function POST() {
  try {
    const result = await initializeGameFollowers();
    
    if (result.status === "SUCCESS") {
      return NextResponse.json({
        success: true,
        message: `Initialized followers for ${result.updatedCount} games`,
        updatedCount: result.updatedCount
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
} 