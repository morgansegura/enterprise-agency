import type { LegalSection } from "@/components/feature/legal-layout";

export const DONOR_PRIVACY: {
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
} = {
  title: "Donor Privacy Policy",
  lastUpdated: "August 2026",
  intro: (
    <>
      <p>
        People who give to Chula Vista FC — donors, sponsors, and partners —
        should know exactly what happens to their information. This policy is
        our commitment on that point, and it is deliberately short and plain.
      </p>
      <p>
        The shortest version:{" "}
        <strong>we never sell, rent, trade, or share your information.</strong>{" "}
        Read together with our <a href="/privacy-policy">Privacy Policy</a>,
        which covers the site and our programs more broadly.
      </p>
    </>
  ),
  sections: [
    {
      id: "donor-bill-of-rights",
      heading: "The Donor Bill of Rights",
      body: (
        <>
          <p>
            We adhere to the Donor Bill of Rights, developed by the Association
            of Fundraising Professionals and its partner organizations. Every
            donor is entitled to:
          </p>
          <ul>
            <li>
              Be informed of the club&rsquo;s mission, and of how we intend to
              use donated resources.
            </li>
            <li>
              Be informed of the identity of those serving on the
              organization&rsquo;s governing board, and to expect the board to
              exercise prudent judgment in its stewardship responsibilities.
            </li>
            <li>
              Have access to the organization&rsquo;s financial statements.
            </li>
            <li>Be assured their gifts will be used for the purposes given.</li>
            <li>Receive appropriate acknowledgement and recognition.</li>
            <li>
              Be assured that information about their donation is handled with
              respect and confidentiality to the extent provided by law.
            </li>
            <li>
              Expect that all relationships with individuals representing the
              organization will be professional in nature.
            </li>
            <li>
              Be informed whether those seeking donations are volunteers,
              employees, or hired solicitors.
            </li>
            <li>
              Have the opportunity for their names to be deleted from mailing
              lists that the organization may intend to share.
            </li>
            <li>
              Feel free to ask questions when making a donation, and to receive
              prompt, truthful, and forthright answers.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "never-sold",
      heading: "We never sell, rent, trade, or share your information",
      body: (
        <>
          <p>
            We do not sell, rent, trade, or share donor or sponsor names,
            addresses, email addresses, phone numbers, giving history, or any
            other personal information with any third party for their own use.
            We do not participate in list exchanges. There is no opt-out
            required, because we do not do it in the first place.
          </p>
          <p>
            The only parties who ever touch this information are service
            providers acting on our behalf — for example an email or payment
            provider — and only to perform that service for us.
          </p>
        </>
      ),
    },
    {
      id: "what-we-do",
      heading: "What we do with donor information",
      body: (
        <>
          <p>We use the information you give us to:</p>
          <ul>
            <li>Process your gift and issue a receipt for your tax records.</li>
            <li>
              Thank you, and tell you what your support paid for — at a
              frequency you control.
            </li>
            <li>
              Recognize you publicly <em>only</em> if you have affirmatively
              agreed to it.
            </li>
            <li>Meet our legal, accounting, and reporting obligations.</li>
          </ul>
        </>
      ),
    },
    {
      id: "anonymous",
      heading: "Anonymous and named gifts",
      body: (
        <>
          <p>
            You may give anonymously. Recognition — on our website, in
            materials, on a banner, or anywhere else — happens only with your
            explicit consent, and you choose how your name appears. Sponsors
            receive the recognition described in their sponsorship agreement and
            nothing beyond it without asking you first.
          </p>
        </>
      ),
    },
    {
      id: "communication",
      heading: "Communication preferences",
      body: (
        <>
          <p>
            You control how often we contact you and through which channel.
            Every email we send includes an unsubscribe link, and unsubscribing
            from updates never affects your relationship with the club or a
            player&rsquo;s place in a program. To change your preferences or
            stop contact entirely, email us using the details below.
          </p>
        </>
      ),
    },
    {
      id: "confidentiality",
      heading: "Confidentiality and public reporting",
      body: (
        <>
          <p>
            Individual donor names and gift amounts are not published. Nonprofit
            organizations report aggregate financial information on IRS Form
            990, which is a public document; the schedule identifying individual
            donors is not part of the public disclosure copy for a 501(c)(3).
          </p>
        </>
      ),
    },
    {
      id: "retention",
      heading: "How long we keep donor records",
      body: (
        <>
          <p>
            Gift records are retained for at least seven years to meet IRS
            substantiation and accounting requirements. After that period,
            records may be archived, anonymized, or deleted. You may request a
            copy of the donor information we hold about you, or ask us to
            correct it, at any time.
          </p>
        </>
      ),
    },
    {
      id: "refunds",
      heading: "Gift adjustments and refunds",
      body: (
        <>
          <p>
            If you made a gift in error, gave the wrong amount, or intended it
            for a different purpose, contact us and we will correct it. We
            handle these case by case rather than hiding behind a policy — the
            goal is that no supporter ends up out of pocket for a mistake.
          </p>
        </>
      ),
    },
    {
      id: "questions",
      heading: "Questions, requests, and concerns",
      body: (
        <>
          <p>
            Email{" "}
            <a href="mailto:contact@chulavistafc.com">
              contact@chulavistafc.com
            </a>{" "}
            with any question about this policy, a gift, or your information. We
            acknowledge donor requests within three business days.
          </p>
        </>
      ),
    },
  ],
};
