import Link from "next/link";
import { SecureHubLogo } from "@/components/icons";

export function AppFooter() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <div className="flex items-center gap-2">
          <SecureHubLogo className="h-6 w-6" />
          <p className="text-lg font-semibold">SecureHub</p>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} SecureHub. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="/passlock"
            className="text-sm hover:underline underline-offset-4"
          >
            PassLock
          </Link>
          <Link
            href="/quiz"
            className="text-sm hover:underline underline-offset-4"
          >
            Quiz
          </Link>
          <Link
            href="/dashboard"
            className="text-sm hover:underline underline-offset-4"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </footer>
  );
}
