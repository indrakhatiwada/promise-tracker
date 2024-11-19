import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'FULFILLED', 'BROKEN']),
});

export async function PATCH(
  request: Request,
  { params }: { params: { promiseId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = updateSchema.parse(json);

    const promise = await prisma.promise.update({
      where: {
        id: params.promiseId,
      },
      data: {
        status: body.status,
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

export async function GET(
  _request: Request,
  { params }: { params: { promiseId: string } }
) {
  try {
    const promise = await prisma.promise.findUnique({
      where: {
        id: params.promiseId,
      },
      include: {
        user: true,
      },
    });

    if (!promise) {
      return new NextResponse('Not Found', { status: 404 });
    }

    return NextResponse.json(promise);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
