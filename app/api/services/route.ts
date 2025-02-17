import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Service from '@/app/models/Service';


export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('pageSize') || '10';
    const search = searchParams.get('search') || '';

    const pageNumber = parseInt(page, 10);
    const limit = parseInt(pageSize, 10);
    const skip = (pageNumber - 1) * limit;
    const query = search
      ? {
          $or: [
            { category: { $regex: search, $options: 'i' } },
            { 'sub_services.name': { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const services = await Service.find(query).skip(skip).limit(limit).lean();
    const total = await Service.countDocuments(query);

    return NextResponse.json({ services, total, page: pageNumber, pageSize: limit }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching services', error: errorMessage }, { status: 500 });
  }
}
