import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bell,
  CheckCircle,
  Flame,
  Gamepad2,
  Lightbulb,
  Lock,
  Newspaper,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import SecurityScore from "@/components/dashboard/security-score";
import RecommendationsWidget from "@/components/dashboard/recommendations-widget";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const statCards = [
  {
    icon: Lock,
    title: "Passwords",
    value: "12",
    label: "Checked",
    details: [
      { text: "Strong: 10", icon: ShieldCheck, color: "text-success" },
      { text: "Weak: 2", icon: ShieldCheck, color: "text-destructive" },
    ],
    cta: "View All",
    href: "/profile#passwords",
  },
  {
    icon: ShieldCheck,
    title: "Breaches",
    value: "0",
    label: "Exposed",
    details: [
      { text: "Status: SAFE", icon: CheckCircle, color: "text-success" },
      { text: "Emails: 1", icon: CheckCircle, color: "text-muted-foreground" },
    ],
    cta: "View Details",
    href: "/breach",
  },
  {
    icon: Gamepad2,
    title: "Quiz Points",
    value: "1,250",
    label: "XP",
    details: [
      { text: "Level: 5", icon: Trophy, color: "text-yellow-500" },
      { text: "Streak: 5 days", icon: Flame, color: "text-orange-500" },
    ],
    cta: "Take Quiz",
    href: "/quiz",
  },
  {
    icon: Trophy,
    title: "Badges",
    value: "8/15",
    label: "Earned",
    details: [
      { text: "This week: 0", icon: CheckCircle, color: "text-muted-foreground" },
      { text: "Recent: 5 days ago", icon: CheckCircle, color: "text-muted-foreground" },
    ],
    cta: "View Gallery",
    href: "/profile#badges",
  },
];

const activityTimeline = [
  {
    icon: ShieldCheck,
    color: "bg-green-500",
    title: 'Checked email "user@gmail.com"',
    description: "Status: Safe (0 breaches)",
    time: "3:15 PM",
    date: "Today",
  },
  {
    icon: Lock,
    color: "bg-primary",
    title: 'Checked password "P@ss123..."',
    description: "Strength: Very Strong (89/100)",
    time: "2:45 PM",
    date: "Today",
  },
  {
    icon: Gamepad2,
    color: "bg-accent",
    title: "Completed Quiz #5",
    description: "Score: 80% | +100 XP | New Badge",
    time: "1:20 PM",
    date: "Today",
  },
  {
    icon: Trophy,
    color: "bg-yellow-500",
    title: 'Unlocked Badge "Email Check 5"',
    description: "",
    time: "11:30 PM",
    date: "Yesterday",
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline flex items-center justify-center gap-3">
          <BarChart className="h-10 w-10 text-success" />
          Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Your Personalized Security Overview
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <SecurityScore score={78} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {statCards.map((card) => (
              <Card key={card.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <div className="mt-4 space-y-1">
                    {card.details.map(detail => (
                        <div key={detail.text} className="flex items-center gap-2 text-xs">
                            <detail.icon className={`h-3 w-3 ${detail.color}`} />
                            <span className="text-muted-foreground">{detail.text}</span>
                        </div>
                    ))}
                  </div>
                   <Button variant="link" size="sm" asChild className="p-0 mt-2">
                        <Link href={card.href}>{card.cta}</Link>
                   </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Here's what you've been up to.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {activityTimeline.map((item, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className={`flex items-center justify-center h-10 w-10 rounded-full ${item.color}`}>
                                    <item.icon className="h-5 w-5 text-white" />
                                </div>
                                {index < activityTimeline.length - 1 && <div className="w-px h-full bg-border mt-2"></div>}
                            </div>
                            <div>
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{item.date}, {item.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                 <Button variant="outline" className="w-full mt-6">Load More Activity</Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
            <RecommendationsWidget />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Newspaper className="h-5 w-5"/> Security Tips & News</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-semibold">Tip of the Day:</p>
                        <blockquote className="mt-1 border-l-2 pl-4 italic text-sm">"Never reuse passwords across accounts. Using unique passwords prevents hackers from accessing all your accounts if one is breached."</blockquote>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-semibold">Trending Topics:</p>
                        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                            <li>AI-powered phishing attacks <Badge variant="destructive" className="ml-1">New</Badge></li>
                            <li>Password managers: Do you need them?</li>
                            <li>2FA bypass techniques & prevention</li>
                        </ul>
                    </div>
                    <Button variant="secondary" className="w-full">View All News</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
