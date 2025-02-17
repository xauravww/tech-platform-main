// /app/api/products/route.ts

import { NextResponse } from 'next/server';
import Product from '@/app/models/Product';
import dbConnect from '@/app/lib/mongodb';

export async function GET(request: Request) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';
    const search = searchParams.get('search') || '';

    const pageNumber = parseInt(page, 10);
    const limit = parseInt(pageSize, 10);
    const skip = (pageNumber - 1) * limit;
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const productsCollection = Product
    const products = await productsCollection.find(query).skip(skip).limit(limit).lean();
    const total = await productsCollection.countDocuments(query);

    return NextResponse.json({ products, total, page: pageNumber, pageSize: limit }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching products',error:errorMessage }, { status: 500 });
  }
}
