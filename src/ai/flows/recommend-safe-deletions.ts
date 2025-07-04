'use server';
/**
 * @fileOverview An AI agent that recommends safe deletions based on file analysis and software vulnerability checks.
 *
 * - recommendSafeDeletions - A function that handles the recommendation process.
 * - RecommendSafeDeletionsInput - The input type for the recommendSafeDeletions function.
 * - RecommendSafeDeletionsOutput - The return type for the recommendSafeDeletions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendSafeDeletionsInputSchema = z.object({
  filePath: z.string().describe('The full path to the file or folder being considered for deletion.'),
  fileType: z.string().describe('The type of the file (e.g., exe, zip, folder).'),
  fileSize: z.string().describe('The size of the file or folder in human-readable format (e.g., 20MB, 1.5GB).'),
  lastModified: z.string().describe('The last modified date of the file or folder.'),
});
export type RecommendSafeDeletionsInput = z.infer<typeof RecommendSafeDeletionsInputSchema>;

const RecommendSafeDeletionsOutputSchema = z.object({
  isSafeToDelete: z.boolean().describe('Whether the AI recommends deleting the file or folder.'),
  reason: z.string().describe('The AI’s reasoning for its recommendation, including vulnerability checks and usage patterns.'),
});
export type RecommendSafeDeletionsOutput = z.infer<typeof RecommendSafeDeletionsOutputSchema>;

export async function recommendSafeDeletions(input: RecommendSafeDeletionsInput): Promise<RecommendSafeDeletionsOutput> {
  return recommendSafeDeletionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendSafeDeletionsPrompt',
  input: {schema: RecommendSafeDeletionsInputSchema},
  output: {schema: RecommendSafeDeletionsOutputSchema},
  prompt: `You are an AI assistant specializing in determining whether a file or folder is safe to delete from a computer system.

You will receive information about a file or folder, including its path, type, size, and last modified date. You must evaluate the information to determine if it is safe to delete.

Consider the following factors:

*   **File Type:** Executable files (.exe, .msi) should be scrutinized for potential vulnerabilities. Archives (.zip, .rar, .7z) may contain valuable data, but could also be old downloaded software with vulnerabilities.
*   **File Age:** Older files are generally safer to delete, assuming they are not part of critical system infrastructure.
*   **Vulnerabilities:** Check if the file type or associated software has known vulnerabilities. For folders, analyze the contents for potentially vulnerable files.
*   **System Stability:** Do not recommend deleting files or folders that are essential for system operation.
*   **Usage Patterns:** Research whether the file extensions are generally associated with user-generated data, or with system-critical applications.

Based on your analysis, set the isSafeToDelete field to true if you recommend deletion, and provide a detailed reason for your recommendation in the reason field. If you do not recommend deletion, explain why, including any potential risks.

File Path: {{{filePath}}}
File Type: {{{fileType}}}
File Size: {{{fileSize}}}
Last Modified: {{{lastModified}}}`,
});

const recommendSafeDeletionsFlow = ai.defineFlow(
  {
    name: 'recommendSafeDeletionsFlow',
    inputSchema: RecommendSafeDeletionsInputSchema,
    outputSchema: RecommendSafeDeletionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
