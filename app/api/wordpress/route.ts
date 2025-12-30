/**
 * WordPress API Integration Route
 * Handles communication with WordPress REST API
 * Note: Currently disabled - WordPress site not configured
 */

import { NextRequest, NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || '';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'posts';
  const params = new URLSearchParams(searchParams);
  params.delete('endpoint');

  // WordPress integration not yet configured
  if (!WORDPRESS_API_URL) {
    return NextResponse.json(
      { 
        error: 'WordPress integration not configured', 
        message: 'This feature will be available once WordPress is set up.',
        available: false 
      },
      { status: 503 }
    );
  }

  try {
    const query = params.toString();
    const url = `${WORDPRESS_API_URL}/${endpoint}${query ? `?${query}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error(`WordPress API returned ${contentType || 'unknown content'} instead of JSON`);
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

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error(`WordPress API returned ${contentType || 'unknown content'} instead of JSON`);
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




