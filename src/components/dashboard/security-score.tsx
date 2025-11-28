"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SecurityScoreProps = {
  score: number;
};

export default function SecurityScore({ score }: SecurityScoreProps) {
  const getScoreColor = () => {
    if (score < 40) return "text-destructive";
    if (score < 80) return "text-yellow-500";
    return "text-success";
  };

  const getScoreLabel = () => {
    if (score < 40) return "Poor";
    if (score < 80) return "Good";
    return "Excellent";
  };
  
  const circumference = 2 * Math.PI * 55;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="text-2xl">Overall Security Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              className="text-border"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="55"
              cx="96"
              cy="96"
            />
            <circle
              className={getScoreColor()}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="55"
              cx="96"
              cy="96"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl font-bold">{score}</span>
            <span className={`text-lg font-semibold ${getScoreColor()}`}>
              {getScoreLabel()}
            </span>
          </div>
        </div>
        <div className="mt-6 text-left max-w-md mx-auto space-y-2">
            <p className="font-semibold">How to improve your score:</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Create 3 more strong passwords. <span className="font-semibold text-green-600">(+5 points)</span></li>
                <li>Complete a SecurityQuiz lesson. <span className="font-semibold text-green-600">(+10 points)</span></li>
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}
