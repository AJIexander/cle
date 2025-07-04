import type { Server } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const statusVariantMap = {
  Online: "default",
  Offline: "secondary",
  Warning: "destructive",
} as const;

export function ServerTable({ servers }: { servers: Server[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead className="text-right">Disk Usage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servers.map((server) => {
            const usage = (server.usedDisk / server.totalDisk) * 100;
            return (
              <TableRow key={server.id}>
                <TableCell className="font-medium">{server.name}</TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[server.status]}>
                    {server.status}
                  </Badge>
                </TableCell>
                <TableCell>{server.ipAddress}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {server.usedDisk} / {server.totalDisk} GB
                    </span>
                    <div className="w-24">
                      <Progress
                        value={usage}
                        className={cn(
                          "h-2",
                          usage > 85 && "[&>div]:bg-destructive"
                        )}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
