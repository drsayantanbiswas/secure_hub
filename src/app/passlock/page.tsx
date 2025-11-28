"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PasswordStrength, PasswordRequirements, checkPasswordStrength } from "@/lib/utils";
import { PasswordGeneratorModal } from "@/components/passlock/password-generator-modal";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
  
  const { strength, requirements } = useMemo(() => checkPasswordStrength(password), [password]);

  useEffect(() => {
    if (password.length > 0) {
      setBreachStatus('checking');
      const timer = setTimeout(() => {
        // Mock breach check
        setBreachStatus(password.includes('123') ? 'atRisk' : 'safe');
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setBreachStatus('idle');
    }
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
                  <strong>Warning:</strong> Password is never sent anywhere. Analysis is
                  done locally in your browser.
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Strength Meter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-baseline">
                    <p className="text-lg font-medium">Strength: <span className="font-bold">{password ? strength.level : '...'}</span></p>
                    <p className="font-mono text-xl font-semibold">{password ? `${strength.score}/100` : ""}</p>
                </div>
                <Progress value={strength.score} indicatorClassName={getStrengthColor(strength.level)} />
                <p className="text-sm text-muted-foreground">Time to Crack: <span className="font-semibold text-foreground">{password ? strength.timeToCrack : '...'}</span></p>
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
                             <Button variant="link" className="text-destructive">Why This Matters</Button>
                        </div>
                    )}
                    <Badge variant="outline" className="mt-6">Last checked: {new Date().toLocaleTimeString()}</Badge>
                </CardContent>
            </Card>
        </div>
      </div>
      <PasswordGeneratorModal isOpen={isGeneratorOpen} onOpenChange={setGeneratorOpen} onPasswordGenerated={setPassword} />
    </div>
  );
}
