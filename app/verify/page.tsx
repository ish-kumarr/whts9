"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Cloud, Lock } from "lucide-react";
import Cookies from "js-cookie";

export default function VerifyPage() {
  const [otp, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleVerification = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "arinsharma@123", otp }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set("auth-token", data.token, { 
          expires: 1,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict"
        });

        toast({
          title: "Welcome back!",
          description: "Successfully authenticated.",
        });
        router.push("/dashboard");
      } else {
        throw new Error(data.message || "Invalid OTP");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: error.message || "Failed to verify OTP. Please try again.",
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
            Please enter the verification code sent to<br />your email address.
          </h1>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              value={otp}
              onChange={(value) => {
                setOTP(value);
                if (value.length === 6) {
                  handleVerification();
                }
              }}
              maxLength={6}
              render={({ slots }) => (
                <InputOTPGroup className="gap-2">
                  {slots.map((slot, index) => (
                    <InputOTPSlot
                      key={index}
                      {...slot}
                      className="h-12 w-12 text-xl font-medium bg-[#1A1A1A] border-[#333333] text-white rounded-lg focus:ring-1 focus:ring-[#4C9EEB] focus:border-[#4C9EEB]"
                    />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>

          <Button
            onClick={handleVerification}
            disabled={isLoading || otp.length !== 6}
            className="w-full h-12 bg-gradient-to-r from-[#4C9EEB] to-[#6366F1] hover:from-[#4C9EEB]/90 hover:to-[#6366F1]/90 text-white rounded-lg transition-all duration-200"
          >
            Verify
          </Button>
        </div>

        <div className="flex items-center gap-2 justify-center text-[#666666] text-sm">
          <Lock className="h-4 w-4" />
          <span>End-to-end encrypted connection</span>
        </div>
      </motion.div>
    </div>
  );
}