import type { LegalSection } from "@/components/feature/legal-layout";

export const LINK_POLICY: {
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
} = {
  title: "Link Policy",
  lastUpdated: "April 2026",
  intro: (
    <>
      <p>
        This Link Policy explains how Chula Vista Fútbol Club handles links from
        our website to third-party sites and how third parties may link to us.
      </p>
    </>
  ),
  sections: [
    {
      id: "outbound-links",
      heading: "Links to third-party sites",
      body: (
        <>
          <p>
            Our website may contain links to third-party sites that we
            don&rsquo;t own or control. We provide these links for convenience
            only. We are not responsible for the content, accuracy, privacy
            practices, or terms of use of any third-party site, and the
            inclusion of a link does not imply endorsement.
          </p>
          <p>
            You access third-party sites at your own risk. We encourage you to
            review the terms and privacy policy of any site you visit through a
            link from ours.
          </p>
        </>
      ),
    },
    {
      id: "inbound-links",
      heading: "Linking to our website",
      body: (
        <>
          <p>
            You may link to our publicly available pages, provided that the link
            does not:
          </p>
          <ul>
            <li>
              Suggest sponsorship, endorsement, or affiliation where none
              exists.
            </li>
            <li>
              Appear in a context that is unlawful, defamatory, or otherwise
              objectionable.
            </li>
            <li>
              Frame or embed our content in a way that alters or obscures our
              branding.
            </li>
            <li>
              Use our name, logo, or other marks without our prior written
              consent.
            </li>
          </ul>
          <p>
            We reserve the right to request the removal of any link that
            violates these terms.
          </p>
        </>
      ),
    },
    {
      id: "no-endorsement",
      heading: "No endorsement",
      body: (
        <>
          <p>
            A link to or from our website does not constitute an endorsement,
            partnership, or recommendation unless explicitly stated in writing.
          </p>
        </>
      ),
    },
    {
      id: "report",
      heading: "Reporting a problem",
      body: (
        <>
          <p>
            If you find a broken or inappropriate link on our site, please let
            us know using the contact information below. We&rsquo;ll review and
            update as appropriate.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: (
        <>
          <p>
            We may update this Link Policy from time to time. The &ldquo;Last
            updated&rdquo; date at the top of this page reflects the most recent
            version.
          </p>
        </>
      ),
    },
  ],
};
