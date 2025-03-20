"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Clock,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  Users,
  Timer,
  Zap,
  AlertTriangle,
  Mail,
  Loader2,
  ChevronRight,
  Star,
  Bell,
  Sparkles
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns";

const genAI = new GoogleGenerativeAI("AIzaSyAw5aBd0IVMVrXg3IUZWEOqZe18taHND6Y");

// Default data structure to prevent undefined errors
const defaultInsights = {
  weekly_stats: {
    completed_tasks: 0,
    total_tasks: 0,
    new_tasks: 0,
    productivity_trend: [0, 0, 0, 0, 0, 0, 0],
    peak_productivity_time: "N/A"
  },
  focus_metrics: {
    productivity_score: 0,
    average_response_time: "N/A",
    tasks_completed_on_time: 0,
    tasks_completed_late: 0,
    unfinished_tasks: 0
  },
  communication: {
    unread_important: 0,
    pending_followups: 0,
    missed_meetings: 0,
    upcoming_deadlines: []
  },
  procrastination: {
    pending_replies: [],
    overdue_tasks: [],
    completion_rate: 0
  }
};

// Magical Background Component with improved design
const MagicalBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Base layer with noise texture */}
    <div 
      className="absolute inset-0 bg-black/95"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.15
      }}
    />

    {/* Subtle gradient mesh */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />

    {/* Animated lines */}
    <div className="absolute inset-0">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ top: `${25 + i * 25}%` }}
          animate={{
            x: ["-100%", "100%"],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i * 2,
            ease: "linear"
          }}
        />
      ))}
    </div>

    {/* Glowing orbs */}
    <div className="absolute inset-0">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              ['rgba(59,130,246,0.15)', 'rgba(147,51,234,0.15)', 'rgba(236,72,153,0.15)'][i % 3]
            } 0%, transparent 70%)`
          }}
          animate={{
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ],
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 2
          }}
        />
      ))}
    </div>

    {/* Star field effect */}
    <div className="absolute inset-0">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-0.5 h-0.5 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  </div>
);

// Loading Animation Component
const LoadingAnimation = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center h-96 relative"
  >
    <div className="relative">
      {/* Outer ring */}
      <motion.div
        className="absolute -inset-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-lg"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Inner container */}
      <div className="relative bg-black/50 backdrop-blur-xl rounded-full p-8">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Brain className="h-12 w-12 text-blue-400" />
        </motion.div>
      </div>
    </div>
    
    {/* Loading text */}
    <div className="mt-8 text-center">
      <motion.p
        className="text-lg text-white/80 font-medium"
        animate={{
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Analyzing your week...
      </motion.p>
      <p className="text-sm text-white/40 mt-2">
        Processing messages and tasks
      </p>
    </div>
  </motion.div>
);

// Weekly Summary Card Component
const WeeklySummaryCard = ({ data = defaultInsights }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
        <Sparkles className="h-6 w-6 text-blue-400" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white">Weekly Overview</h3>
        <p className="text-white/60">
          {format(new Date(), "MMMM d")} - {format(addDays(new Date(), 7), "MMMM d, yyyy")}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span className="text-sm text-white/60">Completed</span>
        </div>
        <p className="text-2xl font-bold text-white">{data.weekly_stats.completed_tasks}</p>
        <p className="text-sm text-white/40 mt-1">tasks this week</p>
      </div>

      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-white/60">Pending</span>
        </div>
        <p className="text-2xl font-bold text-white">{data.weekly_stats.total_tasks - data.weekly_stats.completed_tasks}</p>
        <p className="text-sm text-white/40 mt-1">tasks remaining</p>
      </div>

      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-white/60">Messages</span>
        </div>
        <p className="text-2xl font-bold text-white">{data.communication.unread_important}</p>
        <p className="text-sm text-white/40 mt-1">need attention</p>
      </div>

      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-white/60">Productivity</span>
        </div>
        <p className="text-2xl font-bold text-white">{data.focus_metrics.productivity_score}%</p>
        <p className="text-sm text-white/40 mt-1">efficiency rate</p>
      </div>
    </div>

    <div className="space-y-4">
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="text-sm font-medium text-white/80 mb-3">Productivity Trend</h4>
        <div className="h-24 flex items-end gap-2">
          {data.weekly_stats.productivity_trend.map((value: number, i: number) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-blue-500/50 to-purple-500/50 rounded-t"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/40">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Pending Messages Card Component
const PendingMessagesCard = ({ data = defaultInsights }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
        <Bell className="h-6 w-6 text-red-400" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white">Pending Responses</h3>
        <p className="text-white/60">Messages requiring your attention</p>
      </div>
    </div>

    <div className="space-y-4">
      {data.procrastination.pending_replies.map((reply: any, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/5 rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">{reply.contact}</h4>
                <p className="text-sm text-white/40">Waiting since {reply.waiting_since}</p>
              </div>
            </div>
            <Badge
              className={`${
                reply.urgency === "high"
                  ? "bg-red-500/20 text-red-400 border-red-500/20"
                  : reply.urgency === "medium"
                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
                  : "bg-blue-500/20 text-blue-400 border-blue-500/20"
              }`}
            >
              {reply.urgency} priority
            </Badge>
          </div>
          <p className="text-sm text-white/60 pl-13">{reply.message}</p>
          <div className="flex items-center gap-4 pl-13">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <Mail className="h-4 w-4 mr-2" />
              Reply Now
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <Star className="h-4 w-4 mr-2" />
              Mark Important
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Upcoming Deadlines Card Component
const UpcomingDeadlinesCard = ({ data = defaultInsights }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
        <Calendar className="h-6 w-6 text-emerald-400" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white">Upcoming Deadlines</h3>
        <p className="text-white/60">Tasks due this week</p>
      </div>
    </div>

    <div className="space-y-4">
      {data.communication.upcoming_deadlines.map((deadline: any, i: number) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Timer className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-white">{deadline.task}</h4>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-sm text-white/40">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{deadline.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-white/40">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{deadline.time_left} remaining</span>
                  </div>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-white/60 transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export function WeeklyInsightsCard({ messages }: { messages: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<any>(defaultInsights);

  const analyzeMessages = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `Analyze these WhatsApp messages and provide detailed weekly insights in JSON format. The response MUST match this exact structure:

      {
        "weekly_stats": {
          "completed_tasks": number,
          "total_tasks": number,
          "new_tasks": number,
          "productivity_trend": number[],
          "peak_productivity_time": string
        },
        "focus_metrics": {
          "productivity_score": number,
          "average_response_time": string,
          "tasks_completed_on_time": number,
          "tasks_completed_late": number,
          "unfinished_tasks": number
        },
        "communication": {
          "unread_important": number,
          "pending_followups": number,
          "missed_meetings": number,
          "upcoming_deadlines": Array<{
            task: string,
            date: string,
            time_left: string
          }>
        },
        "procrastination": {
          "pending_replies": Array<{
            contact: string,
            message: string,
            waiting_since: string,
            urgency: "high" | "medium" | "low"
          }>,
          "overdue_tasks": Array<{
            task: string,
            deadline: string,
            days_overdue: number
          }>,
          "completion_rate": number
        }
      }

      Messages to analyze: ${JSON.stringify(messages)}`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim();
      
      try {
        // First try to parse the raw text
        const data = JSON.parse(text);
        setInsights(data);
      } catch {
        // If that fails, try to extract JSON from markdown code block
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          setInsights(JSON.parse(jsonMatch[1]));
        } else {
          throw new Error("Invalid response format");
        }
      }
    } catch (error) {
      console.error("Error analyzing messages:", error);
      setInsights(defaultInsights);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!insights || insights === defaultInsights) {
      analyzeMessages();
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className="w-full mt-4 relative overflow-hidden group"
        variant="ghost"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Brain className="h-4 w-4 mr-2 relative z-10 group-hover:animate-pulse" />
        <span className="relative z-10">Weekly Analysis</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 border-none bg-transparent">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-black/90">
            <MagicalBackground />
            
            <div className="relative z-10 h-full flex flex-col">
              <DialogHeader className="p-6">
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Weekly Insights & Analysis
                  </span>
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="flex-1 px-6 pb-6">
                {isLoading ? (
                  <LoadingAnimation />
                ) : insights !== defaultInsights ? (
                  <div className="space-y-6">
                    <WeeklySummaryCard data={insights} />
                    <PendingMessagesCard data={insights} />
                    <UpcomingDeadlinesCard data={insights} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <AlertTriangle className="h-8 w-8 text-amber-400 mb-4" />
                    <p className="text-white/60">
                      Failed to analyze messages. Please try again.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
