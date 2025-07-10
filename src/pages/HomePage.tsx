import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import ForSupporters from '../components/ForSupporters';
import Footer from '../components/Footer';

interface HomePageProps {
  setShowWalletOptions: (show: boolean) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setShowWalletOptions }) => {
  return (
    <>
      <Hero setShowWalletOptions={setShowWalletOptions} />
      <Features />
      <HowItWorks />
      <ForSupporters />
      <Footer />
    </>
  );
};

export default HomePage;