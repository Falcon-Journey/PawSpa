"use client"

import type React from "react"

import { useState , useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dog, Scissors, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")


const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!loginEmail || !loginPassword) return;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }
    
    localStorage.setItem("userId", JSON.stringify(data.userId))
    localStorage.setItem("userName", JSON.stringify(data.userName));

    // Redirect on successful login
    window.location.href = "/dashboard";
  } catch (err) {
    console.error("Login error:", err);
    alert("An unexpected error occurred");
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dog className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">PawSpa Grooming</h1>
          </div>
          <p className="text-lg text-gray-600">Professional dog grooming services tailored to your pet</p>
        </div>

        <div className="max-w-md mx-auto">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">New Customer</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome</CardTitle>
                  <CardDescription>Sign in to book your next grooming appointment</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>New Customer</CardTitle>
                  <CardDescription>Tell us about your dog to get personalized pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/register">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Bath Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Complete wash, dry, and nail trim</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Scissors className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Bath & Retouch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Bath service plus light trimming</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Dog className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Full Grooming</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Complete styling and grooming</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
