import { Link } from "wouter";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <Video className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold font-display">StickMotion</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
                Documentation
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/creator">
                <Button data-testid="button-nav-creator">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <div id="features">
          <Features />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
      </main>

      <Footer />
    </div>
  );
}
