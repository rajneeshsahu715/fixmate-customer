import Hero from "../components/Hero";
import PopularServices from "../components/PopularServices";
import ServiceCategories from "../components/ServiceCategories";
import HowItWorks from "../components/HowItWorks";
import WhyChooseUs from "../components/WhyChooseUs";
import TrustSafety from "../components/TrustSafety";
import Testimonials from "../components/Testimonials";
import FinalCTA from "../components/FinalCTA";

const Home = () => {
  return (
    <>
      <Hero />
      <PopularServices />
      <ServiceCategories />
      <HowItWorks />
      <WhyChooseUs />
      <TrustSafety />
      <Testimonials />
      <FinalCTA />
    </>
  );
};

export default Home;