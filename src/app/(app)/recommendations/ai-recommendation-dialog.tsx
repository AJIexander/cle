"use client";

import { useState, useEffect } from "react";
import type { Recommendation } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Shield, AlertTriangle } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { getAiDeletionRecommendation } from "@/app/_actions/recommendations";
import type { RecommendSafeDeletionsOutput } from "@/ai/flows/recommend-safe-deletions";

interface AiRecommendationDialogProps {
  item: Recommendation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AiRecommendationDialog({
  item,
  open,
  onOpenChange,
}: AiRecommendationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendSafeDeletionsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && item) {
      setIsLoading(true);
      setResult(null);
      setError(null);
      
      const input = {
        filePath: item.path,
        fileType: item.type,
        fileSize: formatBytes(item.size),
        lastModified: item.lastModified,
      };

      getAiDeletionRecommendation(input)
        .then((response) => {
          if (response.success) {
            setResult(response.data);
          } else {
            setError(response.error);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, item]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Deletion Recommendation</DialogTitle>
          <DialogDescription>
            Analysis for: <span className="font-semibold">{item?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <div>
              <Alert
                variant={result.isSafeToDelete ? "default" : "destructive"}
                className={
                  result.isSafeToDelete
                    ? "border-green-500/50 bg-green-500/10"
                    : "border-red-500/50 bg-red-500/10"
                }
              >
                {result.isSafeToDelete ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <AlertTitle className="flex items-center gap-2">
                  {result.isSafeToDelete
                    ? "Safe to Delete"
                    : "Not Recommended to Delete"}
                </AlertTitle>
                <AlertDescription>{result.reason}</AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
