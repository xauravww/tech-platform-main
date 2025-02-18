import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Service from '@/app/models/Service';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1'; // Default to page 1
    const pageSize = searchParams.get('pageSize') || '10'; // Default to 10 items per page
    const search = searchParams.get('search') || ''; // Search term (if any)

    // Ensure valid page and pageSize values (minimum 1)
    const pageNumber = Math.max(parseInt(page, 10), 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(pageSize, 10), 1); // Ensure pageSize is at least 1

    const skip = (pageNumber - 1) * limit; // Calculate the skip value for pagination

    // Build the query for search (if any)
    const query = search
      ? {
          $or: [
            { category: { $regex: search, $options: 'i' } },
            { 'sub_services.name': { $regex: search, $options: 'i' } },
          ],
        }
      : {}; // If no search term, return all services

    // Query the Service collection with pagination
    const services = await Service.find(query).skip(skip).limit(limit).lean();

    // Count the total number of services matching the query
    const total = await Service.countDocuments(query);

    // Determine if there are more results based on the current page
    const hasMore = total > pageNumber * limit;

    return NextResponse.json({
      services,
      total,
      page: pageNumber,
      pageSize: limit,
      hasMore,
    }, { status: 200 });

  } catch (error) {
    // Error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching services:', errorMessage); // Log error for debugging
    return NextResponse.json({ message: 'Error fetching services', error: errorMessage }, { status: 500 });
  }
}
