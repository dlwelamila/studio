import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, ShieldCheck, Zap } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

  const howItWorksSteps = [
    {
      title: '1. Post Your Task',
      description:
        'Describe what you need done, set your location, and suggest a budget. It’s quick, easy, and free.',
      icon: <Zap className="h-10 w-10" />,
    },
    {
      title: '2. Select Your Helper',
      description:
        'Receive offers from verified local helpers. Review their profiles, ratings, and price, then choose the best fit for you.',
      icon: <CheckCircle className="h-10 w-10" />,
    },
    {
      title: '3. Get It Done',
      description:
        'Your chosen helper completes the task while you relax. Confirm completion and leave a rating to help our community grow.',
      icon: <Clock className="h-10 w-10" />,
    },
  ];

  const whyTasKeyFeatures = [
    {
      title: 'Reclaim Your Time',
      description:
        'Focus on what matters most. We handle the chores, so you can enjoy more free time, rest, and peace of mind.',
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Trust and Safety First',
      description:
        'Every helper on our platform is verified. Feel confident inviting help into your home with our transparent and accountable system.',
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Create Opportunity',
      description:
        'By using tasKey, you provide valuable work opportunities for capable individuals in your community, fostering local economic growth.',
      icon: <Zap className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/login">
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-accent md:text-5xl lg:text-6xl">
              Reclaim your time. We&apos;ve got the tasks covered.
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              tasKey is the safe, reliable way to get your everyday to-do list
              done. Connect with trusted local helpers for cleaning, laundry,
              and more.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/login">
                  Post a Task <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/login">Become a Helper</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-2xl md:h-auto md:aspect-[4/3]">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </section>

        <section id="how-it-works" className="bg-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-headline text-3xl font-bold text-accent md:text-4xl">
                How It Works
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Get help in three simple steps.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {howItWorksSteps.map((step) => (
                <div key={step.title} className="text-center">
                  <div className="mb-4 inline-flex rounded-full bg-primary/10 p-4 text-primary">
                    {step.icon}
                  </div>
                  <h3 className="font-headline text-xl font-bold text-accent">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-headline text-3xl font-bold text-accent md:text-4xl">
                A Smarter Way to Manage Your Day
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                tasKey is more than an app. It&apos;s a trust-driven system for modern life.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {whyTasKeyFeatures.map((feature) => (
                <Card key={feature.title} className="text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                        {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-xl text-accent">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="bg-secondary py-16 md:py-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-headline text-3xl font-bold text-accent md:text-4xl">
                    Ready to Get Started?
                </h2>
                <p className="mt-2 text-lg text-muted-foreground">
                    Join the growing community of smart delegators and reliable helpers.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                    <Button size="lg" asChild>
                        <Link href="/login">
                        Find Help Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/login">Start Earning</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <Link href="/">
            <Logo />
          </Link>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} tasKey. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-accent">
                Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-accent">
                Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
