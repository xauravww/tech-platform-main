import { NextResponse } from 'next/server';
import Research from '@/app/models/Research';
import dbConnect from '@/app/lib/mongodb';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1'; // Default to page 1
    const pageSize = searchParams.get('pageSize') || '10'; // Default to 10 items per page
    const search = searchParams.get('search') || ''; // Search term (if any)

    // Ensure page and pageSize are integers
    const pageNumber = Math.max(parseInt(page, 10), 1); // Ensure page is at least 1
    const limit = Math.max(parseInt(pageSize, 10), 1); // Ensure pageSize is at least 1

    const skip = (pageNumber - 1) * limit; // Calculate skip value based on page

    // Construct the query for search (if any)
    const query = search
      ? { title: { $regex: search, $options: 'i' } } // Search by title if search term is provided
      : {}; // If no search term, return all research articles

    // Query the Research collection for paginated results
    const researchesCollection = Research;
    const researches = await researchesCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get the total count of documents matching the query
    const total = await researchesCollection.countDocuments(query);
    
    // Determine if there are more results
    const hasMore = researches.length === limit;

    // Return the paginated data with additional metadata
    return NextResponse.json(
      { researches, total, page: pageNumber, pageSize: limit, hasMore },
      { status: 200 }
    );
  } catch (error) {
    // Improved error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching researches:', errorMessage); // Log the error for debugging
    return NextResponse.json(
      { message: 'Error fetching researches', error: errorMessage },
      { status: 500 }
    );
  }
}
