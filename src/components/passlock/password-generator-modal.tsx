"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePassword } from "@/lib/utils";

type PasswordGeneratorModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPasswordGenerated: (password: string) => void;
};

export function PasswordGeneratorModal({
  isOpen,
  onOpenChange,
  onPasswordGenerated,
}: PasswordGeneratorModalProps) {
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const { toast } = useToast();

  const regeneratePassword = useCallback(() => {
    const newPassword = generatePassword(
      length,
      useUppercase,
      useLowercase,
      useNumbers,
      useSpecial,
      excludeAmbiguous
    );
    setGeneratedPassword(newPassword);
  }, [length, useUppercase, useLowercase, useNumbers, useSpecial, excludeAmbiguous]);

  useEffect(() => {
    if(isOpen) {
      regeneratePassword();
    }
  }, [isOpen, regeneratePassword]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast({ title: "Password copied to clipboard!" });
  };
  
  const handleAccept = () => {
    onPasswordGenerated(generatedPassword);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Strong Password</DialogTitle>
          <DialogDescription>
            Use the options below to create a secure password.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Input
              id="generated-password"
              value={generatedPassword}
              readOnly
              className="pr-10 h-10 text-lg font-mono"
            />
             <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4"/>
                <span className="sr-only">Copy password</span>
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Length: {length}</Label>
            <Slider
              id="length"
              min={8}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="uppercase" checked={useUppercase} onCheckedChange={(checked) => setUseUppercase(Boolean(checked))} />
              <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lowercase" checked={useLowercase} onCheckedChange={(checked) => setUseLowercase(Boolean(checked))} />
              <Label htmlFor="lowercase">Lowercase (a-z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="numbers" checked={useNumbers} onCheckedChange={(checked) => setUseNumbers(Boolean(checked))} />
              <Label htmlFor="numbers">Numbers (0-9)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="special" checked={useSpecial} onCheckedChange={(checked) => setUseSpecial(Boolean(checked))} />
              <Label htmlFor="special">Special (!@#$)</Label>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ambiguous" checked={excludeAmbiguous} onCheckedChange={(checked) => setExcludeAmbiguous(Boolean(checked))} />
            <Label htmlFor="ambiguous">Exclude ambiguous (i, l, 1, 0, O)</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={regeneratePassword}>
            <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
          </Button>
          <Button onClick={handleAccept}>
            ✅ Accept & Use
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
