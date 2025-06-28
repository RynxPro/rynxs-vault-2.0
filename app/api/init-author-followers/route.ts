import { NextResponse } from 'next/server';
import { initializeAuthorFollowers } from '@/lib/actions';

export async function POST() {
  try {
    const result = await initializeAuthorFollowers();
    
    if (result.status === "SUCCESS") {
      return NextResponse.json({
        success: true,
        message: `Initialized followers for ${result.updatedCount} authors`,
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