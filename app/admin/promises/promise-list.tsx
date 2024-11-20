'use client';

import { Promise, Status } from '@prisma/client';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

interface PromiseListProps {
  promises: Promise[];
}

export function PromiseList({ promises }: PromiseListProps) {
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusUpdate = async (promiseId: string, newStatus: Status) => {
    try {
      setUpdatingId(promiseId);
      const response = await fetch(`/api/promises/${promiseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast({
        title: "Success",
        description: `Promise ${newStatus.toLowerCase()}`,
      });

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating promise:', error);
      toast({
        title: "Error",
        description: "Failed to update promise status",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: Status) => {
    const variants = {
      [Status.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-200",
      [Status.APPROVED]: "bg-green-100 text-green-800 border-green-200",
      [Status.REJECTED]: "bg-red-100 text-red-800 border-red-200",
      [Status.IN_PROGRESS]: "bg-blue-100 text-blue-800 border-blue-200",
      [Status.FULFILLED]: "bg-purple-100 text-purple-800 border-purple-200",
      [Status.BROKEN]: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Promiser</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Party</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promises.map((promise) => (
            <TableRow key={promise.id}>
              <TableCell className="font-medium">{promise.promiserName}</TableCell>
              <TableCell className="max-w-md">
                <p className="line-clamp-2">{promise.description}</p>
              </TableCell>
              <TableCell>{promise.party}</TableCell>
              <TableCell>{format(new Date(promise.promisedDate), 'MMM d, yyyy')}</TableCell>
              <TableCell>{getStatusBadge(promise.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {promise.status === Status.PENDING && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(promise.id, Status.APPROVED)}
                        disabled={updatingId === promise.id}
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(promise.id, Status.REJECTED)}
                        disabled={updatingId === promise.id}
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {promise.articleLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="ml-2"
                    >
                      <a href={promise.articleLink} target="_blank" rel="noopener noreferrer">
                        View Source
                      </a>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {promises.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                No promises found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
