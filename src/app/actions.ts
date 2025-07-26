"use server"

import { generatePersonalizedSentence, GeneratePersonalizedSentenceInput } from "@/ai/flows/generate-personalized-sentence";
import nodemailer from "nodemailer";

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

export async function sendEmail({ to, subject, text, gmailAppPassword }: { to: string, subject: string, text: string, gmailAppPassword: string }) {
    if (!to || !subject || !text || !gmailAppPassword) {
        throw new Error("All fields are required to send an email.");
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ektaabroad@gmail.com', // Updated sender email
            pass: gmailAppPassword
        }
    });
    try {
        const info = await transporter.sendMail({
            from: 'ektaabroad@gmail.com', // Updated sender email
            to,
            subject,
            text
        });
        return { success: true, info };
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email.");
    }
}

export async function findRecruiterEmailServer({ hunterApiKey, companyDomain, recruiterName }: { hunterApiKey: string, companyDomain: string, recruiterName?: string }) {
    if (!hunterApiKey || !companyDomain) {
        throw new Error("Hunter.io API key and company domain are required.");
    }
    try {
        let url = `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(companyDomain)}&api_key=${hunterApiKey}`;
        if (recruiterName) {
            url = `https://api.hunter.io/v2/email-finder?domain=${encodeURIComponent(companyDomain)}&full_name=${encodeURIComponent(recruiterName)}&api_key=${hunterApiKey}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        if (recruiterName) {
            if (data && data.data && data.data.email) {
                return { email: data.data.email };
            }
        } else {
            if (data && data.data && data.data.emails && data.data.emails.length > 0) {
                const personal = data.data.emails.find((e: any) => e.type === 'personal');
                return { email: (personal ? personal.value : data.data.emails[0].value) };
            }
        }
        throw new Error(data.errors ? data.errors[0].details : "Could not find an email address for this company.");
    } catch (error: any) {
        throw new Error(error.message || "Failed to fetch email from Hunter.io.");
    }
}

export async function findEmailSmart({
  firstName,
  lastName,
  domain,
  voilaApiKey,
  hunterApiKey,
}: {
  firstName: string;
  lastName: string;
  domain: string;
  voilaApiKey?: string;
  hunterApiKey?: string;
}) {
  const fullName = `${firstName} ${lastName}`;
  const encodedName = encodeURIComponent(fullName);
  const encodedDomain = encodeURIComponent(domain);

  // First try Voila Norbert
  if (voilaApiKey) {
    const voilaUrl = `https://api.voilanorbert.com/v2/guess?domain=${encodedDomain}&name=${encodedName}`;
    try {
      const res = await fetch(voilaUrl, {
        headers: {
          "X-Api-Key": voilaApiKey,
          "Accept": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.email) return { email: data.email, source: "Voila" };
      }
    } catch (err) {
      console.warn("Voila Norbert failed:", err);
    }
  }

  // Fallback to Hunter.io
  if (hunterApiKey) {
    const hunterUrl = `https://api.hunter.io/v2/email-finder?domain=${encodedDomain}&full_name=${encodedName}&api_key=${hunterApiKey}`;
    try {
      const res = await fetch(hunterUrl);
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.email) return { email: data.data.email, source: "Hunter" };
      }
    } catch (err) {
      console.warn("Hunter failed:", err);
    }
  }

  // Both failed
  return { email: null, source: null };
}

export async function findEmailWithVoilaNorbert({
  voilaApiKey,
  firstName,
  lastName,
  domain,
}: {
  voilaApiKey: string;
  firstName: string;
  lastName: string;
  domain: string;
}) {
  if (!voilaApiKey || !firstName || !lastName || !domain) {
    throw new Error("Voila Norbert API key, first name, last name, and domain are required.");
  }

  const fullName = `${firstName} ${lastName}`;
  const url = `https://api.voilanorbert.com/v2/guess?domain=${encodeURIComponent(domain)}&name=${encodeURIComponent(fullName)}`;
  console.log("Requesting:", url); // ✅ See exact URL for debugging

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Api-Key": voilaApiKey,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.email) {
      return { email: data.email };
    } else {
      throw new Error(data.error || "Could not find an email address.");
    }
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch email from Voila Norbert.");
  }
}
