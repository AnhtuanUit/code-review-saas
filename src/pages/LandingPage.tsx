import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { PricingSection } from '@/components/landing/PricingSection';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';

interface LandingPageProps {
  onAuthClick: () => void;
  isAuthenticated?: boolean;
}

export function LandingPage({ onAuthClick, isAuthenticated = false }: LandingPageProps) {
  return (
    <div className="min-h-screen w-full bg-slate-900">
      <Header onAuthClick={onAuthClick} isAuthenticated={isAuthenticated} />
      <Hero onGetStarted={onAuthClick} />
      <Features />
      <PricingSection onAuthRequired={onAuthClick} isAuthenticated={isAuthenticated} />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}