'use client';

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  FULFILLED: "bg-green-100 text-green-800",
  BROKEN: "bg-gray-100 text-gray-800",
};

export function PromisesTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Politician</TableHead>
            <TableHead>Promise</TableHead>
            <TableHead>Party</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promises.map((promise) => (
            <TableRow key={promise.id}>
              <TableCell className="font-medium">{promise.politician}</TableCell>
              <TableCell>{promise.description}</TableCell>
              <TableCell>{promise.party}</TableCell>
              <TableCell>
                <Badge className={statusColors[promise.status]}>
                  {promise.status}
                </Badge>
              </TableCell>
              <TableCell>{promise.date}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Fulfilled
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <XCircle className="mr-2 h-4 w-4" />
                      Mark as Broken
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const promises = [
  {
    id: 1,
    politician: "John Doe",
    description: "Reduce taxes by 10%",
    party: "Democratic",
    status: "PENDING",
    date: "2024-01-15",
  },
  {
    id: 2,
    politician: "Jane Smith",
    description: "Build new public parks",
    party: "Republican",
    status: "FULFILLED",
    date: "2024-01-10",
  },
  {
    id: 3,
    politician: "Mike Johnson",
    description: "Improve public transport",
    party: "Democratic",
    status: "BROKEN",
    date: "2024-01-05",
  },
  {
    id: 4,
    politician: "Sarah Wilson",
    description: "Increase education funding",
    party: "Independent",
    status: "APPROVED",
    date: "2024-01-01",
  },
];
