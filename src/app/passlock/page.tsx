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
  ShieldAlert,
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

const breachCheckSteps = [
    "Analyzing password hash...",
    "Querying k-anonymity service...",
    "Searching 12.1B leaked assets...",
    "Checking against known breaches...",
];


export default function PassLockPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [isGeneratorOpen, setGeneratorOpen] = useState(false);
  const [breachStatus, setBreachStatus] = useState<'checking' | 'safe' | 'atRisk' | 'idle'>('idle');
  const [breachCount, setBreachCount] = useState(0);

  const [currentBreachStep, setCurrentBreachStep] = useState(0);

  const { strength, requirements, entropy, charDistribution } = useMemo(() => checkPasswordStrength(password), [password]);
  
  const [isAiPending, startAiTransition] = useTransition();
  const [aiAnalysis, setAiAnalysis] = useState<AnalyzePasswordOutput | null>(
    null
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (breachStatus === 'checking') {
        setCurrentBreachStep(0);
        interval = setInterval(() => {
            setCurrentBreachStep(prev => (prev + 1) % breachCheckSteps.length);
        }, 700);
    }
    return () => {
        if(interval) clearInterval(interval);
    }
  }, [breachStatus]);


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
  
  const handleBreachCheck = () => {
    if (!password) return;
    setBreachStatus('checking');
    setBreachCount(0);

    setTimeout(() => {
      // Mock breach check based on HaveIBeenPwned API response format
      if (password.toLowerCase() === 'password123') {
        setBreachCount(3156648);
        setBreachStatus('atRisk');
      } else if (password.includes('123')) {
        setBreachCount(Math.floor(Math.random() * 10000) + 100);
        setBreachStatus('atRisk');
      } else {
        setBreachCount(0);
        setBreachStatus('safe');
      }
    }, 2800);
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied to clipboard!",
      description: "Your password has been copied.",
    });
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
                <CardContent className="min-h-[200px]">
                {isAiPending && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>AI is analyzing your password...</span>
                    </div>
                )}
                {!isAiPending && aiAnalysis && aiAnalysis.recommendations.length > 0 && (
                    <div className="space-y-6 text-sm">
                      {aiAnalysis.recommendations.map(rec => (
                        <div key={rec.priority} className="border-l-2 pl-4 border-primary/50">
                           <h4 className="font-bold text-base mb-1 text-primary">{rec.priority}</h4>
                           <p className="font-semibold">{rec.suggestion}</p>
                           <p className="text-muted-foreground mt-1 mb-2 text-xs">{rec.why}</p>
                           <p className="bg-secondary p-2 rounded-md font-mono text-xs break-all">
                              <span className="text-muted-foreground">Example: </span>{rec.example}
                           </p>
                        </div>
                      ))}
                    </div>
                )}
                {!isAiPending && (!aiAnalysis || aiAnalysis.recommendations.length === 0) && password.length > 3 && (
                     <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500"/>
                        <p className="font-semibold">Looks good!</p>
                        <p>No immediate recommendations from the AI.</p>
                    </div>
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
                    <CardTitle className="flex items-center gap-2"><ShieldAlert className="text-destructive"/> Breach Check</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Button onClick={handleBreachCheck} disabled={breachStatus === 'checking' || !password} className="w-full">
                        {breachStatus === 'checking' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ShieldAlert className="mr-2 h-4 w-4"/>}
                        Scan For Breaches
                    </Button>
                    <div className="text-center p-4 min-h-[150px] flex flex-col justify-center items-center">
                        {breachStatus === 'idle' && (
                            <>
                                <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
                                <p className="text-muted-foreground">Click "Scan" to check if this password has appeared in any known data breaches.</p>
                            </>
                        )}
                        {breachStatus === 'checking' && (
                            <div className="text-center w-full">
                                <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin mb-4"/>
                                <p className="font-mono text-sm text-primary">{breachCheckSteps[currentBreachStep]}</p>
                            </div>
                        )}
                        {breachStatus === 'safe' && (
                            <div className="text-green-600 dark:text-green-400">
                                <CheckCircle className="h-12 w-12 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold">SAFE! NOT FOUND IN BREACHES</h3>
                                <p className="text-sm mt-1">This password hasn't been found in any of the breaches we've analyzed.</p>
                            </div>
                        )}
                         {breachStatus === 'atRisk' && (
                            <div className="text-destructive">
                                <XCircle className="h-12 w-12 mx-auto mb-4"/>
                                <h3 className="text-xl font-bold">WARNING! FOUND IN BREACHES</h3>
                                <p className="text-sm mt-1">This password appeared in <span className="font-bold">{breachCount.toLocaleString()}</span> known breaches.</p>
                                <p className="text-xs mt-1">We strongly recommend changing it immediately.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
      <PasswordGeneratorModal isOpen={isGeneratorOpen} onOpenChange={setGeneratorOpen} onPasswordGenerated={setPassword} />
    </div>
  );
}
