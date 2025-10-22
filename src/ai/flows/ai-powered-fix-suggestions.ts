'use server';
/**
 * @fileOverview An AI agent that suggests fixes for identified vulnerabilities in smart contracts.
 *
 * - suggestFix - A function that takes a smart contract and a vulnerability report and returns AI-generated fix suggestions.
 * - SuggestFixInput - The input type for the suggestFix function.
 * - SuggestFixOutput - The return type for the suggestFix function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFixInputSchema = z.object({
  smartContractSourceCode: z
    .string()
    .describe('The source code of the smart contract to analyze.'),
  vulnerabilityReport: z
    .string()
    .describe('A detailed report of identified vulnerabilities.'),
});
export type SuggestFixInput = z.infer<typeof SuggestFixInputSchema>;

const SuggestFixOutputSchema = z.object({
  fixSuggestions: z
    .string()
    .describe('AI-generated suggestions for fixing identified vulnerabilities.'),
});
export type SuggestFixOutput = z.infer<typeof SuggestFixOutputSchema>;

export async function suggestFix(input: SuggestFixInput): Promise<SuggestFixOutput> {
  return suggestFixFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFixPrompt',
  input: {schema: SuggestFixInputSchema},
  output: {schema: SuggestFixOutputSchema},
  prompt: `You are an AI expert in smart contract security. You are given the source code of a smart contract and a vulnerability report. You will generate suggestions for fixing the identified vulnerabilities.

Smart Contract Source Code:
\'\'\'solidity
{{{smartContractSourceCode}}}
\'\'\'

Vulnerability Report:
\'\'\'json
{{{vulnerabilityReport}}}
\'\'\'

Based on the vulnerability, provide a code snippet suggesting how to fix it. The fix should be concise and directly address the issue described. Provide only the code for the fix suggestion.`,
});

const suggestFixFlow = ai.defineFlow(
  {
    name: 'suggestFixFlow',
    inputSchema: SuggestFixInputSchema,
    outputSchema: SuggestFixOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
