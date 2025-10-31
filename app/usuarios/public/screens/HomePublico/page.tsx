import PublicLayout from "../../layout/PublicLayout";
import Hero from "../../components/HeroPublico";
import InfoSection from "../../components/InfoSection";

export default function HomePublico() {
  return (
    <PublicLayout>
      <Hero />
      <InfoSection />
    </PublicLayout>
  );
}
