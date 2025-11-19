"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, Users, Clock, Trophy } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
            FinTech CTF 2025
          </h1>
          <p className="text-slate-400 text-xl">
            Financial Forensics & Security Challenge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <Card className="bg-slate-900 border-slate-800 text-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500"/> Team Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              Teams of 2-4. Requires 1 Finance Student (Analyst) and 1 CS Student (Hacker).
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500"/> Time Limit
              </CardTitle>
            </CardHeader>
            <CardContent>
              You have 60 minutes to recover all 5 flags hidden in the trading platform.
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 text-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-emerald-500"/> Objective
              </CardTitle>
            </CardHeader>
            <CardContent>
              Exploit the flawed logic in the app to find flags formatted as <code>FLAG&#123;TEXT&#125;</code>.
            </CardContent>
          </Card>
        </div>

        <div className="pt-8 space-y-4">
          <p className="text-lg font-medium text-slate-300">Ready to begin?</p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-lg px-8">
                Enter Trading Dashboard (Start)
              </Button>
            </Link>
            
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 border-slate-700 hover:bg-slate-800">
                Staff Login
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-sm text-slate-600">
          Event: A&F Society x GDGoC Collab • Authorized Access Only
        </div>

      </div>
    </div>
  );
}