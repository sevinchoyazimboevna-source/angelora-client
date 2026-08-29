// @ts-nocheck
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Reveal from "@/components/common/Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const { toast } = useToast();
  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setDone(true);
    toast({ description: "Welcome to Aetheris. Check your inbox." });
  };
  return (
    <section className="px-5 sm:px-8 lg:px-12 pb-8">
      <Reveal>
        <div className="rounded-md border border-border bg-secondary/50 px-6 py-16 text-center sm:px-12">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Newsletter</div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium tracking-tight">Join the inner circle</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Private previews, atelier stories, and first access to new collections.
          </p>
          {done ? (
            <p className="mt-8 text-sm font-medium text-accent">Thank you — you’re on the list.</p>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="h-12 flex-1 rounded-md border border-border bg-background px-4 text-sm outline-none focus:border-foreground"
              />
              <Button type="submit" className="h-12 px-7">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}