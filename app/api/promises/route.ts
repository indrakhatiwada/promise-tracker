import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const promiseSchema = z.object({
  promiserName: z.string().min(1),
  description: z.string().min(10),
  party: z.enum(['DEMOCRATIC', 'REPUBLICAN', 'INDEPENDENT', 'OTHER']),
  articleLink: z.string().url(),
  promisedDate: z.string().transform((str) => new Date(str)),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = promiseSchema.parse(json);

    const promise = await prisma.promise.create({
      data: {
        ...body,
        userId: user.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json(promise);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const promises = await prisma.promise.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(promises);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
