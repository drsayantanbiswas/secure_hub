'use client';

import { Progress } from "@/components/ui/progress";

type EntropyBarProps = {
    entropy: number;
};

const MAX_ENTROPY = 128;

const getEntropyColor = (entropy: number) => {
    if (entropy < 31) return 'bg-red-500';
    if (entropy < 61) return 'bg-orange-500';
    if (entropy < 91) return 'bg-yellow-500';
    if (entropy < 121) return 'bg-green-500';
    return 'bg-cyan-500';
}

const getInterpretation = (entropy: number) => {
    if (entropy === 0) return { label: "N/A", time: "Enter a password" };
    if (entropy < 31) return { label: "WEAK", time: "Hours to crack" };
    if (entropy < 61) return { label: "FAIR", time: "Days to crack" };
    if (entropy < 91) return { label: "STRONG", time: "Years to crack" };
    return { label: "VERY STRONG", time: "Centuries to crack" };
};

const EntropyBar = ({ entropy }: EntropyBarProps) => {
    const progress = (Math.min(entropy, MAX_ENTROPY) / MAX_ENTROPY) * 100;
    const interpretation = getInterpretation(entropy);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-baseline">
                <p className="text-lg font-medium">
                    Entropy Score: <span className="font-bold">{entropy.toFixed(2)} bits</span>
                </p>
                <p className="font-mono text-xl font-semibold">{progress.toFixed(0)}%</p>
            </div>
            <Progress value={progress} indicatorClassName={getEntropyColor(entropy)} />
            <div className="flex justify-between text-sm text-muted-foreground">
                <p>Interpretation: <span className="font-semibold text-foreground">{interpretation.label}</span></p>
                <p>Est. Crack Time: <span className="font-semibold text-foreground">{interpretation.time}</span></p>
            </div>
             <div className="text-xs text-muted-foreground space-y-1 pt-2">
                <p>Formula: E = log₂(N^L) where N is character set size and L is length.</p>
                <p>Your password: E ≈ {entropy > 0 ? entropy.toFixed(2) : '0'} bits</p>
             </div>
        </div>
    );
};

export default EntropyBar;
