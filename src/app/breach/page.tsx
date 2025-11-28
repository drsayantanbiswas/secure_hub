"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  Loader2,
  MailWarning,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type BreachResult = {
  name: string;
  type: string;
};

const mockBreaches: { [key: string]: BreachResult[] } = {
  "breached@email.com": [
    { name: "LinkedIn Data Breach (2021)", type: "Email, Password (hashed)" },
    { name: "Equifax Data Breach (2021)", type: "Full profile data" },
    { name: "Facebook Data Leak (2019)", type: "Email, Phone, Location" },
  ],
};

export default function BreachPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "safe" | "atRisk">(
    "idle"
  );
  const [breaches, setBreaches] = useState<BreachResult[]>([]);
  const [monitoring, setMonitoring] = useState(false);

  const handleCheck = () => {
    if (!email) return;
    setStatus("loading");
    setBreaches([]);

    setTimeout(() => {
      const foundBreaches = mockBreaches[email.toLowerCase()];
      if (foundBreaches) {
        setBreaches(foundBreaches);
        setStatus("atRisk");
      } else {
        setStatus("safe");
      }
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline flex items-center justify-center gap-3">
          <MailWarning className="h-10 w-10 text-destructive" />
          BreachGuardian
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Know if your email has been exposed in any data breaches.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Check Your Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex w-full items-center space-x-2">
                        <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12"
                        />
                        <Button type="submit" size="lg" onClick={handleCheck} disabled={status === "loading"}>
                            {status === "loading" ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="mr-2 h-4 w-4" />
                            )}
                            Check
                        </Button>
                    </div>
                     <p className="text-sm text-muted-foreground pt-2">
                        ℹ️ Your email is checked against 600+ known breaches. Results are instant & private.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Breach Monitoring</CardTitle>
                    <CardDescription>Get automatic alerts for new breaches.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="monitoring-toggle" checked={monitoring} onCheckedChange={setMonitoring} />
                        <Label htmlFor="monitoring-toggle">Enable Email Monitoring</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        When enabled, we'll alert you on your dashboard if this email appears in any new breaches.
                    </p>
                    {monitoring && email && (
                         <div className="p-4 bg-secondary rounded-lg">
                            <p className="font-semibold text-sm">Monitoring Status for:</p>
                            <p className="font-mono">{email}</p>
                            <p className="text-sm text-success font-semibold">✅ ACTIVE</p>
                         </div>
                    )}
                </CardContent>
            </Card>
        </div>
        
        <Card className="min-h-[300px] flex items-center justify-center p-6">
            {status === "idle" && (
                 <div className="text-center text-muted-foreground">
                    <Search className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Results will appear here</h3>
                    <p>Enter an email address and click "Check" to start.</p>
                </div>
            )}
            {status === "loading" && (
                <div className="text-center text-muted-foreground">
                    <Loader2 className="h-16 w-16 mx-auto mb-4 animate-spin text-primary" />
                    <h3 className="text-xl font-semibold">Checking for breaches...</h3>
                    <p>This may take a moment.</p>
                </div>
            )}
            {status === "safe" && (
                <div className="text-center text-success">
                    <ShieldCheck className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">SAFE - NO BREACHES DETECTED</h3>
                    <p className="mt-2 text-foreground/80">Good news! Your email hasn't been exposed in any major data breaches we track.</p>
                </div>
            )}
            {status === "atRisk" && (
                <div className="w-full">
                    <div className="text-center text-destructive mb-6">
                        <XCircle className="h-16 w-16 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold">AT RISK - FOUND IN {breaches.length} BREACHES</h3>
                        <p className="mt-2 text-foreground/80">Action Required! We recommend changing passwords on affected accounts immediately.</p>
                    </div>
                    <div className="space-y-4">
                        {breaches.map((breach, index) => (
                            <div key={index} className="p-3 bg-secondary rounded-lg">
                                <p className="font-bold">{breach.name}</p>
                                <p className="text-sm text-muted-foreground">Exposed data: {breach.type}</p>
                                <Button variant="link" size="sm" className="p-0 h-auto">What to do?</Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
}
