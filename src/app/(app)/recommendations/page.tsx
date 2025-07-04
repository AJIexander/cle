"use client";

import { recommendations } from "@/lib/mock-data";
import { useServers } from "@/hooks/use-servers";
import { RecommendationsClient } from "./recommendations-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecommendationsPage() {
  const { servers, isLoaded } = useServers();
  // In a real app, you'd fetch this data from an API
  const allRecommendations = recommendations;

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <RecommendationsClient
      initialRecommendations={allRecommendations}
      servers={servers}
    />
  );
}
