import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm">
            <span className="mr-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
              New
            </span>
            <span>Introducing Pitch Me - Transform Your Ideas</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            The Modern Platform for
            <span className="text-primary block">Founders & Investors</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Streamline your pitch deck creation, investor outreach, and deal
            management. Built for the modern startup ecosystem.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base">
              Get Started Free
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Book a Demo
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. Start in minutes.
          </p>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
    </section>
  );
}
