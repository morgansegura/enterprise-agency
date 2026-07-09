import Image from "next/image";

import { Section } from "@/components/layout";
import { Heading, Text } from "@/components/ui";
import {
  landingScreenMock,
  type ContactBlock,
} from "@/data/mocks/landing-screen.mock";

import { ContactForm } from "./contact-form";

import "./contact.css";

type ContactProps = {
  content?: ContactBlock;
};

/** Contact — intro + logo beside a form card. Mock-driven copy; the form fields
 *  are fixed structure. */
export function Contact({ content = landingScreenMock.contact }: ContactProps) {
  return (
    <Section id="contact" ariaLabel={content.heading} className="contact">
      <div className="contact-grid">
        <div className="contact-intro">
          <Heading as="h2" size="xl" className="contact-heading">
            {content.heading}
          </Heading>

          {content.body?.length ? (
            <div className="contact-body">
              {content.body.map((paragraph, i) => (
                <Text key={i} className="contact-paragraph">
                  {paragraph}
                </Text>
              ))}
            </div>
          ) : null}

          {content.image ? (
            <Image
              src={content.image.url}
              alt={content.image.alt}
              width={440}
              height={320}
              className="contact-logo"
            />
          ) : null}
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
