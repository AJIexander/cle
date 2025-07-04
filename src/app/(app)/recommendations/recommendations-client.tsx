"use client";

import { useState, useMemo } from "react";
import type { Recommendation, Server } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatBytes } from "@/lib/utils";
import { Sparkles, Trash2, Filter } from "lucide-react";
import { AiRecommendationDialog } from "./ai-recommendation-dialog";

export function RecommendationsClient({
  initialRecommendations,
  servers,
}: {
  initialRecommendations: Recommendation[];
  servers: Server[];
}) {
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [selected, setSelected] = useState<string[]>([]);
  const [serverFilter, setServerFilter] = useState<string[]>([]);
  const [dialogItem, setDialogItem] = useState<Recommendation | null>(null);

  const { toast } = useToast();

  const filteredRecommendations = useMemo(() => {
    if (serverFilter.length === 0) {
      return recommendations;
    }
    return recommendations.filter((r) => serverFilter.includes(r.server));
  }, [recommendations, serverFilter]);

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? filteredRecommendations.map((r) => r.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelected((prev) => [...prev, id]);
    } else {
      setSelected((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to delete.",
        variant: "destructive",
      });
      return;
    }

    setRecommendations((prev) =>
      prev.filter((r) => !selected.includes(r.id))
    );
    toast({
      title: "Deletion Successful",
      description: `${selected.length} items have been deleted.`,
    });
    setSelected([]);
  };

  return (
    <>
      <AiRecommendationDialog
        item={dialogItem}
        open={!!dialogItem}
        onOpenChange={(open) => !open && setDialogItem(null)}
      />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cleanup Recommendations</CardTitle>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter Servers
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by server</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {servers.map((server) => (
                    <DropdownMenuCheckboxItem
                      key={server.id}
                      checked={serverFilter.includes(server.name)}
                      onCheckedChange={(checked) => {
                        setServerFilter((prev) =>
                          checked
                            ? [...prev, server.name]
                            : prev.filter((s) => s !== server.name)
                        );
                      }}
                    >
                      {server.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleDeleteSelected} disabled={selected.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selected.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead padding="checkbox">
                    <Checkbox
                      checked={
                        selected.length > 0 &&
                        selected.length === filteredRecommendations.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>File/Folder</TableHead>
                  <TableHead>Server</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecommendations.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(item.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(item.id, !!checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.server}</TableCell>
                    <TableCell>{formatBytes(item.size)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.reason}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-xs">
                      {item.path}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDialogItem(item)}
                      >
                        <Sparkles className="mr-2 h-4 w-4 text-accent" />
                        AI Advice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
