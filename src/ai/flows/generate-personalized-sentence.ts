'use server';

/**
 * @fileOverview Generates a personalized sentence summarizing how a user's skills match a job description.
 *
 * - generatePersonalizedSentence - A function that generates the personalized sentence.
 * - GeneratePersonalizedSentenceInput - The input type for the generatePersonalizedSentence function.
 * - GeneratePersonalizedSentenceOutput - The return type for the generatePersonalizedSentence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedSentenceInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The description of the job posting.'),
  userSkills: z
    .string()
    .describe('A list of the users skills.'),
});
export type GeneratePersonalizedSentenceInput = z.infer<
  typeof GeneratePersonalizedSentenceInputSchema
>;

const GeneratePersonalizedSentenceOutputSchema = z.object({
  personalizedSentence: z
    .string()
    .describe('A personalized sentence summarizing how the users skills match the job description.'),
});
export type GeneratePersonalizedSentenceOutput = z.infer<
  typeof GeneratePersonalizedSentenceOutputSchema
>;

export async function generatePersonalizedSentence(
  input: GeneratePersonalizedSentenceInput
): Promise<GeneratePersonalizedSentenceOutput> {
  return generatePersonalizedSentenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedSentencePrompt',
  input: {schema: GeneratePersonalizedSentenceInputSchema},
  output: {schema: GeneratePersonalizedSentenceOutputSchema},
  prompt: `You are an AI assistant specializing in generating personalized sentences for job applications.

  Given a job description and a list of user skills, your task is to create a concise and engaging sentence that highlights how the user's skills align with the requirements of the job.

  Job Description: {{{jobDescription}}}
  User Skills: {{{userSkills}}}

  Personalized Sentence:`, // The prompt should specify that the sentence be in the first person
});

const generatePersonalizedSentenceFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedSentenceFlow',
    inputSchema: GeneratePersonalizedSentenceInputSchema,
    outputSchema: GeneratePersonalizedSentenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
