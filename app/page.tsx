import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import Bestsellers from "@/components/Bestsellers";
import SimplePowerful from "@/components/SimplePowerful";
import Innovation from "@/components/Innovation";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Marquee from "@/components/Marquee";
import Prefooter from "@/components/Prefooter";
import Footer from "@/components/Footer";
import WhatsAppContacts from "@/components/WhatsAppContacts";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSlider />
        <Bestsellers />
        <SimplePowerful />
        <Innovation />
        <Testimonials />
        <Newsletter />
        <Marquee />
        <WhatsAppContacts />
        <Prefooter />
      </main>
      <Footer />
    </>
  );
}
