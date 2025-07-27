"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
 // ✅ Add this just below useRouter


export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      toast({ title: "Success", description: "Account created. Please sign in." });
      router.push("/signin");
    } else {
      toast({ title: "Error", description: data.error || "Registration failed" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-center">Create Account</h2>

        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>

        <Button type="submit" className="w-full">Sign Up</Button>
      </form>
    </div>
  );
}
