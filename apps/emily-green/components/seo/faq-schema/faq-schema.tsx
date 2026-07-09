import { JsonLd } from "../json-ld";

export type FaqEntry = { question: string; answer: string };

/** FAQPage schema — lifts genuine Q&A into AI answers + Google rich results. */
export function FaqSchema({ items }: { items: FaqEntry[] }) {
  if (!items.length) return null;
  return (
    <JsonLd
      data={{
        "@type": "FAQPage",
        mainEntity: items.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      }}
    />
  );
}
