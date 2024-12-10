import { Navbar } from "@/components/navbar";
import LandingLayout from './layout';
import HeroSection from './hero-section';
import { Footer } from './footer';
import { Features } from './features';
import { FAQ } from './faq';
import { Subscribe } from './subscribe';

export const Landing = () => {
  const navLinks = [
    { name: 'Home', href: '/', current: true },

  ];

  return (
    <LandingLayout>
      <Navbar links={navLinks} />
      <HeroSection />
      <Features />
      <Subscribe />
      {/* <FAQ /> */}
      <Footer />
    </LandingLayout>
  );
}
