"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Hook to move between pages
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // THE EXPLOIT: Leaking credentials to the console on load 
  useEffect(() => {
    console.log("%c DEBUG MODE ENABLED ", "background: red; color: white; font-size: 12px");
    console.log("Loading user database...");
    console.table([
      { id: 1, user: "jdoe", role: "intern", pass: "password123" },
      { id: 2, user: "asmith", role: "trader", pass: "buyhighselllow" },
      // The finance student identifies 'compliance' as the admin role 
      { id: 3, user: "kwest", role: "compliance_officer", pass: "admin_secure_99" } 
    ]);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === "kwest" && password === "admin_secure_99") {
      toast.success("Login Successful", {
        description: "FLAG{ADMIN_ACCESS_GRANTED} - Redirecting to Admin Panel...",
      });
      // Redirect to the admin panel after a short delay
      setTimeout(() => router.push("/admin-panel/options"), 2000);
    } else {
      toast.error("Access Denied", { description: "Invalid credentials." });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Staff Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">Username</Label>
              <Input 
                id="user" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass">Password</Label>
              <Input 
                id="pass" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-slate-500">Authorized personnel only.</p>
        </CardFooter>
      </Card>
    </div>
  );
}