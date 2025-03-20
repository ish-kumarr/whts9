"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Clock,
  AlertCircle,
  MessageSquare,
  Calendar,
  Users,
  Mail,
  Loader2,
  Download,
  X,
  Link as LinkIcon,
  FileText,
  Tag
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { format, subDays } from "date-fns";

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI("AIzaSyAw5aBd0IVMVrXg3IUZWEOqZe18taHND6Y");

// Loading Animation Component
const LoadingAnimation = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <div className="relative">
      <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur animate-pulse" />
      <div className="relative bg-black rounded-full p-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    </div>
    <p className="text-white/60 mt-4">Analyzing your messages...</p>
  </div>
);

export function WeeklyInsightsCard({ messages, tasks }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("deadlines");
  const [weeklyData, setWeeklyData] = useState(null);

  const startDate = format(subDays(new Date(), 7), "MMMM d");
  const endDate = format(new Date(), "MMMM d, yyyy");

  const handleExport = () => {
    const jsonString = JSON.stringify(weeklyData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weekly-report-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const analyzeData = async () => {
    setIsLoading(true);
    try {
      // Define the schema for the expected output
      const schema = {
        type: "object",
        properties: {
          deadlines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                task: { type: "string" },
                deadline: { type: "string" },
                time: { type: "string" },
                priority: { type: "string" },
                category: { type: "string" },
                sender: { type: "string" },
                timestamp: { type: "string" }
              },
              required: ["task", "deadline", "priority", "timestamp"]
            }
          },
          important_messages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                summary: { type: "string", nullable: true },
                links: { 
                  type: "array",
                  items: { type: "string" }
                },
                sender: { type: "string" },
                timestamp: { type: "string" }
              },
              required: ["text", "sender", "timestamp"]
            }
          },
          notes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                note: { type: "string" },
                summary: { type: "string", nullable: true },
                category: { type: "string" },
                links: { 
                  type: "array",
                  items: { type: "string" }
                },
                timestamp: { type: "string" }
              },
              required: ["note", "timestamp"]
            }
          },
          simple_messages: {
            type: "array",
            items: {
              type: "object",
              properties: {
                text: { type: "string" },
                sender: { type: "string" },
                timestamp: { type: "string" }
              },
              required: ["text", "sender", "timestamp"]
            }
          }
        },
        required: ["deadlines", "important_messages", "notes", "simple_messages"]
      };

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });

      const prompt = `
        Analyze these messages and tasks from the past week and organize them into the specified categories.
        Messages: ${JSON.stringify(messages)}
        Tasks: ${JSON.stringify(tasks)}
      `;

      const result = await model.generateContent(prompt);
      const jsonResponse = JSON.parse(result.response.text());
      setWeeklyData(jsonResponse);
    } catch (error) {
      console.error("Error analyzing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!weeklyData) {
      analyzeData();
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
        <DialogContent className="max-w-4xl h-[90vh] p-0 border-none bg-transparent">
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            {/* Blurred background */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            
            <div className="relative z-10 h-full flex flex-col">
              <DialogHeader className="p-6 flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                    <Brain className="h-6 w-6 text-blue-400" />
                    <span>Weekly Insights</span>
                  </DialogTitle>
                  <p className="text-white/60 mt-1">
                    {startDate} - {endDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleExport}
                    className="text-white/60 hover:text-white"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="flex-1 px-6 pb-6">
                {isLoading ? (
                  <LoadingAnimation />
                ) : weeklyData ? (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="deadlines" className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Deadlines
                      </TabsTrigger>
                      <TabsTrigger value="important" className="flex-1">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Important
                      </TabsTrigger>
                      <TabsTrigger value="notes" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        Notes
                      </TabsTrigger>
                      <TabsTrigger value="messages" className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages
                      </TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[calc(90vh-200px)] mt-6">
                      <TabsContent value="deadlines" className="space-y-4">
                        {weeklyData.deadlines.map((deadline, i) => (
                          <div
                            key={i}
                            className="bg-white/5 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-blue-400" />
                                <div>
                                  <h4 className="font-medium text-white">{deadline.task}</h4>
                                  <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 text-sm text-white/40">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>{deadline.deadline} at {deadline.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-white/40">
                                      <Tag className="h-3.5 w-3.5" />
                                      <span>{deadline.category}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Badge
                                className={
                                  deadline.priority.toLowerCase() === "urgent"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-blue-500/20 text-blue-400"
                                }
                              >
                                {deadline.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="important" className="space-y-4">
                        {weeklyData.important_messages.map((message, i) => (
                          <div
                            key={i}
                            className="bg-white/5 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                                <Users className="h-5 w-5 text-red-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-white">{message.sender}</h4>
                                <p className="text-sm text-white/40">
                                  {format(new Date(message.timestamp), "MMM d, h:mm a")}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-white/80 mb-3">{message.text}</p>
                            {message.summary && (
                              <div className="bg-white/5 rounded p-3 mb-3">
                                <p className="text-sm text-white/60">
                                  <span className="font-medium">TL;DR:</span> {message.summary}
                                </p>
                              </div>
                            )}
                            {message.links?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {message.links.map((link, j) => (
                                  <a
                                    key={j}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors"
                                  >
                                    <LinkIcon className="h-3.5 w-3.5" />
                                    <span>Link {j + 1}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="notes" className="space-y-4">
                        {weeklyData.notes.map((note, i) => (
                          <div
                            key={i}
                            className="bg-white/5 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <FileText className="h-5 w-5 text-purple-400" />
                              <Badge className="bg-purple-500/20 text-purple-400">
                                {note.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-white/80 mb-3">{note.note}</p>
                            {note.summary && (
                              <div className="bg-white/5 rounded p-3">
                                <p className="text-sm text-white/60">
                                  <span className="font-medium">Summary:</span> {note.summary}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="messages" className="space-y-4">
                        {weeklyData.simple_messages.map((message, i) => (
                          <div
                            key={i}
                            className="bg-white/5 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Mail className="h-5 w-5 text-blue-400" />
                              <div>
                                <h4 className="font-medium text-white">{message.sender}</h4>
                                <p className="text-sm text-white/40">
                                  {format(new Date(message.timestamp), "MMM d, h:mm a")}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-white/80 ml-8">{message.text}</p>
                          </div>
                        ))}
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64">
                    <AlertCircle className="h-8 w-8 text-amber-400 mb-4" />
                    <p className="text-white/60">
                      Failed to analyze data. Please try again.
                    </p>
                  </div>
                )}
              </div>

              <div className="px-6 pb-6 text-center">
                <p className="text-sm text-white/40">
                  Generated on {format(new Date(), "MMMM d, yyyy")} using WhatsAssist AI insights
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
