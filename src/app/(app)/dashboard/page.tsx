"use client";

import { useServers } from "@/hooks/use-servers";
import { recommendations } from "@/lib/mock-data";
import { StatCard } from "./stat-card";
import { ServerTable } from "./server-table";
import { DiskUsageChart } from "./disk-usage-chart";
import { AlertTriangle, Server, Sparkles, HardDrive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { servers, isLoaded } = useServers();

  const onlineServers = servers.filter((s) => s.status === "Online");
  const lowSpaceServers = servers.filter(
    (s) => s.status !== "Offline" && (s.usedDisk / s.totalDisk) * 100 > 85
  );
  const totalDisk = servers.reduce((acc, s) => acc + s.totalDisk, 0);
  const usedDisk = servers.reduce((acc, s) => acc + s.usedDisk, 0);


  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Servers"
          value={servers.length.toString()}
          icon={Server}
          description={`${onlineServers.length} online`}
        />
        <StatCard
          title="Low Space Alerts"
          value={lowSpaceServers.length.toString()}
          icon={AlertTriangle}
          variant={lowSpaceServers.length > 0 ? "destructive" : "default"}
          description="Servers >85% disk usage"
        />
        <StatCard
          title="Cleanup Recommendations"
          value={recommendations.length.toString()}
          icon={Sparkles}
          description="Potential files to delete"
        />
        <StatCard
          title="Total Storage"
          value={`${(totalDisk / 1024).toFixed(1)} TB`}
          icon={HardDrive}
          description={`${(usedDisk / 1024).toFixed(1)} TB used`}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Server Status</CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoaded && 
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            }
            {isLoaded && <ServerTable servers={servers} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Disk Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
             {!isLoaded && <Skeleton className="h-[300px] w-full" /> }
             {isLoaded && <DiskUsageChart servers={servers} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
