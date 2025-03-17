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
import { Loader2, Brain, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface WeeklyInsightsCardProps {
  messages: any[];
}

const genAI = new GoogleGenerativeAI("AIzaSyAw5aBd0IVMVrXg3IUZWEOqZe18taHND6Y");

interface WeeklyInsights {
  weekSummary: {
    title: string;
    description: string;
    highlights: string[];
    mood: "positive" | "neutral" | "negative";
    productivity_score: number;
  };
  summary: {
    title: string;
    overview: string;
    key_metrics: {
      total_messages: number;
      important_topics: string[];
      action_items: number;
    };
  };
  categories: {
    name: string;
    count: number;
    highlights: string[];
  }[];
  trends: {
    topic: string;
    frequency: number;
    sentiment: "positive" | "neutral" | "negative";
  }[];
  recommendations: {
    priority_tasks: string[];
    follow_ups: string[];
    suggestions: string[];
  };
}

const MysticBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-gradient" />
    
    {/* Floating particles */}
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${5 + Math.random() * 5}s`,
        }}
      />
    ))}
    
    {/* Glowing orbs */}
    <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
  </div>
);

export function WeeklyInsightsCard({ messages }: WeeklyInsightsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<WeeklyInsights | null>(null);

  const analyzeMessages = async () => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `Analyze these WhatsApp messages and provide insights in JSON format:
      ${JSON.stringify(messages)}
      
      Return a JSON object with the following structure:
      {
        "weekSummary": {
          "title": "string - a creative title for the week",
          "description": "string - a paragraph summarizing the week's activities and mood",
          "highlights": ["string - key moments or achievements"],
          "mood": "positive" | "neutral" | "negative",
          "productivity_score": number (0-100)
        },
        "summary": {
          "title": "string",
          "overview": "string",
          "key_metrics": {
            "total_messages": number,
            "important_topics": ["string"],
            "action_items": number
          }
        },
        "categories": [{
          "name": "string",
          "count": number,
          "highlights": ["string"]
        }],
        "trends": [{
          "topic": "string",
          "frequency": number,
          "sentiment": "positive" | "neutral" | "negative"
        }],
        "recommendations": {
          "priority_tasks": ["string"],
          "follow_ups": ["string"],
          "suggestions": ["string"]
        }
      }
      
      Focus on:
      1. Creating an engaging narrative about the week
      2. Identifying key achievements and moments
      3. Analyzing communication patterns and trends
      4. Providing actionable insights and recommendations`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

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
        className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white group"
        disabled={isLoading}
      >
        <Brain className="h-4 w-4 mr-2 group-hover:animate-pulse" />
        This Week
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[85vh] bg-black/90 border-white/10">
          <MysticBackground />
          
          <DialogHeader className="relative">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              <Brain className="h-6 w-6 text-blue-400" />
              Weekly Insights
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-full pr-4 relative">
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
                  Analyzing your messages...
                </p>
              </motion.div>
            ) : insights ? (
              <AnimatePresence>
                <div className="space-y-8 relative">
                  {/* Week Summary Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 border border-white/10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-20 animate-pulse" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-blue-400" />
                        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                          {insights.weekSummary.title}
                        </h2>
                      </div>
                      <p className="text-white/80 leading-relaxed mb-4">
                        {insights.weekSummary.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/60">Mood</span>
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              insights.weekSummary.mood === "positive"
                                ? "bg-green-500/20 text-green-400"
                                : insights.weekSummary.mood === "negative"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {insights.weekSummary.mood}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/60">Productivity</span>
                            <span className="text-blue-400 font-medium">
                              {insights.weekSummary.productivity_score}%
                            </span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                              style={{ width: `${insights.weekSummary.productivity_score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-white/80 mb-2">Key Highlights</h3>
                        <div className="flex flex-wrap gap-2">
                          {insights.weekSummary.highlights.map((highlight, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full text-sm bg-white/5 text-white/80"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Summary Section */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-blue-500">{insights.summary.title}</h2>
                    <p className="text-white/80 leading-relaxed">{insights.summary.overview}</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-sm text-white/60">Total Messages</p>
                        <p className="text-2xl font-bold text-white">{insights.summary.key_metrics.total_messages}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-sm text-white/60">Action Items</p>
                        <p className="text-2xl font-bold text-white">{insights.summary.key_metrics.action_items}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-sm text-white/60">Important Topics</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {insights.summary.key_metrics.important_topics.map((topic, i) => (
                            <span key={i} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Categories Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-500">Message Categories</h3>
                    <div className="grid gap-4">
                      {insights.categories.map((category, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{category.name}</h4>
                            <span className="text-sm text-white/60">{category.count} messages</span>
                          </div>
                          <ul className="space-y-1">
                            {category.highlights.map((highlight, j) => (
                              <li key={j} className="text-sm text-white/80">• {highlight}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trends Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-emerald-500">Emerging Trends</h3>
                    <div className="grid gap-4">
                      {insights.trends.map((trend, i) => (
                        <div key={i} className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-white">{trend.topic}</h4>
                            <span
                              className={`text-sm px-2 py-1 rounded-full ${
                                trend.sentiment === "positive"
                                  ? "bg-green-500/20 text-green-400"
                                  : trend.sentiment === "negative"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {trend.sentiment}
                            </span>
                          </div>
                          <p className="text-sm text-white/60 mt-1">
                            Mentioned {trend.frequency} times
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-amber-500">Recommendations</h3>
                    <div className="grid gap-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">Priority Tasks</h4>
                        <ul className="space-y-1">
                          {insights.recommendations.priority_tasks.map((task, i) => (
                            <li key={i} className="text-sm text-white/80">• {task}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">Follow-ups Needed</h4>
                        <ul className="space-y-1">
                          {insights.recommendations.follow_ups.map((followUp, i) => (
                            <li key={i} className="text-sm text-white/80">• {followUp}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">Suggestions</h4>
                        <ul className="space-y-1">
                          {insights.recommendations.suggestions.map((suggestion, i) => (
                            <li key={i} className="text-sm text-white/80">• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatePresence>
            ) : (
              <div className="text-center text-white/60">
                No insights available. There may have been an error analyzing your messages.
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}