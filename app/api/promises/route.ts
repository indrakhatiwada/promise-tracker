import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { Status } from '@prisma/client';
import { z } from 'zod';

const createPromiseSchema = z.object({
  promiserName: z.string().min(1),
  description: z.string().min(1),
  party: z.string().min(1),
  articleLink: z.string().url().optional(),
  screenshot: z.string().optional(),
  promisedDate: z.string().transform((str) => new Date(str)),
  imageUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = createPromiseSchema.parse(json);

    const promise = await db.promise.create({
      data: {
        ...body,
        status: Status.PENDING,
        userId: user.id,
      },
    });

    return NextResponse.json(promise);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    console.error('Error creating promise:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const promises = await db.promise.findMany({
      where: {
        status: Status.APPROVED
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(promises);
  } catch (error) {
    console.error('Error fetching promises:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
