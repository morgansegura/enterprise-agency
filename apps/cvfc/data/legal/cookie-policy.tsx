import type { LegalSection } from "@/components/feature/legal-layout";

export const COOKIE_POLICY: {
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
} = {
  title: "Cookie Policy",
  lastUpdated: "April 2026",
  intro: (
    <>
      <p>
        This Cookie Policy explains how Chula Vista Fútbol Club uses cookies and
        similar technologies on our website. Read together with our{" "}
        <a href="/privacy-policy">Privacy Policy</a>, it describes what these
        technologies are, why we use them, and your choices.
      </p>
    </>
  ),
  sections: [
    {
      id: "what-are-cookies",
      heading: "What are cookies?",
      body: (
        <>
          <p>
            Cookies are small text files placed on your device when you visit a
            website. They allow the site to recognize your device and remember
            information about your visit, such as your preferences or whether
            you&rsquo;ve been here before. Similar technologies include local
            storage, pixels, and tags — referred to collectively as
            &ldquo;cookies&rdquo; in this policy.
          </p>
        </>
      ),
    },
    {
      id: "types-we-use",
      heading: "Types of cookies we use",
      body: (
        <>
          <h3>Strictly necessary</h3>
          <p>
            Required for the site to function — for example, to remember your
            selections during a registration flow. The site cannot work properly
            without these cookies, so they cannot be turned off.
          </p>

          <h3>Performance and analytics</h3>
          <p>
            Help us understand how visitors use the site (e.g. which pages are
            most viewed) so we can improve the experience. These cookies collect
            aggregated information and do not identify individual visitors.
          </p>

          <h3>Functional</h3>
          <p>
            Remember choices you make (such as your preferred language or
            region) to provide a more personalized experience.
          </p>

          <h3>Third-party</h3>
          <p>
            Some pages embed content or services from third parties (e.g.
            PlayMetrics registration, JotForm forms, embedded video). These
            third parties may set their own cookies. We do not control these
            cookies — refer to the third party&rsquo;s own privacy and cookie
            policies.
          </p>
        </>
      ),
    },
    {
      id: "managing-cookies",
      heading: "Managing your cookies",
      body: (
        <>
          <p>
            Most web browsers allow you to control cookies through their
            settings. You can:
          </p>
          <ul>
            <li>Accept or block all cookies.</li>
            <li>Block cookies from specific sites.</li>
            <li>Delete cookies that have already been set.</li>
          </ul>
          <p>
            Please note that blocking strictly necessary cookies may prevent
            parts of the website from working correctly.
          </p>
        </>
      ),
    },
    {
      id: "do-not-track",
      heading: "Do Not Track",
      body: (
        <>
          <p>
            Some browsers offer a &ldquo;Do Not Track&rdquo; (DNT) signal.
            Because there is not yet a uniform standard for how websites should
            respond to DNT signals, our site does not currently change its
            behavior based on DNT.
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
            We may update this Cookie Policy from time to time to reflect
            changes in technology, regulation, or our practices. The &ldquo;Last
            updated&rdquo; date at the top of this page reflects the most recent
            version.
          </p>
        </>
      ),
    },
  ],
};
