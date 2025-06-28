import { NextResponse } from 'next/server';
import { initializeGameViews } from '@/lib/actions';

export async function POST() {
  try {
    const result = await initializeGameViews();
    
    if (result.status === "SUCCESS") {
      return NextResponse.json({
        success: true,
        message: `Initialized views for ${result.updatedCount} games`,
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