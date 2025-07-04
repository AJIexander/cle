import { logs } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const levelColorMap = {
  INFO: "text-foreground",
  WARNING: "text-yellow-500",
  ERROR: "text-red-500",
};

export default function LogsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Logger</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] rounded-md border p-4">
          <div className="font-mono text-sm">
            {logs.slice().reverse().map((log) => (
              <div key={log.id} className="flex items-start gap-4 mb-2">
                <span className="text-muted-foreground">{log.timestamp}</span>
                <span className={cn("font-semibold", levelColorMap[log.level])}>[{log.level}]</span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
