import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';

interface LandingPageProps {
  onAuthClick: () => void;
}

export function LandingPage({ onAuthClick }: LandingPageProps) {
  return (
    <div className="min-h-screen w-full bg-slate-900">
      <Header onAuthClick={onAuthClick} />
      <Hero onGetStarted={onAuthClick} />
      <Features />
      <Pricing onGetStarted={onAuthClick} />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}