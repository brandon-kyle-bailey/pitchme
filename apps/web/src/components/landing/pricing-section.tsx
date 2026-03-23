import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for early-stage founders",
    price: "$0",
    period: "forever",
    features: [
      "Up to 3 pitch decks",
      "Basic analytics",
      "Community access",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    description: "For serious founders ready to raise",
    price: "$49",
    period: "per month",
    features: [
      "Unlimited pitch decks",
      "Advanced analytics",
      "Investor matching",
      "Priority support",
      "Custom branding",
      "Team collaboration",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Scale",
    description: "For established investors & funds",
    price: "$199",
    period: "per month",
    features: [
      "Everything in Growth",
      "Dedicated account manager",
      "API access",
      "White-label options",
      "Advanced reporting",
      "Integration support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="bg-muted/50 py-20" aria-labelledby="pricing-heading">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            id="pricing-heading"
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Choose the plan that fits your fundraising stage. No hidden fees.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
