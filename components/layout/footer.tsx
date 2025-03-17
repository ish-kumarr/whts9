"use client";

import { Github, Twitter, Mail, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">About WhatsAssist</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              A personal AI-powered WhatsApp task manager built by Ish Kumar. 
              This project helps manage tasks, analyze messages, and automate workflows 
              through WhatsApp integration.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-white/60 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tasks" className="text-white/60 hover:text-white transition-colors">
                  Tasks
                </Link>
              </li>
              <li>
                <Link href="/messages" className="text-white/60 hover:text-white transition-colors">
                  Messages
                </Link>
              </li>
              <li>
                <Link href="/notes" className="text-white/60 hover:text-white transition-colors">
                  Notes
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="space-y-4">
              <a 
                href="https://github.com/ishkumar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://twitter.com/ishkumar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span>Twitter</span>
              </a>
              <a 
                href="mailto:ishkumar.dev@gmail.com"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} WhatsAssist. Built with <Heart className="h-4 w-4 inline text-red-500" /> by Ish Kumar
          </p>
          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}