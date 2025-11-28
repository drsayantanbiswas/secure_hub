
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { personalizedSecurityRecommendations, PersonalizedSecurityRecommendationsOutput } from "@/ai/flows/personalized-security-recommendations";

export default function RecommendationsWidget() {
  const [recommendations, setRecommendations] = useState<string[]>([
    "Enable Two-Factor Authentication on all supported accounts.",
    "Review your password manager for any weak or reused passwords.",
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // In a real app, this data would come from the user's session or database
      const mockUserInput = {
        passwordStrength: 78,
        breachStatus: "safe" as const,
        quizProgress: 75,
        emailMonitoringEnabled: true,
      };

      try {
        const aiResponse = await personalizedSecurityRecommendations(mockUserInput);
        if (aiResponse?.recommendations) {
          setRecommendations(aiResponse.recommendations);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
        // Keep default recommendations on error
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const getActionForRecommendation = (rec: string) => {
    if (rec.toLowerCase().includes("password")) {
      return { href: "/passlock", label: "Improve Passwords" };
    }
    if (rec.toLowerCase().includes("quiz") || rec.toLowerCase().includes("learn")) {
      return { href: "/quiz", label: "Start Learning" };
    }
    if (rec.toLowerCase().includes("2fa") || rec.toLowerCase().includes("two-factor")) {
        return { href: "/quiz", label: "Learn How" };
    }
    return { href: "/profile", label: "Get Started" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Recommendations For You
        </CardTitle>
        <CardDescription>Personalized tips to boost your security score.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Loading recommendations...</p>
        ) : (
          recommendations.slice(0, 4).map((rec, index) => {
            const action = getActionForRecommendation(rec);
            return (
              <div key={index} className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-sm font-medium leading-tight">{rec}</p>
                <Button variant="link" size="sm" asChild className="p-0 mt-1 h-auto">
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

    