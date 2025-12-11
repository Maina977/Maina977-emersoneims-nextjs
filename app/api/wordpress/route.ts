/**
 * WordPress API Integration Route
 * Handles communication with WordPress REST API
 */

import { NextRequest, NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || '';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'posts';
  const params = searchParams.get('params') || '';

  if (!WORDPRESS_API_URL) {
    return NextResponse.json(
      { error: 'WordPress API URL not configured' },
      { status: 500 }
    );
  }

  try {
    const url = `${WORDPRESS_API_URL}/${endpoint}${params ? `?${params}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('WordPress API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from WordPress API', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { endpoint, data } = body;

  if (!WORDPRESS_API_URL) {
    return NextResponse.json(
      { error: 'WordPress API URL not configured' },
      { status: 500 }
    );
  }

  try {
    const url = `${WORDPRESS_API_URL}/${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('WordPress API Error:', error);
    return NextResponse.json(
      { error: 'Failed to post to WordPress API', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}




