"use server";

import {
  recommendSafeDeletions,
  type RecommendSafeDeletionsInput,
} from "@/ai/flows/recommend-safe-deletions";

export async function getAiDeletionRecommendation(
  input: RecommendSafeDeletionsInput
) {
  try {
    const result = await recommendSafeDeletions(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("AI recommendation error:", error);
    return { success: false, error: "Failed to get AI recommendation." };
  }
}
