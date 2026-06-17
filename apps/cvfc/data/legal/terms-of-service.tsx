import type { LegalSection } from "@/components/feature/legal-layout";

export const TERMS_OF_SERVICE: {
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
} = {
  title: "Terms of Service",
  lastUpdated: "April 2026",
  intro: (
    <>
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the
        Chula Vista Fútbol Club website, evaluation tools, and club services. By
        accessing our site or registering a player, you agree to these Terms.
      </p>
    </>
  ),
  sections: [
    {
      id: "acceptance",
      heading: "Acceptance of terms",
      body: (
        <>
          <p>
            By using our website or services, you confirm that you have read,
            understood, and agree to be bound by these Terms. If you do not
            agree, please do not use our site or register for our programs.
          </p>
        </>
      ),
    },
    {
      id: "eligibility",
      heading: "Eligibility",
      body: (
        <>
          <p>
            CVFC programs are designed for youth players. Players under the age
            of 18 must have a parent or legal guardian register on their behalf
            and accept these Terms.
          </p>
          <p>
            CVFC reserves the right, at its sole discretion, to determine
            whether a player is eligible to participate in any program.
          </p>
        </>
      ),
    },
    {
      id: "registration",
      heading: "Registration and accounts",
      body: (
        <>
          <p>
            Player registration may be completed through our partner platforms
            (PlayMetrics for older age groups, JotForm for younger ages). You
            agree to provide accurate, current, and complete information and to
            keep that information up to date.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of any
            account credentials and for all activity that occurs under your
            account.
          </p>
        </>
      ),
    },
    {
      id: "evaluations",
      heading: "Player evaluations and tryouts",
      body: (
        <>
          <p>
            CVFC offers seasonal tryouts and year-round individual evaluations.
            Acceptance into any program is at the sole discretion of the CVFC
            coaching staff. A request for evaluation does not guarantee a roster
            spot.
          </p>
          <p>
            Schedules, programs, and team assignments may change from season to
            season. CVFC will make reasonable efforts to communicate changes in
            advance.
          </p>
        </>
      ),
    },
    {
      id: "fees",
      heading: "Fees and payments",
      body: (
        <>
          <p>
            Program fees are set each season and communicated during
            registration. Fees are non-refundable except where required by law
            or as expressly stated in writing by CVFC. Need-based financial
            assistance may be available — contact us for details.
          </p>
        </>
      ),
    },
    {
      id: "code-of-conduct",
      heading: "Code of conduct",
      body: (
        <>
          <p>
            All players, parents, guardians, and family members are expected to
            conduct themselves in a manner consistent with our core values:{" "}
            <strong>Passion. Unity. Respect. Attitude.</strong> Conduct that is
            disrespectful, abusive, threatening, or unsafe — toward players,
            coaches, officials, or opponents — may result in suspension or
            removal from the club.
          </p>
        </>
      ),
    },
    {
      id: "intellectual-property",
      heading: "Intellectual property",
      body: (
        <>
          <p>
            All content on this website — including logos, text, graphics,
            images, and the CVFC crest — is the property of Chula Vista Fútbol
            Club or its licensors and is protected by copyright, trademark, and
            other applicable laws. You may not copy, reproduce, distribute, or
            create derivative works without our prior written permission.
          </p>
        </>
      ),
    },
    {
      id: "media-release",
      heading: "Media and likeness",
      body: (
        <>
          <p>
            By participating in CVFC programs, you grant CVFC permission to use
            photographs, video, and audio recordings of players taken during
            practices, matches, and club events for promotional and educational
            purposes — including the website, social media, and print materials.
            If you wish to opt out, please notify us in writing.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      heading: "Limitation of liability",
      body: (
        <>
          <p>
            Soccer involves inherent risks of injury. By registering for CVFC
            programs, you acknowledge those risks. To the fullest extent
            permitted by law, CVFC, its directors, coaches, employees, and
            volunteers are not liable for any injury, loss, or damage arising
            from participation in our programs, except in cases of gross
            negligence or willful misconduct.
          </p>
        </>
      ),
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      body: (
        <>
          <p>
            We may update these Terms from time to time. The &ldquo;Last
            updated&rdquo; date at the top of this page reflects the most recent
            version. Continued use of our website or services after changes
            constitutes acceptance of the updated Terms.
          </p>
        </>
      ),
    },
    {
      id: "governing-law",
      heading: "Governing law",
      body: (
        <>
          <p>
            These Terms are governed by the laws of the State of California,
            without regard to its conflict of laws principles. Any disputes
            arising under these Terms will be resolved in the state or federal
            courts located in San Diego County, California.
          </p>
        </>
      ),
    },
  ],
};
