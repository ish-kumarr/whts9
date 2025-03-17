"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Cloud, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "OTP Sent",
          description: "Please check your email for the verification code.",
        });
        router.push("/verify-otp");
      } else {
        throw new Error(data.message || "Invalid credentials");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Failed to login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[400px] space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Cloud className="h-8 w-8 text-white" strokeWidth={1.5} />
            <span className="text-2xl font-semibold text-[#4C9EEB]">WhatsAssist</span>
          </div>
          <p className="text-[#666666] text-sm">
            Powered by Ish Kumar's Home Lab
          </p>
          <h1 className="text-white/80 text-lg font-normal mt-6">
            Welcome back, Ish. Please authenticate to<br />access your home lab.
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Lock className="h-5 w-5 text-white/20" />
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pl-12 bg-[#1A1A1A] border-[#333333] text-white placeholder:text-white/20 rounded-lg focus:ring-1 focus:ring-[#4C9EEB] focus:border-[#4C9EEB]"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-[#4C9EEB] to-[#6366F1] hover:from-[#4C9EEB]/90 hover:to-[#6366F1]/90 text-white rounded-lg transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Authenticating...</span>
              </div>
            ) : (
              "Authenticate"
            )}
          </Button>
        </form>

        <div className="flex items-center gap-2 justify-center text-[#666666] text-sm">
          <Lock className="h-4 w-4" />
          <span>End-to-end encrypted connection</span>
        </div>
      </motion.div>
    </div>
  );
}