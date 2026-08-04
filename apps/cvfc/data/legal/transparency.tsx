import type { LegalSection } from "@/components/feature/legal-layout";
import { siteConfig } from "@/lib/site-config";

/**
 * Financial transparency page. The Federal Tax ID renders only when
 * `siteConfig.ein` is set — blank it rather than publish an unverified number,
 * since donors rely on it for their deduction.
 */
export const TRANSPARENCY: {
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
} = {
  title: "Financial Transparency",
  lastUpdated: "August 2026",
  intro: (
    <>
      <p>
        Families and donors deserve to know where the money goes. This page
        collects our legal status, our financial filings, how we steward each
        dollar, and the independent places you can verify all of it without
        taking our word for anything.
      </p>
    </>
  ),
  sections: [
    {
      id: "organization-status",
      heading: "Organization status",
      body: (
        <>
          <ul>
            <li>
              <strong>Registered name:</strong> {siteConfig.registeredName} —
              the name on file with the IRS.
            </li>
            <li>
              <strong>Operating name:</strong> {siteConfig.legalName} (
              {siteConfig.shortName}) — the name the club has competed and
              operated under.
            </li>
            <li>
              <strong>Tax status:</strong> Nonprofit organization under Section
              501(c)(3) of the Internal Revenue Code. Contributions are
              tax-deductible to the extent allowed by law.
            </li>
            {siteConfig.ein ? (
              <li>
                <strong>Federal Tax ID (EIN):</strong> {siteConfig.ein}
              </li>
            ) : null}
            <li>
              <strong>Founded:</strong> {siteConfig.foundingDate}, in the South
              Bay — where the club still operates today.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "where-money-goes",
      heading: "How we steward each dollar",
      body: (
        <>
          <p>
            We are a club, not a franchise. There are no shareholders and no
            outside owners taking a margin. Registration fees and donations fund
            the cost of running the program:
          </p>
          <ul>
            <li>
              <strong>Coaching.</strong> Licensed coaches, their continuing
              education, and the certifications the leagues require.
            </li>
            <li>
              <strong>Fields and facilities.</strong> Field rental, lighting,
              maintenance, and the training environment players actually use.
            </li>
            <li>
              <strong>League and competition costs.</strong> League fees,
              referees, player registration with governing bodies, and travel
              for competitive teams.
            </li>
            <li>
              <strong>Equipment and kit.</strong> Balls, goals, training
              equipment, goalkeeper gear, and uniforms.
            </li>
            <li>
              <strong>Financial aid.</strong> Need-based assistance so cost is
              not the reason a South Bay kid stops playing.
            </li>
          </ul>
          <p>
            Our competitive program runs meaningfully below the U.S. average for
            a club at this level, and need-based aid is available to families
            who ask. Keeping elite development affordable is the point of
            operating as a nonprofit rather than a business.
          </p>
        </>
      ),
    },
    {
      id: "form-990",
      heading: "Form 990 and financial filings",
      body: (
        <>
          <p>
            Every 501(c)(3) files an annual information return with the IRS —
            Form 990, 990-EZ, or 990-N depending on the organization&rsquo;s
            size. These returns are public records.
          </p>
          <p>
            We do not redact any portion of a filing that is required to be
            publicly disclosed. Schedule B, which identifies individual donors,
            is shielded from public disclosure for 501(c)(3) organizations under
            federal law and is not published.
          </p>
          <p>
            To request our most recent filing directly, email{" "}
            <a href="mailto:contact@chulavistafc.com">
              contact@chulavistafc.com
            </a>
            . You can also retrieve it yourself from the independent sources
            below.
          </p>
        </>
      ),
    },
    {
      id: "verify",
      heading: "Verify us independently",
      body: (
        <>
          <p>Do not take our word for our status. Check it at the source:</p>
          <ul>
            <li>
              <a
                href="https://apps.irs.gov/app/eos/"
                rel="noopener noreferrer"
                target="_blank"
              >
                IRS Tax Exempt Organization Search
              </a>{" "}
              — confirms current 501(c)(3) status and whether an organization
              has had its exemption revoked.
            </li>
            <li>
              <a
                href="https://projects.propublica.org/nonprofits/"
                rel="noopener noreferrer"
                target="_blank"
              >
                ProPublica Nonprofit Explorer
              </a>{" "}
              — full text of filed Form 990s, with financial history.
            </li>
            <li>
              <a
                href="https://www.guidestar.org/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Candid (formerly GuideStar)
              </a>{" "}
              — nonprofit profiles and transparency seals.
            </li>
            <li>
              <a
                href="https://rct.doj.ca.gov/Verification/Web/Search.aspx"
                rel="noopener noreferrer"
                target="_blank"
              >
                California Registry of Charities and Fundraisers
              </a>{" "}
              — state registration status for charities soliciting in
              California.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "governance",
      heading: "Governance",
      body: (
        <>
          <p>
            The club is governed by a board that is responsible for financial
            oversight, the annual budget, and the conduct of the organization.
            Club leadership and coaching staff are listed on our{" "}
            <a href="/about/administrators">administrators</a> and{" "}
            <a href="/about/coaching-staff">coaching staff</a> pages.
          </p>
          <p>
            Questions about governance, board composition, or financial
            oversight can be directed to{" "}
            <a href="mailto:contact@chulavistafc.com">
              contact@chulavistafc.com
            </a>
            .
          </p>
        </>
      ),
    },
    {
      id: "donor-protections",
      heading: "Donor protections",
      body: (
        <>
          <p>
            We never sell, rent, trade, or share donor information, and we
            adhere to the Donor Bill of Rights. The full commitment — including
            recognition, communication preferences, record retention, and gift
            corrections — is in our{" "}
            <a href="/donor-privacy">Donor Privacy Policy</a>.
          </p>
        </>
      ),
    },
    {
      id: "questions",
      heading: "Questions",
      body: (
        <>
          <p>
            If something on this page is unclear, or you want a document we have
            not published, ask. Email{" "}
            <a href="mailto:contact@chulavistafc.com">
              contact@chulavistafc.com
            </a>
            .
          </p>
        </>
      ),
    },
  ],
};
