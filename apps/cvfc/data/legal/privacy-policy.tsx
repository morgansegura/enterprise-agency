import type { LegalSection } from "@/components/feature/legal-layout";

export const PRIVACY_POLICY: {
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
} = {
  title: "Privacy Policy",
  lastUpdated: "April 2026",
  intro: (
    <>
      <p>
        Chula Vista Fútbol Club (&ldquo;CVFC,&rdquo; &ldquo;we,&rdquo;
        &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your privacy. This
        Privacy Policy explains what information we collect when you visit our
        website, use our evaluation and registration tools, or otherwise
        interact with the club, and how we use, share, and protect that
        information.
      </p>
    </>
  ),
  sections: [
    {
      id: "information-we-collect",
      heading: "Information we collect",
      body: (
        <>
          <p>We collect the following categories of information:</p>
          <ul>
            <li>
              <strong>Player and parent information</strong> you provide during
              evaluations or registration — including name, date of birth,
              gender, contact details (email, phone, address), and emergency
              contact information.
            </li>
            <li>
              <strong>Soccer history</strong> you choose to share, such as prior
              club, level of play, and goals.
            </li>
            <li>
              <strong>Communications</strong> you send us via email, phone,
              text, or web forms.
            </li>
            <li>
              <strong>Technical information</strong> automatically collected
              when you visit our website — including IP address, browser type,
              device information, pages viewed, and referring site.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "how-we-use-information",
      heading: "How we use your information",
      body: (
        <>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process evaluation requests and team registrations.</li>
            <li>
              Match players with the appropriate coach, age band, and program.
            </li>
            <li>Communicate with you about tryouts, schedules, and events.</li>
            <li>Operate, maintain, and improve our website and services.</li>
            <li>Comply with legal obligations and protect our rights.</li>
          </ul>
        </>
      ),
    },
    {
      id: "information-sharing",
      heading: "Information sharing",
      body: (
        <>
          <p>
            We do not sell your personal information. We may share information
            with:
          </p>
          <ul>
            <li>
              <strong>Service providers</strong> who help us operate the club
              (e.g. PlayMetrics, JotForm, email service providers) — strictly to
              perform their services on our behalf.
            </li>
            <li>
              <strong>League and governing bodies</strong> (MLS NEXT, US Soccer,
              CalSouth, etc.) where required for player registration or
              competition eligibility.
            </li>
            <li>
              <strong>Legal authorities</strong> when required by law or to
              protect the safety of our players, families, and staff.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "childrens-privacy",
      heading: "Children's privacy (COPPA)",
      body: (
        <>
          <p>
            Many of our players are under the age of 13. We comply with the
            Children&rsquo;s Online Privacy Protection Act (COPPA). Personal
            information about players under 13 is provided by a parent or legal
            guardian during the evaluation or registration process. We collect
            only the information necessary to provide soccer programming and to
            communicate with the parent or guardian.
          </p>
          <p>
            Parents and guardians may review, update, or request deletion of
            their child&rsquo;s information at any time by contacting us using
            the details below.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      heading: "Cookies and tracking",
      body: (
        <>
          <p>
            Our website uses cookies and similar technologies to operate the
            site, remember your preferences, and analyze how the site is used.
            For details, see our <a href="/cookie-policy">Cookie Policy</a>.
          </p>
        </>
      ),
    },
    {
      id: "data-security",
      heading: "Data security",
      body: (
        <>
          <p>
            We use reasonable administrative, technical, and physical safeguards
            to protect your information. No method of transmission over the
            Internet or electronic storage is 100% secure, however, and we
            cannot guarantee absolute security.
          </p>
        </>
      ),
    },
    {
      id: "your-rights",
      heading: "Your rights",
      body: (
        <>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your information.</li>
            <li>
              Opt out of marketing communications at any time by following the
              unsubscribe instructions in our emails or contacting us.
            </li>
          </ul>
          <p>
            To exercise any of these rights, contact us at the address below.
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
            We may update this Privacy Policy from time to time. The &ldquo;Last
            updated&rdquo; date at the top of this page reflects the most recent
            version. We encourage you to review this page periodically.
          </p>
        </>
      ),
    },
  ],
};
