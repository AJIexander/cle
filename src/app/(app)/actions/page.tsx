"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { runCleanupAction } from "./winrm-actions";
import { useServers } from "@/hooks/use-servers";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, HardDrive, Loader2, Terminal } from "lucide-react";

const formSchema = z.object({
  serverIp: z.string().min(1, "Please select a server."),
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function ActionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ stdout?: string; stderr?: string } | null>(null);
  const { servers } = useServers();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverIp: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    const response = await runCleanupAction(values);
    setResult(response);
    setIsLoading(false);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Run Cleanup</CardTitle>
          <CardDescription>
            Connect to a Windows server via WinRM to run a simulated cleanup script. Enter credentials to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="serverIp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a server to connect to" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {servers
                          .filter(s => s.status !== 'Offline')
                          .map(server => (
                            <SelectItem key={server.id} value={server.ipAddress}>
                              {server.name} ({server.ipAddress})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="administrator" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Start Cleanup
              </Button>
            </form>
          </Form>

          {result && (
            <div className="mt-6 space-y-2 rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 font-semibold text-card-foreground">
                    <Terminal className="h-5 w-5" />
                    <h2>Execution Result</h2>
                </div>
                {result.stderr ? (
                  <div className="text-destructive">
                    <h3 className="font-semibold">Error:</h3>
                    <pre className="mt-2 whitespace-pre-wrap rounded-md bg-destructive/10 p-4 font-mono text-sm">
                      {result.stderr}
                    </pre>
                  </div>
                ) : (
                   <div className="text-foreground">
                    <h3 className="font-semibold">Output:</h3>
                    <pre className="mt-2 whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-sm">
                      {result.stdout || "No output received."}
                    </pre>
                  </div>
                )}
            </div>
          )}

        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Resize Disks</CardTitle>
          <CardDescription>
            Attempt to automatically resize partitions on servers with low disk space. This requires unallocated space to be available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
             <p className="text-sm text-muted-foreground">
                Note: This is a placeholder for actual disk resizing logic. In a real scenario, this would trigger a carefully planned and tested script.
              </p>
            <Button disabled>
              <HardDrive className="mr-2 h-4 w-4" />
              Run Resize (Not Implemented)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
