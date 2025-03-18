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
import { 
  Loader2, 
  Brain, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  ArrowUpRight,
  Calendar,
  Timer,
  Zap,
  AlertTriangle,
  Mail
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Progress } from "@/components/ui/progress";

interface WeeklyInsightsCardProps {
  messages: any[];
}

const genAI = new GoogleGenerativeAI("AIzaSyAw5aBd0IVMVrXg3IUZWEOqZe18taHND6Y");

interface WeeklyInsights {
  procrastination: {
    pending_replies: {
      contact: string;
      message: string;
      waiting_since: string;
      urgency: "high" | "medium" | "low";
    }[];
    overdue_tasks: {
      task: string;
      deadline: string;
      days_overdue: number;
    }[];
    completion_rate: number;
  };
  focus_metrics: {
    average_response_time: string;
    tasks_completed_on_time: number;
    tasks_completed_late: number;
    unfinished_tasks: number;
    productivity_score: number;
  };
  communication: {
    unread_important: number;
    pending_followups: number;
    missed_meetings: number;
    upcoming_deadlines: {
      task: string;
      date: string;
      time_left: string;
    }[];
  };
  weekly_stats: {
    total_tasks: number;
    completed_tasks: number;
    new_tasks: number;
    productivity_trend: number[];
    peak_productivity_time: string;
  };
  improvement_areas: {
    category: string;
    score: number;
    suggestions: string[];
  }[];
}

const MagicalBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark base layer */}
      <div className="absolute inset-0 bg-black/90" />
      
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient" />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-sky-500/10 animate-gradient" style={{ animationDelay: "-2s" }} />
      </div>
      
      {/* Animated aura effect */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-full animate-pulse"
            style={{
              transform: `scale(${1 + i * 0.1})`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: "3s",
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: 0
            }}
            animate={{ 
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ProcrastinationCard = ({ data }: { data: WeeklyInsights['procrastination'] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
        <Timer className="h-5 w-5 text-red-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">Pending Replies</h3>
        <p className="text-white/60 text-sm">Requires your attention</p>
      </div>
    </div>
    <div className="space-y-4">
      {data.pending_replies.map((reply, i) => (
        <div key={i} className="bg-white/5 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-white">{reply.contact}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              reply.urgency === "high" 
                ? "bg-red-500/20 text-red-400" 
                : reply.urgency === "medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-blue-500/20 text-blue-400"
            }`}>
              {reply.urgency} priority
            </span>
          </div>
          <p className="text-sm text-white/60">{reply.message}</p>
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Clock className="h-3 w-3" />
            <span>Waiting since {reply.waiting_since}</span>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const FocusMetricsCard = ({ data }: { data: WeeklyInsights['focus_metrics'] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
        <Zap className="h-5 w-5 text-purple-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">Focus Metrics</h3>
        <p className="text-white/60 text-sm">Your productivity insights</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-purple-400" />
          <span className="text-sm text-white/60">Avg. Response Time</span>
        </div>
        <p className="text-2xl font-bold text-white">{data.average_response_time}</p>
      </div>
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span className="text-sm text-white/60">On-time Completion</span>
        </div>
        <p className="text-2xl font-bold text-white">{data.tasks_completed_on_time}</p>
      </div>
    </div>
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white/60">Productivity Score</span>
        <span className="text-sm font-medium text-white">{data.productivity_score}%</span>
      </div>
      <Progress value={data.productivity_score} className="h-2" />
    </div>
  </motion.div>
);

const UpcomingDeadlinesCard = ({ data }: { data: WeeklyInsights['communication']['upcoming_deadlines'] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
        <Calendar className="h-5 w-5 text-amber-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">Upcoming Deadlines</h3>
        <p className="text-white/60 text-sm">Don't miss these</p>
      </div>
    </div>
    <div className="space-y-3">
      {data.map((deadline, i) => (
        <div key={i} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-white">{deadline.task}</p>
            <div className="flex items-center gap-2 mt-1 text-sm text-white/60">
              <Calendar className="h-3 w-3" />
              <span>{deadline.date}</span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm">
            {deadline.time_left}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const ImprovementAreasCard = ({ data }: { data: WeeklyInsights['improvement_areas'] }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
        <ArrowUpRight className="h-5 w-5 text-blue-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">Areas to Improve</h3>
        <p className="text-white/60 text-sm">Personalized suggestions</p>
      </div>
    </div>
    <div className="space-y-4">
      {data.map((area, i) => (
        <div key={i} className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-white">{area.category}</span>
            <span className="text-sm text-white/60">Score: {area.score}/100</span>
          </div>
          <Progress value={area.score} className="h-1.5 mb-3" />
          <ul className="space-y-2">
            {area.suggestions.map((suggestion, j) => (
              <li key={j} className="text-sm text-white/60 flex items-start gap-2">
                <ArrowUpRight className="h-4 w-4 text-blue-400 mt-0.5" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </motion.div>
);

export function WeeklyInsightsCard({ messages }: WeeklyInsightsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<WeeklyInsights | null>(null);

  const analyzeMessages = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `Analyze these WhatsApp messages and provide insights focused on task management and procrastination in JSON format. Include data about pending replies, overdue tasks, focus metrics, and improvement suggestions. The response should match this TypeScript interface:

      interface WeeklyInsights {
        procrastination: {
          pending_replies: {
            contact: string;
            message: string;
            waiting_since: string;
            urgency: "high" | "medium" | "low";
          }[];
          overdue_tasks: {
            task: string;
            deadline: string;
            days_overdue: number;
          }[];
          completion_rate: number;
        };
        focus_metrics: {
          average_response_time: string;
          tasks_completed_on_time: number;
          tasks_completed_late: number;
          unfinished_tasks: number;
          productivity_score: number;
        };
        communication: {
          unread_important: number;
          pending_followups: number;
          missed_meetings: number;
          upcoming_deadlines: {
            task: string;
            date: string;
            time_left: string;
          }[];
        };
        weekly_stats: {
          total_tasks: number;
          completed_tasks: number;
          new_tasks: number;
          productivity_trend: number[];
          peak_productivity_time: string;
        };
        improvement_areas: {
          category: string;
          score: number;
          suggestions: string[];
        }[];
      }

      Messages to analyze: ${JSON.stringify(messages)}`;

      const result = await model.generateContent(prompt);
      const analysisText = result.response.text();
      const jsonMatch = analysisText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsedInsights = JSON.parse(jsonMatch[1]);
        setInsights(parsedInsights);
      } else {
        throw new Error("No valid JSON found in response");
      }
    } catch (error) {
      console.error("Error analyzing messages:", error);
      setInsights(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!insights) {
      analyzeMessages();
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className="w-full mt-4 bg-black/20 hover:bg-black/30 text-white group relative overflow-hidden"
        disabled={isLoading}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Brain className="h-4 w-4 mr-2 relative z-10 group-hover:animate-pulse" />
        <span className="relative z-10">Weekly Progress</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl h-[90vh] border-0 bg-transparent">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-black/90">
            <MagicalBackground />
            
            <div className="relative z-10 h-full flex flex-col">
              <DialogHeader className="p-6">
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Weekly Progress & Focus Areas
                  </span>
                </DialogTitle>
              </DialogHeader>

              <ScrollArea className="flex-1 px-6 pb-6">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 space-y-4"
                  >
                    <div className="relative">
                      <div className="absolute -inset-4 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur animate-pulse" />
                      <div className="relative bg-black/50 backdrop-blur-xl rounded-lg p-6">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                      </div>
                    </div>
                    <p className="text-white/60 animate-pulse">
                      Analyzing your progress...
                    </p>
                  </motion.div>
                ) : insights ? (
                  <div className="grid grid-cols-2 gap-6">
                    <ProcrastinationCard data={insights.procrastination} />
                    <FocusMetricsCard data={insights.focus_metrics} />
                    <UpcomingDeadlinesCard data={insights.communication.upcoming_deadlines} />
                    <ImprovementAreasCard data={insights.improvement_areas} />
                  </div>
                ) : (
                  <div className="text-center text-white/60">
                    No insights available. There may have been an error analyzing your messages.
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