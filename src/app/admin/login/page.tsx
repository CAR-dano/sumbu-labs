"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Access Denied",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Access Granted",
        description: "Entering control panel...",
      });

      // Wait a bit longer to ensure cookie is fully set
      setTimeout(() => {
        window.location.href = "/admin";
      }, 500);
    } catch {
      toast({
        title: "Connection Error",
        description: "Unable to reach authentication server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0b0f1a] flex items-center justify-center p-4">
      {/* Ambient Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Purple Orb - Top Left */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />

        {/* Blue Orb - Bottom Right */}
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />

        {/* Center Accent Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px]" />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Image
              src="/assets/logo/sumbu.svg"
              alt="Sumbu Labs"
              width={120}
              height={120}
              className="drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            />
          </div>
        </div>

        {/* Glass Card */}
        <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 md:p-10 overflow-hidden group hover:border-white/20 transition-all duration-500">
          {/* Card Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8 space-y-3">
              <h1 className="text-3xl md:text-4xl font-roboto font-bold text-white tracking-wide uppercase">
                Admin Login
              </h1>
              <p className="text-gray-400 text-sm font-roboto font-light tracking-wide">
                Access the control panel
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-gray-300 text-sm font-roboto font-light uppercase tracking-wider"
                >
                  Email Address
                </Label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Mail
                      className={`w-5 h-5 transition-colors duration-300 ${
                        emailFocused ? "text-purple-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@sumbu.xyz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    required
                    disabled={loading}
                    className="h-12 pl-12 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 rounded-xl font-roboto font-light focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-gray-300 text-sm font-roboto font-light uppercase tracking-wider"
                >
                  Password
                </Label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Lock
                      className={`w-5 h-5 transition-colors duration-300 ${
                        passwordFocused ? "text-purple-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    required
                    disabled={loading}
                    className="h-12 pl-12 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 rounded-xl font-roboto font-light focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-roboto font-medium rounded-xl text-base uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group/button"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Enter
                      <ArrowRight className="w-5 h-5 group-hover/button:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </Button>
            </form>

            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-xs font-roboto font-light">
                Authorized personnel only
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="mt-6 flex justify-center">
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent rounded-full" />
        </div>
      </div>
    </div>
  );
}
