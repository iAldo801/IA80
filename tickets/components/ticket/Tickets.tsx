'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconLucide } from '@/lib/icon-lucide';
import { truncateText } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import CloseTicketConfirmation from "../ui/close-ticket-confirmation";
import { Separator } from '../ui/separator';


export default function Tickets({ tickets, user, allUsers }: any) {
    const [assignments, setAssignments] = useState<{ [key: string]: string | null }>({});

    useEffect(() => {
        const initialAssignments = tickets.reduce((acc: any, ticket: any) => {
            if (ticket.assignments && ticket.assignments.length > 0) {
                acc[ticket.id] = ticket.assignments[0].assignedUserId;
            }
            return acc;
        }, {});
        setAssignments(initialAssignments);
    }, [tickets]);

    const handleAssign = async (ticketId: string, assignedUserId: string | null) => {
        await fetch('/api/tickets', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticketId, assignedUserId }),
        });

        setAssignments((prev) => ({
            ...prev,
            [ticketId]: assignedUserId,
        }));
    };

    const handleOpenTicket = async (ticketId: string) => {
        await fetch('/api/tickets/reopen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticketId }),
        });
        toast.success("Ticket reopened successfully");
    };

    const handlePriorityChange = async (ticketId: string, newPriority: string) => {
        await fetch('/api/tickets/priority', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticketId, priority: newPriority }),
        });
        toast.success("Priority updated successfully");
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl font-bold">Tickets</h1>
                <div className="grid grid-cols-3 gap-4">
                    {tickets.map((ticket: any) => (
                        <Card key={ticket.id} className="w-full max-w-md hover:ring-1 ring-blue-%00 transition-all duration-500">
                            <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm font-medium">Ticket #{ticket.id}</div>
                                            <Separator orientation="vertical" className="h-4" />
                                            <div className="text-sm font-medium text-muted-foreground">
                                                <Select value={ticket.priority} onValueChange={(newValue) => handlePriorityChange(ticket.id, newValue)}>
                                                    <SelectTrigger className={`text-white px-2 py-1 rounded-sm text-xs font-medium ${ticket.priority === 'low' ? 'bg-green-500' : ticket.priority === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                                        <SelectValue>
                                                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">
                                                            Low
                                                        </SelectItem>
                                                        <SelectItem value="medium">
                                                            Medium
                                                        </SelectItem>
                                                        <SelectItem value="high">
                                                            High
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`px-2 py-1 rounded-sm text-xs text-white font-medium ${ticket.status === 'open' ? 'bg-green-500' : 'bg-red-500'}`} >
                                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                            </div>
                                            <Tooltip delayDuration={0}>
                                                <Avatar className="w-8 h-8 border">
                                                    <TooltipTrigger className="w-full">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback>
                                                            {ticket.username.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right">
                                                        Created by {ticket.username}
                                                    </TooltipContent>
                                                </Avatar>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div>
                                            <h3 className="text-xl font-semibold">
                                                {ticket.title}
                                            </h3>
                                            <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: truncateText(ticket.body, 100) }} />
                                        </div>
                                        <div className="flex flex-wrap justify-between items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <IconLucide name='Calendar' className="w-4 h-4 text-muted-foreground" />
                                                <div className="text-sm text-muted-foreground">
                                                    Created {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <IconLucide name='User' className="w-4 h-4 text-muted-foreground" />
                                                <div className="text-sm text-muted-foreground">
                                                    {assignments[ticket.id] ? (
                                                        <span>Assigned to {allUsers.find((u: any) => u.id === assignments[ticket.id])?.username}</span>
                                                    ) : (
                                                        <span>Not assigned</span>
                                                    )}
                                                </div>
                                            </div>
                                            {ticket.status === 'closed' && (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <IconLucide name='Calendar' className="w-4 h-4 text-muted-foreground" />
                                                        <div className="text-sm text-muted-foreground">
                                                            Closed {formatDistanceToNow(ticket.closedAt, { addSuffix: true })}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <IconLucide name='Lock' className="w-4 h-4 text-muted-foreground" />
                                                        <div className="text-sm text-muted-foreground">
                                                            Closed by {ticket.closedBy}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Link>
                            <CardFooter className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {ticket.status !== 'closed' && (
                                        assignments[ticket.id] ? (
                                            <Button variant="outline" onClick={() => handleAssign(ticket.id, null)} size={"sm"} className="text-red-500 hover:bg-red-500 hover:text-red-50">
                                                <IconLucide name='UserX' className="w-4 h-4 mr-2" />
                                                Unassign
                                            </Button>
                                        ) : (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button variant="outline" size="sm" className="text-blue-500 hover:bg-blue-500 hover:text-blue-50">
                                                        <IconLucide name='User' className="w-4 h-4 mr-2" />
                                                        Assign
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Assign to</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {allUsers
                                                        .filter((u: any) => u.id !== ticket.userId)
                                                        .map((u: any) => (
                                                            <DropdownMenuItem key={u.id} onClick={() => handleAssign(ticket.id, u.id)}>
                                                                {u.username}
                                                            </DropdownMenuItem>
                                                        ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )
                                    )}
                                    {ticket.status === 'open' ? (
                                        <CloseTicketConfirmation ticketId={ticket.id} user={user} />
                                    ) : (
                                        <Button variant="outline" onClick={() => handleOpenTicket(ticket.id)} size={"sm"} className="text-green-500 hover:bg-green-500 hover:text-green-50">
                                            <IconLucide name='LockOpen' className="w-4 h-4 mr-2" />
                                            Reopen
                                        </Button>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground ml-2">
                                    Updated {formatDistanceToNow(ticket.updatedAt, { addSuffix: true })}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </TooltipProvider>
    );
}