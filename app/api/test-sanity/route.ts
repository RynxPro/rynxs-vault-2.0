import { NextResponse } from 'next/server';
import writeClient from '@/sanity/lib/writeClient';
import { client } from '@/sanity/lib/client';

export async function GET() {
  try {
    console.log("=== API ROUTE DEBUG ===");
    console.log("Token available:", !!process.env.SANITY_API_TOKEN);
    console.log("Token starts with:", process.env.SANITY_API_TOKEN?.substring(0, 10) + "...");
    
    // Test read
    const readTest = await client.fetch(`*[_type == "post"][0] { _id, title }`);
    console.log("Read test:", readTest);
    
    // Test write
    const writeTest = await writeClient.create({
      _type: "test",
      title: "API Test",
      timestamp: new Date().toISOString()
    });
    console.log("Write test:", writeTest);
    
    // Clean up
    await writeClient.delete(writeTest._id);
    console.log("Delete test successful");
    
    return NextResponse.json({ 
      success: true, 
      readTest, 
      writeTest: { _id: writeTest._id },
      tokenAvailable: !!process.env.SANITY_API_TOKEN 
    });
  } catch (error) {
    console.error("API test failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      tokenAvailable: !!process.env.SANITY_API_TOKEN 
    }, { status: 500 });
  }
} 