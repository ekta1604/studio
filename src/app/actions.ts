"use server"

import { generatePersonalizedSentence, GeneratePersonalizedSentenceInput } from "@/ai/flows/generate-personalized-sentence";

export async function runGeneratePersonalizedSentence(jobDescription: string, userSkills: string): Promise<string> {
    if (!jobDescription || !userSkills) {
        throw new Error("Job description and user skills are required to generate a personalized sentence.");
    }
    
    const input: GeneratePersonalizedSentenceInput = {
        jobDescription,
        userSkills,
    };

    try {
        const result = await generatePersonalizedSentence(input);
        return result.personalizedSentence;
    } catch (error) {
        console.error("Error generating personalized sentence:", error);
        throw new Error("Failed to generate personalized sentence from AI.");
    }
}
