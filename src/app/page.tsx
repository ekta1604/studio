"use client"

import { useState, useTransition } from "react"
import type { NextPage } from "next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { runGeneratePersonalizedSentence } from "./actions"
import Header from "@/components/header"
import { Bot, Briefcase, ClipboardCopy, FileText, Key, Loader2, Mail, PlusCircle, Send, Sparkles, Trash2, User } from "lucide-react"

interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  recruiterName: string;
  jobDescription: string;
  status: 'Pending' | 'Generated' | 'Sent';
  personalizedSentence?: string;
  fullEmail?: string;
}

const HireUpPage: NextPage = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [settings, setSettings] = useState({
    name: 'Ekta Patel',
    portfolio: 'https://portfolio.dev/ekta',
    skills: 'React, Next.js, TypeScript, Node.js, Python, building user-friendly and scalable applications, working on real-world problems',
    emailTemplate: `Hi {recruiter_name},\n\nI’m {user_name} — I recently completed my Master’s in Computer Science from UT Arlington. \n\nI came across the {job_title} role at {company_name}, and I genuinely felt it aligns well with both my interests and skills. {custom_sentence}\n\nThank you so much for your time. I’d be grateful if you could refer me or point me in the right direction.\n\nI totally understand that you’re busy, and it is okay even if you don’t respond to this message. I will do a follow-up in the next three days, to make sure that you have read my message.\n\nI’m sharing my resume and portfolio here for your reference:\nResume\nPortfolio\n\nBest,\n{user_name}`,
    hunterApiKey: '',
    gmailAppPassword: ''
  });

  const [newJob, setNewJob] = useState({
    jobTitle: '',
    companyName: '',
    recruiterName: '',
    jobDescription: ''
  });

  const [applications, setApplications] = useState<Application[]>([]);

  const handleSettingsChange = (field: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNewJobChange = (field: keyof typeof newJob, value: string) => {
    setNewJob(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (!newJob.jobTitle || !newJob.companyName || !newJob.jobDescription) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in Job Title, Company Name, and Description.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const sentence = await runGeneratePersonalizedSentence(newJob.jobDescription, settings.skills);
        const newId = `app-${Date.now()}`;
        
        const fullEmail = settings.emailTemplate
            .replace(/{recruiter_name}/g, newJob.recruiterName || 'Hiring Team')
            .replace(/{user_name}/g, settings.name)
            .replace(/{job_title}/g, newJob.jobTitle)
            .replace(/{company_name}/g, newJob.companyName)
            .replace(/{custom_sentence}/g, sentence);

        const newApplication: Application = {
            id: newId,
            ...newJob,
            status: 'Generated',
            personalizedSentence: sentence,
            fullEmail: fullEmail
        };

        setApplications(prev => [newApplication, ...prev]);
        setNewJob({ jobTitle: '', companyName: '', recruiterName: '', jobDescription: '' });
        toast({
          title: "Success!",
          description: "Personalized sentence and email have been generated.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
      }
    });
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied to clipboard!" });
    }).catch(err => {
      toast({ variant: "destructive", title: "Failed to copy", description: err.message });
    });
  };

  const deleteApplication = (id: string) => {
    setApplications(apps => apps.filter(app => app.id !== id));
    toast({ title: "Application Deleted" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-screen-2xl mx-auto">
          
          {/* Left Column: Settings */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><User size={24} /> User Profile</CardTitle>
                <CardDescription>Your personal information for applications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={settings.name} onChange={e => handleSettingsChange('name', e.target.value)} placeholder="e.g., Ekta Patel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input id="portfolio" value={settings.portfolio} onChange={e => handleSettingsChange('portfolio', e.target.value)} placeholder="https://your-portfolio.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume</Label>
                  <Input id="resume" type="file" className="text-sm file:text-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Briefcase size={24} /> Your Skills</CardTitle>
                <CardDescription>List your skills, comma-separated. Used by AI to personalize emails.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea value={settings.skills} onChange={e => handleSettingsChange('skills', e.target.value)} placeholder="React, TypeScript, Next.js..." rows={4} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Mail size={24} /> Email Template</CardTitle>
                <CardDescription>Use placeholders like {`{job_title}`}, {`{company_name}`}, etc.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea value={settings.emailTemplate} onChange={e => handleSettingsChange('emailTemplate', e.target.value)} rows={12} className="text-xs leading-relaxed"/>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Key size={24} /> API & Services</CardTitle>
                <CardDescription>Credentials for third-party services.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label htmlFor="hunter-key">Hunter.io API Key</Label>
                  <Input id="hunter-key" type="password" placeholder="Enter Hunter.io API Key" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gmail-pass">Gmail App Password</Label>
                  <Input id="gmail-pass" type="password" placeholder="Enter Gmail App Password" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Workflow */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><PlusCircle size={24} /> Add New Application</CardTitle>
                <CardDescription>Enter job details here to start the process.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" value={newJob.jobTitle} onChange={e => handleNewJobChange('jobTitle', e.target.value)} placeholder="e.g., Software Engineer" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" value={newJob.companyName} onChange={e => handleNewJobChange('companyName', e.target.value)} placeholder="e.g., Google" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recruiter-name">Recruiter Name (Optional)</Label>
                  <Input id="recruiter-name" value={newJob.recruiterName} onChange={e => handleNewJobChange('recruiterName', e.target.value)} placeholder="e.g., Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-description">Job Description</Label>
                  <Textarea id="job-description" value={newJob.jobDescription} onChange={e => handleNewJobChange('jobDescription', e.target.value)} placeholder="Paste the full job description here..." rows={6} />
                </div>
                <Button onClick={handleGenerate} disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate with AI & Add to Pipeline
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Bot size={24} /> Application Pipeline</CardTitle>
                <CardDescription>Track your generated applications here.</CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                    <p>Your generated applications will appear here.</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {applications.map((app) => (
                      <AccordionItem value={app.id} key={app.id}>
                        <AccordionTrigger className="font-semibold">
                          <div className="flex justify-between w-full pr-4">
                            <span>{app.jobTitle} at {app.companyName}</span>
                            <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${app.status === 'Generated' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{app.status}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-6">
                           <Card className="bg-secondary/30">
                            <CardHeader>
                                <CardTitle className="text-base font-headline flex items-center gap-2"><Sparkles size={16} /> AI Generated Sentence</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="italic text-muted-foreground">{app.personalizedSentence}</p>
                            </CardContent>
                           </Card>
                           
                           <Card>
                            <CardHeader>
                               <div className="flex justify-between items-center">
                                 <CardTitle className="text-base font-headline flex items-center gap-2"><FileText size={16} /> Generated Email</CardTitle>
                                 <Button variant="ghost" size="icon" onClick={() => app.fullEmail && copyToClipboard(app.fullEmail)}>
                                    <ClipboardCopy className="h-4 w-4" />
                                 </Button>
                               </div>
                            </CardHeader>
                            <CardContent>
                                <pre className="whitespace-pre-wrap font-body text-sm bg-muted p-4 rounded-md">{app.fullEmail}</pre>
                            </CardContent>
                           </Card>
                           <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" size="sm" onClick={() => deleteApplication(app.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Send className="mr-2 h-4 w-4" /> Send Email
                            </Button>
                           </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}

export default HireUpPage
