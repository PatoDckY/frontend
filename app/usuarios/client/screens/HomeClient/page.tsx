import Hero from "../../../public/components/HeroPublico";
import InfoSection from "../../../public/components/InfoSection";
import ClientLayout from "../../layout/ClientLayout";

export default function HomeClient() {
  return (
    <ClientLayout>
      <Hero />
      <InfoSection />
    </ClientLayout>
  );
}
