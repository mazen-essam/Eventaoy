import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import { Types } from 'mongoose';

// Define route params type for type safety
type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * GET /api/events/[slug]
 * Fetches a single events by its slug
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Connect to database
    await connectDB();

    // Await and extract slug from params
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { message: 'Invalid or missing slug parameter' },
        { status: 400 }
      );
    }

    // Sanitize slug (remove any potential malicious input)
    const sanitizedSlug = slug.trim().toLowerCase();

    // Query events by slug
    const event = await Event.findOne({ slug: sanitizedSlug }).lean();

    // Handle events not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug '${sanitizedSlug}' not found` },
        { status: 404 }
      );
    }

    // Return successful response with events data
    return NextResponse.json(
      { message: 'Event fetched successfully', event },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching events by slug:', error);
    }

    // Handle specific error types
    if (error instanceof Error) {
      // Handle database connection errors
      if (error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { message: 'Database configuration error' },
          { status: 500 }
        );
      }

      // Return generic error with error message
      return NextResponse.json(
        { message: 'Failed to fetch events', error: error.message },
        { status: 500 }
      );
    }

    // Handle unknown errors
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/events/[id]
 * Deletes a single event by its MongoDB ObjectId (id is passed in the same dynamic segment)
 */
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Connect to database
    await connectDB();

    // Await and extract id (comes in as `slug` param from the dynamic segment)
    const { slug } = await params;

    // Validate id presence
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        { message: 'Missing event id' },
        { status: 400 }
      );
    }

    const id = slug.trim();

    // Validate MongoDB ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid event id' },
        { status: 400 }
      );
    }

    // Delete event
    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting event:', error);
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { message: 'Failed to delete event', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

