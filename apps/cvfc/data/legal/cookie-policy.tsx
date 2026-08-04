import type { LegalSection } from "@/components/feature/legal-layout";

export const COOKIE_POLICY: {
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
} = {
  title: "Cookie Policy",
  lastUpdated: "August 2026",
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
            most viewed) so we can improve the experience. We use Google
            Analytics (via Google Tag Manager) and Microsoft Clarity for this.
            These cookies are set only if you allow the{" "}
            <strong>Analytics</strong> category — they are not used if you
            decline.
          </p>
          <p>
            Microsoft Clarity also records{" "}
            <strong>anonymized session replays and heatmaps</strong> — a
            reconstruction of how a visit moved through the site (pages viewed,
            clicks, scrolling, mouse movement). This is used only to find
            usability problems, such as a registration step where visitors get
            stuck. Replays are pseudonymous: we do not attach a visitor&rsquo;s
            name to them, and text you type into forms on this site is masked
            before it leaves your browser. You can read Microsoft&rsquo;s{" "}
            <a
              href="https://privacy.microsoft.com/privacystatement"
              rel="noopener noreferrer"
              target="_blank"
            >
              Privacy Statement
            </a>{" "}
            for how Microsoft handles this data.
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
      id: "cookies-we-set",
      heading: "Cookies and services we use",
      body: (
        <>
          <p>
            Below are the main services that set cookies or similar identifiers
            on this site. Durations are approximate and set by the provider.
          </p>
          <ul>
            <li>
              <strong>CVFC cookie preferences</strong> (strictly necessary) —
              stored in your browser&rsquo;s local storage to remember your
              cookie choices so we don&rsquo;t ask again on every visit. Stays
              until you clear it or change your preferences.
            </li>
            <li>
              <strong>Google Analytics / Google Tag Manager</strong> (analytics)
              — <code>_ga</code>, <code>_ga_*</code>: distinguish visitors and
              measure how the site is used. Up to 2 years.
            </li>
            <li>
              <strong>Microsoft Clarity</strong> (analytics) —{" "}
              <code>_clck</code> and <code>CLID</code> (up to 1 year) identify a
              returning browser; <code>_clsk</code> (1 day) groups page views
              into a single session; <code>MUID</code>, <code>ANONCHK</code>,{" "}
              <code>MR</code>, and <code>SM</code> are set by Microsoft to
              recognize a browser across Microsoft services and to synchronize
              sessions. Used for heatmaps and session replay.
            </li>
            <li>
              <strong>Embedded third-party services</strong> — registration and
              form providers (such as PlayMetrics and JotForm) and embedded
              video set their own cookies when those features are loaded. We do
              not control them; see each provider&rsquo;s own policy.
            </li>
          </ul>
          <p>
            Cookie names and durations can change when a provider updates its
            service. If you want the current list for your own browser, you can
            inspect the cookies for this site in your browser&rsquo;s settings.
          </p>
        </>
      ),
    },
    {
      id: "your-choices",
      heading: "Your choices",
      body: (
        <>
          <p>
            When you first visit the site we ask for your cookie choices. You
            can change them at any time using the{" "}
            <strong>Cookie preferences</strong> link in the footer of every
            page.
          </p>
          <ul>
            <li>
              <strong>Accept all</strong> — allows analytics (including
              Microsoft Clarity session replay) and marketing cookies.
            </li>
            <li>
              <strong>Reject all</strong> — only strictly necessary cookies are
              used. Analytics and session replay do not run.
            </li>
            <li>
              <strong>Customize</strong> — turn individual categories on or off.
            </li>
          </ul>
          <p>
            You can also opt out of Microsoft Clarity across all sites that use
            it via Microsoft&rsquo;s{" "}
            <a
              href="https://privacy.microsoft.com/privacystatement"
              rel="noopener noreferrer"
              target="_blank"
            >
              privacy controls
            </a>
            , and out of Google Analytics using the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google Analytics opt-out browser add-on
            </a>
            .
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
