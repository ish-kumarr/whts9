"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchTasks, fetchImportantMessages, fetchSimpleMessages } from "@/lib/api";
import { Footer } from "@/components/layout/footer";
import { WeeklyInsightsCard } from "@/components/dashboard/weekly-insights-card";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Sparkles, MessageSquare, AlertCircle, Clock } from "lucide-react";

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [simpleMessages, setSimpleMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, messagesData, simpleMessagesData] = await Promise.all([
        fetchTasks(),
        fetchImportantMessages(),
        fetchSimpleMessages()
      ]);

      setTasks(tasksData);
      setMessages(messagesData);
      setSimpleMessages(simpleMessagesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const stats = [
    {
      title: "Weekly Insights",
      value: "AI Analysis",
      icon: Sparkles,
      color: "from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30",
      textColor: "text-blue-400",
      component: WeeklyInsightsCard,
    },
    {
      title: "Messages",
      value: messages.length + simpleMessages.length,
      icon: MessageSquare,
      color: "from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30",
      textColor: "text-emerald-400",
    },
    {
      title: "Priority Tasks",
      value: tasks.filter(t => t.priority === "Urgent").length,
      icon: AlertCircle,
      color: "from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30",
      textColor: "text-red-400",
    },
    {
      title: "Upcoming",
      value: tasks.filter(t => !t.completed).length,
      icon: Clock,
      color: "from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30",
      textColor: "text-amber-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <main className="container mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Decorative gradient blur */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl opacity-20" />
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl opacity-20" />
          
          {/* Greeting Section */}
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-3">
              Good {getGreetingTime()}, Ish Kumar
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              Your AI assistant has analyzed your WhatsApp messages and organized{" "}
              <span className="text-white font-medium">{tasks.length} tasks</span> for you.
              Let&apos;s make this week productive! 🚀
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mt-12">
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className={`relative overflow-hidden backdrop-blur-xl border-white/10 p-6 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br ${stat.color}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-white/60">{stat.title}</p>
                      <h3 className={`text-2xl font-bold mt-1 ${stat.textColor}`}>
                        {stat.value}
                      </h3>
                    </div>
                    <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                  </div>
                  {stat.component && <stat.component messages={[...messages, ...simpleMessages]} />}
                </Card>
              ))}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden">
              <Carousel className="w-full">
                <CarouselContent>
                  {stats.map((stat, index) => (
                    <CarouselItem key={index}>
                      <Card
                        className={`relative overflow-hidden backdrop-blur-xl border-white/10 p-6 transition-all duration-300 bg-gradient-to-br ${stat.color}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-white/60">{stat.title}</p>
                            <h3 className={`text-2xl font-bold mt-1 ${stat.textColor}`}>
                              {stat.value}
                            </h3>
                          </div>
                          <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                        </div>
                        {stat.component && <stat.component messages={[...messages, ...simpleMessages]} />}
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden" />
                <CarouselNext className="hidden" />
              </Carousel>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}