import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma-client';
import { z } from 'zod';

const partySchema = z.object({
  nameEn: z.string().min(1),
  nameNp: z.string().min(1),
  shortName: z.string().min(1),
  symbol: z.string().url(),
  descriptionEn: z.string().optional(),
  descriptionNp: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await request.json();
    const body = partySchema.parse(json);

    const party = await prisma.party.create({
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

export async function GET() {
  try {
    const parties = await prisma.party.findMany({
      orderBy: {
        shortName: 'asc',
      },
    });

    return NextResponse.json(parties);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
