import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma-client';
import { z } from 'zod';

const partyUpdateSchema = z.object({
  nameEn: z.string().min(1).optional(),
  nameNp: z.string().min(1).optional(),
  shortName: z.string().min(1).optional(),
  symbol: z.string().url().optional(),
  descriptionEn: z.string().optional(),
  descriptionNp: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: { partyId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = partyUpdateSchema.parse(json);

    const party = await prisma.party.update({
      where: { id: params.partyId },
      data: body,
    });

    return NextResponse.json(party);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { partyId: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const { isActive } = partyUpdateSchema.parse(json);

    const party = await prisma.party.update({
      where: { id: params.partyId },
      data: { isActive },
    });

    return NextResponse.json(party);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { partyId: string } }
) {
  try {
    const party = await prisma.party.findUnique({
      where: { id: params.partyId },
    });

    if (!party) {
      return new NextResponse('Party not found', { status: 404 });
    }

    return NextResponse.json(party);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
