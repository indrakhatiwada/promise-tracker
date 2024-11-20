'use client';

import { Party } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

interface PartyListProps {
  parties: Party[];
}

export function PartyList({ parties: initialParties }: PartyListProps) {
  const [parties, setParties] = useState(initialParties);
  const router = useRouter();

  async function togglePartyStatus(partyId: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/parties/${partyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) throw new Error('Failed to update party status');

      setParties(parties.map(party => 
        party.id === partyId 
          ? { ...party, isActive: !party.isActive }
          : party
      ));
      router.refresh();
    } catch (error) {
      console.error('Error updating party status:', error);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Symbol</TableHead>
          <TableHead>Short Name</TableHead>
          <TableHead>English Name</TableHead>
          <TableHead>Nepali Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parties.map((party) => (
          <TableRow key={party.id}>
            <TableCell>
              <div className="relative h-10 w-10">
                <Image
                  src={party.symbol}
                  alt={`${party.nameEn} symbol`}
                  fill
                  className="object-contain rounded-sm"
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">{party.shortName}</TableCell>
            <TableCell>{party.nameEn}</TableCell>
            <TableCell className="font-nepali">{party.nameNp}</TableCell>
            <TableCell>
              <Switch
                checked={party.isActive}
                onCheckedChange={() => togglePartyStatus(party.id, party.isActive)}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/parties/${party.id}/edit`)}
                >
                  Edit
                </Button>
                <Badge 
                  variant={party.isActive ? "success" : "secondary"}
                  className="ml-2"
                >
                  {party.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
