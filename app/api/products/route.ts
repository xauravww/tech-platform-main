import { NextResponse } from 'next/server';
import Product from '@/app/models/Product';
import dbConnect from '@/app/lib/mongodb';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    // Extract page, pageSize, and search query
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const search = searchParams.get('search') || '';

    // Validation of page and pageSize to ensure they are positive integers
    if (isNaN(page) || page < 1) {
      return NextResponse.json({ message: 'Invalid page number' }, { status: 400 });
    }

    if (isNaN(pageSize) || pageSize < 1) {
      return NextResponse.json({ message: 'Invalid page size' }, { status: 400 });
    }

    // Set the limit and skip values based on the page number and page size
    const limit = pageSize;
    const skip = (page - 1) * limit;

    // Build search query for product name
    const query = search
      ? { name: { $regex: search, $options: 'i' } }  // Case-insensitive search
      : {}; // If no search query, return all products

    // Get the products for the current page
    const productsCollection = Product;
    const products = await productsCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get the total number of products matching the query
    const total = await productsCollection.countDocuments(query);

    // Check if there are more products available
    const hasMore = products.length === limit;

    // Return the response with the products and pagination info
    return NextResponse.json({
      products,
      total,
      page,
      pageSize: limit,
      hasMore,
    }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      message: 'Error fetching products',
      error: errorMessage,
    }, { status: 500 });
  }
}
