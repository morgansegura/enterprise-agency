/** Renders a JSON-LD <script>. Injects @context so callers pass only @type + data. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify({ "@context": "https://schema.org", ...data });
  return (
    <script
      type="application/ld+json"
      // schema payload is our own trusted data, not user input
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
