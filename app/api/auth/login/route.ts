import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const USER_EMAIL = "ishkumar.dev@gmail.com";
const CORRECT_PASSWORD = "arinsharma123";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER_EMAIL,
    pass: "islbaoxlduurqxjt"
  }
});

// Function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to save OTP
async function saveOTP(email: string, otp: string) {
  const otpFile = path.join(process.cwd(), 'otp-store.json');
  let otpData = {};
  
  try {
    const data = await fs.readFile(otpFile, 'utf8');
    otpData = JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is invalid
  }

  otpData[email] = {
    otp,
    timestamp: Date.now(),
    attempts: 0
  };

  await fs.writeFile(otpFile, JSON.stringify(otpData, null, 2));
}

// Function to verify OTP
async function verifyOTP(email: string, otp: string) {
  const otpFile = path.join(process.cwd(), 'otp-store.json');
  
  try {
    const data = await fs.readFile(otpFile, 'utf8');
    const otpData = JSON.parse(data);
    
    if (!otpData[email]) return false;
    
    const storedOTP = otpData[email].otp;
    const timestamp = otpData[email].timestamp;
    
    // OTP expires after 5 minutes
    if (Date.now() - timestamp > 5 * 60 * 1000) return false;
    
    return storedOTP === otp;
  } catch (error) {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, otp } = body;

    // First step: Password verification
    if (password === CORRECT_PASSWORD) {
      // If OTP is not provided, generate and send one
      if (!otp) {
        const newOTP = generateOTP();
        await saveOTP(USER_EMAIL, newOTP);

        // Send OTP via email
        await transporter.sendMail({
          from: USER_EMAIL,
          to: USER_EMAIL,
          subject: "WhatsAssist Login OTP",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4F46E5;">WhatsAssist Security Code</h2>
              <p>Hello Ish Kumar,</p>
              <p>Your security code for WhatsAssist login is:</p>
              <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="color: #4F46E5; letter-spacing: 8px; font-size: 32px; margin: 0;">${newOTP}</h1>
              </div>
              <p>This code will expire in 5 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
                This is an automated message, please do not reply.
              </p>
            </div>
          `
        });

        return NextResponse.json(
          { message: "OTP sent successfully" },
          { status: 200 }
        );
      }

      // Second step: OTP verification
      const isValidOTP = await verifyOTP(USER_EMAIL, otp);

      if (isValidOTP) {
        const token = await new SignJWT({ email: USER_EMAIL })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("24h")
          .sign(new TextEncoder().encode(JWT_SECRET));

        cookies().set({
          name: "auth-token",
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24, // 24 hours
        });

        return NextResponse.json(
          { 
            message: "Login successful",
            token
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}