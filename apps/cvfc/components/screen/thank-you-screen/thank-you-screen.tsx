import Link from "next/link";

import { DonationComplete } from "@/components/analytics";
import { Section } from "@/components/layout";
import { cn } from "@/lib/utils";

import "./thank-you-screen.css";

const CONTACT_EMAIL = "contact@chulavistafc.com";

/** Runs before paint so site chrome never flashes inside the Zeffy embed. */
const EMBED_FLAG = `if(window.self!==window.top)document.documentElement.dataset.embed="true"`;

type ThankYouScreenProps = {
  className?: string;
};

/**
 * Zeffy's post-donation redirect target. Renders inside the Zeffy iframe on a
 * completed gift, which is what lets `DonationComplete` reach the parent
 * frame's dataLayer. Also works as a normal page if visited directly.
 */
export function ThankYouScreen({ className }: ThankYouScreenProps) {
  return (
    <main className={cn("thank-you-screen", className)}>
      <script dangerouslySetInnerHTML={{ __html: EMBED_FLAG }} />
      <DonationComplete />

      <Section size="intro" ariaLabel="Donation received">
        <div className="thank-you-screen-body">
          <p className="thank-you-screen-eyebrow">Gift received</p>
          <h1 className="thank-you-screen-heading">Thank you.</h1>
          <p className="thank-you-screen-lead">
            Your receipt is on its way by email from Zeffy. If it hasn&apos;t
            landed in a few minutes, check your spam folder. Chula Vista FC is a
            501(c)(3) nonprofit, so your gift is tax-deductible.
          </p>

          <div className="thank-you-screen-section">
            <h2 className="thank-you-screen-subheading">Where this goes</h2>
            <p>
              Need-based player scholarships, lit field time, equipment, and the
              coaching that carries a player through the pathway — including our
              goalkeeper specialty. Every dollar stays in the South Bay.
            </p>
          </div>

          <div className="thank-you-screen-section">
            <h2 className="thank-you-screen-subheading">If you need us</h2>
            <p>
              Questions about your gift, a receipt, or setting up recurring
              support — email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and
              we&apos;ll take care of it.
            </p>
          </div>

          <p className="thank-you-screen-back">
            <Link href="/">Back to Chula Vista FC</Link>
          </p>
        </div>
      </Section>
    </main>
  );
}
