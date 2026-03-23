import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "Pitch Me revolutionized how we presented to investors. We raised our seed round in just 3 weeks!",
    author: "Sarah Chen",
    role: "CEO, TechStart",
    avatar: "SC",
  },
  {
    quote:
      "The analytics dashboard gave us incredible insights into what investors were actually reading. Game changer.",
    author: "Michael Rodriguez",
    role: "Founder, GreenTech Labs",
    avatar: "MR",
  },
  {
    quote:
      "Finally, a platform that understands what founders need. Simple, powerful, and effective.",
    author: "Emily Watson",
    role: "Managing Partner, Apex Ventures",
    avatar: "EW",
  },
];

const stats = [
  { value: "$2B+", label: "Capital Raised" },
  { value: "10,000+", label: "Founders" },
  { value: "500+", label: "Active Investors" },
  { value: "95%", label: "Success Rate" },
];

export function TestimonialsSection() {
  return (
    <section className="py-20" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2
            id="testimonials-heading"
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Trusted by Thousands
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join the founders and investors who trust Pitch Me for their
            fundraising needs.
          </p>
        </div>

        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-muted/30">
              <CardContent className="pt-6">
                <blockquote className="mb-4">
                  <p className="text-lg italic text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </blockquote>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="" alt={testimonial.author} />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
