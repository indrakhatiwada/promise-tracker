import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { Status } from '@prisma/client';

const updateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'FULFILLED', 'BROKEN']),
});

export async function PATCH(
  request: Request,
  { params }: { params: { promiseId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.role || user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = updateSchema.parse(json);

    const promise = await db.promise.update({
      where: {
        id: params.promiseId,
      },
      data: {
        status: body.status as Status,
      },
    });

    return NextResponse.json(promise);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    console.error('Error updating promise:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { promiseId: string } }
) {
  try {
    const promise = await db.promise.findUnique({
      where: {
        id: params.promiseId
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!promise) {
      return new NextResponse('Promise not found', { status: 404 });
    }

    return NextResponse.json(promise);
  } catch (error) {
    console.error('Error fetching promise:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
