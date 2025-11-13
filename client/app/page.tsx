import { SectionRenderer } from "@/components/section-renderer";
import { homePageMock } from "@/data/mocks";

export default function Home() {
  // In the future, this will come from an API
  // const pageData = await fetch('/api/pages/home').then(r => r.json())
  const pageData = homePageMock;

  return (
    <div className="min-h-screen">
      <SectionRenderer sections={pageData.sections} />
    </div>
  );
}
