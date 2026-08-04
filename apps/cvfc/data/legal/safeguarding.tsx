import type { LegalSection } from "@/components/feature/legal-layout";

export const SAFEGUARDING: {
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
} = {
  title: "Youth Safeguarding Policy",
  lastUpdated: "August 2026",
  intro: (
    <>
      <p>
        Chula Vista Fútbol Club exists to develop young players. Nothing about
        that work matters if children are not safe while they do it. This policy
        describes the safeguards we keep in place, how adults are screened and
        expected to behave, how we handle images and stories of minors, and how
        any family, player, or staff member can raise a concern.
      </p>
      <p>
        It applies to every coach, director, administrator, volunteer, and
        contractor acting on behalf of the club.
      </p>
    </>
  ),
  sections: [
    {
      id: "our-commitments",
      heading: "Our commitments to families",
      body: (
        <>
          <ul>
            <li>
              Adults in direct contact with minors are screened before they
              begin, and are expected to follow this policy as a condition of
              their role.
            </li>
            <li>
              We follow{" "}
              <a
                href="https://uscenterforsafesport.org/"
                rel="noopener noreferrer"
                target="_blank"
              >
                U.S. Center for SafeSport
              </a>{" "}
              guidance on preventing physical, sexual, and emotional abuse, and
              the safeguarding requirements of the leagues and governing bodies
              we belong to.
            </li>
            <li>
              We do not publish a minor&rsquo;s full name, image, or story
              without a parent or guardian&rsquo;s consent.
            </li>
            <li>
              Any concern raised is reviewed promptly, and suspected abuse or
              neglect is reported to the authorities — not handled quietly
              in-house.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "screening",
      heading: "Screening and training for adults",
      body: (
        <>
          <p>
            Coaches, staff, and volunteers with direct, repeated contact with
            players complete a background-check and screening process
            appropriate to their role before they begin working with a team, and
            re-screen on the cycle required by our leagues and governing bodies.
          </p>
          <p>
            Coaching staff hold the licenses and certifications required for
            their age group and competition level, including the
            abuse-prevention training required by U.S. Soccer and the leagues in
            which our teams compete.
          </p>
        </>
      ),
    },
    {
      id: "adult-interaction",
      heading: "Adult interaction with minors",
      body: (
        <>
          <p>
            The rules below are not optional, and they apply at training,
            matches, tournaments, travel, and online.
          </p>
          <ul>
            <li>
              <strong>Two-deep leadership.</strong> Wherever practical, at least
              two screened, unrelated adults are present during interaction with
              minors. One-on-one interaction out of sight of others is avoided.
            </li>
            <li>
              <strong>No private electronic contact.</strong> One-on-one
              messaging between an adult and a minor — text, DM, email, or
              social platform — is not permitted. Communication with players
              under 18 includes a parent or guardian, or happens in a group
              channel visible to parents.
            </li>
            <li>
              <strong>No transporting players alone.</strong> Adults do not
              drive a single unrelated player without a parent&rsquo;s
              arrangement and a second adult where practical.
            </li>
            <li>
              <strong>Locker rooms and changing areas.</strong> Adults do not
              photograph or record in changing areas, and are not alone with a
              single player in them.
            </li>
            <li>
              <strong>No abusive coaching.</strong> Physical punishment,
              humiliation, slurs, and threats have no place at this club,
              regardless of result or competition level.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "images",
      heading: "Photos, video, and player stories",
      body: (
        <>
          <p>
            We photograph and film training, matches, and club events, and we
            share that work on our website and social channels. Families control
            how their child appears.
          </p>
          <ul>
            <li>
              A parent or guardian may decline photo and video use for their
              child at any time, without affecting the player&rsquo;s place in
              the program.
            </li>
            <li>
              We do not pair a minor&rsquo;s full name with identifying details
              such as their school, home neighborhood, or schedule.
            </li>
            <li>
              We do not license images of minors to third parties for
              advertising, and we do not use a player&rsquo;s image to imply a
              commercial endorsement.
            </li>
            <li>
              To have an image or story removed, contact us using the details
              below. We act on removal requests promptly.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "children-data",
      heading: "Information we collect about minors",
      body: (
        <>
          <p>
            Personal information about a player under 13 is provided by a parent
            or guardian during evaluation or registration — never collected from
            the child directly. We collect only what is needed to place the
            player, run the program, and reach a guardian in an emergency. See
            our <a href="/privacy-policy">Privacy Policy</a> for the full
            detail, including our COPPA commitments.
          </p>
        </>
      ),
    },
    {
      id: "mandated-reporting",
      heading: "Mandated reporting",
      body: (
        <>
          <p>
            Coaches and administrators who work with minors are mandated
            reporters under California law. Suspected child abuse or neglect is
            reported directly to the appropriate county or state child-welfare
            agency or law enforcement. That report is made regardless of any
            internal review, and is never delayed for club convenience.
          </p>
          <p>
            Conduct falling under the jurisdiction of the U.S. Center for
            SafeSport is reported to SafeSport as required by our governing
            bodies.
          </p>
        </>
      ),
    },
    {
      id: "reporting-concerns",
      heading: "How to report a concern",
      body: (
        <>
          <p>
            You do not need proof, and you do not need to be certain. If
            something concerns you, report it.
          </p>
          <ul>
            <li>
              <strong>If a child is in immediate danger, call 911.</strong>
            </li>
            <li>
              <strong>The club</strong> — email{" "}
              <a href="mailto:contact@chulavistafc.com">
                contact@chulavistafc.com
              </a>
              . Concerns involving a staff member are routed to club leadership
              not involved in the matter.
            </li>
            <li>
              <strong>U.S. Center for SafeSport</strong> —{" "}
              <a
                href="https://uscenterforsafesport.org/report-a-concern/"
                rel="noopener noreferrer"
                target="_blank"
              >
                report a concern
              </a>
              , independent of the club.
            </li>
            <li>
              <strong>San Diego County Child Abuse Hotline</strong> — (858)
              560-2191.
            </li>
            <li>
              <strong>Childhelp National Child Abuse Hotline</strong> —
              1-800-422-4453.
            </li>
          </ul>
          <p>
            We do not retaliate against anyone who raises a concern in good
            faith.
          </p>
        </>
      ),
    },
    {
      id: "our-review",
      heading: "What happens after you report",
      body: (
        <>
          <p>
            We acknowledge a report promptly and begin review immediately. Where
            an allegation involves a person in a position of trust, that person
            is removed from contact with players while the matter is reviewed.
            Internal review never substitutes for a mandated report — where
            abuse or neglect is suspected, both happen in parallel.
          </p>
        </>
      ),
    },
    {
      id: "updates",
      heading: "Review of this policy",
      body: (
        <>
          <p>
            We review this policy at least annually and update it as SafeSport,
            U.S. Soccer, and league requirements evolve. The &ldquo;Last
            updated&rdquo; date at the top reflects the current version.
          </p>
        </>
      ),
    },
  ],
};
