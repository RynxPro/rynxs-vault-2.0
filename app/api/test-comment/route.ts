import { NextRequest, NextResponse } from 'next/server';
import { addComment } from '@/lib/actions';

export async function POST(request: NextRequest) {
  try {
    console.log("=== TEST COMMENT API CALLED ===");
    
    const body = await request.json();
    const { comment, postId } = body;
    
    console.log("Test comment data:", { comment, postId });
    
    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("postId", postId);
    
    const result = await addComment({}, formData);
    
    console.log("Test comment result:", result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in test-comment API:", error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 