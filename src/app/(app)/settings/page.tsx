"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useServers } from "@/hooks/use-servers";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const serverSchema = z.object({
  name: z.string().min(1, "Server name is required."),
  ipAddress: z.string().min(1, "IP address is required.").refine(val => {
    const parts = val.split('.');
    return parts.length === 4 && parts.every(part => {
      const num = parseInt(part, 10);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  }, "Please enter a valid IPv4 address."),
  totalDisk: z.coerce.number().positive("Total disk must be a positive number."),
  usedDisk: z.coerce.number().nonnegative("Used disk must be a non-negative number."),
}).refine(data => data.usedDisk <= data.totalDisk, {
  message: "Used disk cannot be greater than total disk.",
  path: ["usedDisk"],
});

type ServerFormValues = z.infer<typeof serverSchema>;

export default function SettingsPage() {
  const { servers, addServer, deleteServer, isLoaded } = useServers();
  const { toast } = useToast();

  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      ipAddress: "",
      totalDisk: 100,
      usedDisk: 50,
    },
  });

  function onSubmit(values: ServerFormValues) {
    addServer(values);
    toast({
      title: "Server Added",
      description: `Server "${values.name}" has been added.`,
    });
    form.reset();
  }
  
  function handleDelete(serverId: string, serverName: string) {
    deleteServer(serverId);
    toast({
        title: "Server Deleted",
        description: `Server "${serverName}" has been removed.`,
        variant: "destructive"
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add New Server</CardTitle>
          <CardDescription>
            Add a new server to the monitoring list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server Name</FormLabel>
                    <FormControl>
                      <Input placeholder="PROD-WEB-02" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="totalDisk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Disk (GB)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="usedDisk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Used Disk (GB)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">
                <PlusCircle className="mr-2" />
                Add Server
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Managed Servers</CardTitle>
          <CardDescription>
            List of servers currently being monitored.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Disk</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isLoaded && Array.from({length: 3}).map((_, i) => (
                             <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-8 inline-block" /></TableCell>
                            </TableRow>
                        ))}
                        {isLoaded && servers.map((server) => (
                            <TableRow key={server.id}>
                                <TableCell className="font-medium">{server.name}</TableCell>
                                <TableCell>{server.ipAddress}</TableCell>
                                <TableCell>{server.usedDisk} / {server.totalDisk} GB</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(server.id, server.name)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {isLoaded && servers.length === 0 && (
                    <p className="text-center text-muted-foreground p-4">No servers configured.</p>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
