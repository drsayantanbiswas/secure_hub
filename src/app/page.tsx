
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Gamepad2,
  Lock,
  MailWarning,
  ShieldCheck,
  BarChart,
} from "lucide-react";
import Link from "next/link";
import InteractivePixelCanvas from "@/components/interactive-pixel-canvas";
import { SecureHubLogo } from "@/components/icons";
import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";

// --- Mouse-tracking context for interactive elements ---
interface MouseContextType {
  mouseX: number;
  mouseY: number;
}

const MouseContext = createContext<MouseContextType | null>(null);

const useMousePosition = () => {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error("useMousePosition must be used within a MouseProvider");
  }
  return context;
};

const InteractiveMouseProvider = ({ children }: { children: ReactNode }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  const mouseContextValue = {
      mouseX: position.x,
      mouseY: position.y
  }

  return (
    <MouseContext.Provider value={mouseContextValue}>
      {children}
    </MouseContext.Provider>
  );
};


// --- Magnetic Element Wrapper ---
const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { mouseX, mouseY } = useMousePosition();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distance = Math.sqrt((mouseX - centerX)**2 + (mouseY - centerY)**2);
      const maxDistance = 300; // Radius of influence
      
      if (distance < maxDistance) {
        const moveX = (mouseX - centerX) * 0.1;
        const moveY = (mouseY - centerY) * 0.1;
        setX(moveX);
        setY(moveY);
      } else {
        setX(0);
        setY(0);
      }
    }
  }, [mouseX, mouseY]);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) rotateX(${-y/10}deg) rotateY(${x/10}deg)`,
        transition: 'transform 0.1s linear',
      }}
    >
      {children}
    </div>
  );
};


const featureCards = [
  {
    icon: Lock,
    title: "PASSLOCK",
    subtitle: "Password Checker",
    features: [
      "Real-time strength check",
      "Strength meter and score",
      "Generate secure passwords",
      "Check against breaches",
    ],
    cta: "Check Password",
    href: "/passlock",
    color: "border-primary",
  },
  {
    icon: Gamepad2,
    title: "SECURITYQUIZ",
    subtitle: "Gamified Learning",
    features: [
      "Learn key security concepts",
      "Earn XP and collect badges",
      "Daily security challenges",
      "Track your progress",
    ],
    cta: "Start Quiz",
    href: "/quiz",
    color: "border-secondary",
  },
  {
    icon: MailWarning,
    title: "BREACHGUARDIAN",
    subtitle: "Breach Check",
    features: [
      "Scan email for breaches",
      "Instant breach detection",
      "Enable live monitoring",
      "Get real-time risk alerts",
    ],
    cta: "Check Email",
    href: "/breach",
    color: "border-destructive",
  },
  {
    icon: BarChart,
    title: "DASHBOARD",
    subtitle: "Security Overview",
    features: [
      "Personalized security score",
      "Key stats and metrics",
      "View your activity log",
      "AI-powered recommendations",
    ],
    cta: "View Dashboard",
    href: "/dashboard",
    color: "border-success",
  },
];

const whySecureHub = [
    {
        icon: ShieldCheck,
        title: "All-in-One Platform",
        description: "No need to juggle multiple tools. Everything you need for personal security is right here."
    },
    {
        icon: Gamepad2,
        title: "Gamified Learning",
        description: "Make security fun and engaging. Learn critical concepts while playing and earning rewards."
    },
    {
        icon: MailWarning,
        title: "Real-Time Protection",
        description: "Get instant feedback on password strength and immediate alerts for new data breaches."
    },
    {
        icon: Lock,
        title: "Completely Private",
        description: "Your data is yours. We perform checks locally and never send sensitive info to our servers."
    }
]

export default function Home() {
  return (
    <InteractiveMouseProvider>
      <div className="flex flex-col items-center">
        <section className="w-full relative h-screen">
          <InteractivePixelCanvas />
          <div className="container mx-auto px-4 text-center absolute inset-0 flex flex-col items-center justify-center">
            <Magnetic>
              <Card className="max-w-4xl bg-card/60 backdrop-blur-lg border-primary/30 shadow-glow-md">
                <CardContent className="p-8 md:p-12">
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <SecureHubLogo className="h-12 w-12 text-primary" />
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-headline bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                      SecureHub
                    </h1>
                  </div>
                  <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                    Your Complete Security Partner
                  </p>
                  <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-balance">
                    One Platform for All Your Security Needs: Password Strength Checker, Gamified Security Learning, Email Breach Monitoring, and a Personalized Security Dashboard.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left mb-12">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Password Strength</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Gamified Learning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Email Breach Monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                      <span>Security Dashboard</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                      <Button asChild size="lg">
                        <Link href="/passlock">🚀 Get Started</Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="#features">📚 Learn More</Link>
                      </Button>
                  </div>
                </CardContent>
              </Card>
            </Magnetic>
          </div>
        </section>

        <section id="features" className="w-full py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featureCards.map((card) => (
                <Magnetic key={card.title}>
                  <Card
                    className={`transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 flex flex-col ${card.color} h-full`}
                  >
                    <div className="p-8 flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <card.icon className={`h-10 w-10 ${card.color.replace('border-', 'text-')}`} />
                        <div>
                          <h3 className="text-2xl font-bold font-headline">{card.title}</h3>
                          <p className="text-muted-foreground">{card.subtitle}</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-muted-foreground">
                        {card.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                        <Button asChild className="w-full" variant="outline">
                            <Link href={card.href}>{card.cta}</Link>
                        </Button>
                    </div>
                  </Card>
                </Magnetic>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 font-headline">
              Why Choose SecureHub?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whySecureHub.map((item) => (
                  <div key={item.title} className="text-center p-6 bg-card rounded-lg shadow-md">
                      <div className="flex justify-center mb-4">
                          <div className="bg-primary/10 p-3 rounded-full">
                              <item.icon className="h-8 w-8 text-primary" />
                          </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4 font-headline text-balance">Ready to Secure Your Digital Life?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create an account or log in to get started with our full suite of security tools.
            </p>
            <Magnetic>
              <Button size="lg" asChild>
                <Link href="/signup">Start Now - Sign Up</Link>
              </Button>
            </Magnetic>
            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline hover:text-primary">
                Log In
              </Link>
            </p>
          </div>
        </section>
      </div>
    </InteractiveMouseProvider>
  );
}
