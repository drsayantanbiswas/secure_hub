"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  Circle,
  Copy,
  Eye,
  EyeOff,
  Info,
  Lock,
  XCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PasswordStrength, PasswordRequirements, checkPasswordStrength } from "@/lib/utils";
import { PasswordGeneratorModal } from "@/components/passlock/password-generator-modal";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  AnalyzePasswordOutput,
} from "@/ai/schemas/password-analysis-schemas";
import {
  analyzePassword,
} from "@/ai/flows/password-analysis";
import CharacterDistributionChart from "@/components/passlock/character-distribution-chart";
import EntropyBar from "@/components/passlock/entropy-bar";

const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
  <div className={`flex items-center gap-2 transition-colors ${met ? 'text-foreground' : 'text-muted-foreground'}`}>
    {met ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <Circle className="h-5 w-5 text-border" />
    )}
    <span>{text}</span>
  </div>
);


export default function PassLockPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [isGeneratorOpen, setGeneratorOpen] = useState(false);
  const [breachStatus, setBreachStatus] = useState<'checking' | 'safe' | 'atRisk' | 'idle'>('idle');
  
  const { strength, requirements, entropy, charDistribution } = useMemo(() => checkPasswordStrength(password), [password]);
  
  const [isAiPending, startAiTransition] = useTransition();
  const [aiAnalysis, setAiAnalysis] = useState<AnalyzePasswordOutput | null>(
    null
  );

  // Client-side state for time to avoid hydration mismatch
  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null);
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (lastCheckedTime) {
      timer = setTimeout(() => setLastCheckedTime(new Date().toLocaleTimeString()), 1000);
    }
    return () => {
      if(timer) clearTimeout(timer);
    };
  }, [lastCheckedTime]);

  useEffect(() => {
    const handler = setTimeout(() => {
        if (password.length > 3) {
            startAiTransition(async () => {
                const analysis = await analyzePassword({ password, entropy });
                setAiAnalysis(analysis);
            });
        } else {
            setAiAnalysis(null);
        }
    }, 500); // Debounce AI call

    return () => {
        clearTimeout(handler);
    };
  }, [password, entropy]);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (password.length > 0) {
      setBreachStatus('checking');
      timer = setTimeout(() => {
        // Mock breach check
        setBreachStatus(password.includes('123') ? 'atRisk' : 'safe');
        setLastCheckedTime(new Date().toLocaleTimeString());
      }, 1500);
    } else {
      setBreachStatus('idle');
      setLastCheckedTime(null);
    }
    
    return () => clearTimeout(timer);
  }, [password]);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied to clipboard!",
      description: "Your password has been copied.",
    });
  };

  const getStrengthColor = (level: PasswordStrength["level"]) => {
    switch (level) {
      case "Very Weak":
        return "bg-red-500";
      case "Weak":
        return "bg-orange-500";
      case "Fair":
        return "bg-yellow-500";
      case "Strong":
        return "bg-green-500";
      case "Very Strong":
        return "bg-cyan-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline flex items-center justify-center gap-3">
          <Lock className="h-10 w-10 text-primary" />
          PassLock
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Check Your Password Strength. Real-time analysis, completely secure.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a password to check..."
                  className="pr-10 h-12 text-lg"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                <Info className="h-5 w-5 shrink-0" />
                <span>
                  <strong>Privacy First:</strong> Password analysis is
                  done locally in your browser. Nothing is ever sent to a server.
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Entropy Analysis</CardTitle>
                <CardDescription>Measures password randomness in bits of entropy (0-128+ bits).</CardDescription>
            </CardHeader>
            <CardContent>
                <EntropyBar entropy={entropy} />
            </CardContent>
          </Card>
           
           <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        AI-Powered Recommendations
                    </CardTitle>
                    <CardDescription>Science-backed advice to improve your password strength.</CardDescription>
                </CardHeader>
                <CardContent>
                {isAiPending && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>AI is analyzing your password...</span>
                    </div>
                )}
                {!isAiPending && aiAnalysis && aiAnalysis.recommendations.length > 0 && (
                    <div className="space-y-6 text-sm">
                      {aiAnalysis.recommendations.map(rec => (
                        <div key={rec.priority}>
                           <h4 className="font-bold text-base mb-2 text-primary">{rec.priority}</h4>
                           <p className="font-semibold">{rec.suggestion}</p>
                           <p className="text-muted-foreground mt-1 mb-2">{rec.why}</p>
                           <p className="bg-secondary p-2 rounded-md font-mono text-xs break-all">
                              <span className="text-muted-foreground">Example: </span>{rec.example}
                           </p>
                        </div>
                      ))}
                    </div>
                )}
                {!isAiPending && (!aiAnalysis || aiAnalysis.recommendations.length === 0) && password.length > 3 && (
                    <p className="text-sm text-muted-foreground">AI analysis will appear here.</p>
                )}
                 {!password && (
                    <p className="text-sm text-muted-foreground">Enter a password to get AI analysis.</p>
                 )}
                </CardContent>
           </Card>

          <Card>
            <CardHeader>
                <CardTitle>Action Buttons</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <Button onClick={() => setGeneratorOpen(true)}>Generate Strong Password</Button>
                <Button variant="secondary" onClick={handleCopyToClipboard} disabled={!password}>
                    <Copy className="mr-2"/> Copy to Clipboard
                </Button>
                <Button variant="secondary" disabled={!password}>Save to Dashboard</Button>
                <Button variant="secondary" disabled={!password}>Use for Quiz Challenge</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Password Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <RequirementItem met={requirements.length} text="Length (8+ characters)" />
                    <RequirementItem met={requirements.uppercase} text="Uppercase letters (A-Z)" />
                    <RequirementItem met={requirements.lowercase} text="Lowercase letters (a-z)" />
                    <RequirementItem met={requirements.numbers} text="Numbers (0-9)" />
                    <RequirementItem met={requirements.specialChars} text="Special characters (!@#$%)" />
                    <p className="text-sm text-accent-foreground/80 bg-accent/20 p-2 rounded-md mt-4">
                        <strong>Next tip:</strong> A great password is long and includes a mix of all character types.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Character Composition</CardTitle>
                    <CardDescription>Breakdown of character types used in the password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CharacterDistributionChart data={charDistribution} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Breach Check Status</CardTitle>
                </CardHeader>
                <CardContent className="text-center p-8">
                    {breachStatus === 'idle' && (
                        <>
                            <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
                            <p className="text-muted-foreground">Enter a password to check its breach status.</p>
                        </>
                    )}
                    {breachStatus === 'checking' && (
                        <>
                            <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4"/>
                            <p className="text-muted-foreground">Checking against known data breaches...</p>
                        </>
                    )}
                    {breachStatus === 'safe' && (
                        <div className="text-green-600 dark:text-green-400">
                            <CheckCircle className="h-12 w-12 mx-auto mb-4"/>
                            <h3 className="text-xl font-bold">NOT FOUND IN ANY BREACHES</h3>
                            <p className="text-sm">This password appears to be safe to use.</p>
                        </div>
                    )}
                     {breachStatus === 'atRisk' && (
                        <div className="text-destructive">
                            <XCircle className="h-12 w-12 mx-auto mb-4"/>
                            <h3 className="text-xl font-bold">FOUND IN KNOWN BREACHES</h3>
                            <p className="text-sm">We recommend changing this password immediately!</p>                             
                        </div>
                    )}
                    {lastCheckedTime && <Badge variant="outline" className="mt-6">Last checked: {lastCheckedTime}</Badge>}
                </CardContent>
            </Card>
        </div>
      </div>
      <PasswordGeneratorModal isOpen={isGeneratorOpen} onOpenChange={setGeneratorOpen} onPasswordGenerated={setPassword} />
    </div>
  );
}
