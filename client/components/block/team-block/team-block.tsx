import type { TeamMember, TeamBlockData } from "@/lib/blocks";
import "./team-block.css";

type TeamBlockProps = {
  data: TeamBlockData;
};

/**
 * TeamBlock - Renders a grid of team member cards with optional image, bio, and social links
 * Content block (leaf node) - cannot have children
 */
export function TeamBlock({ data }: TeamBlockProps) {
  const {
    members = [],
    columns = 3,
    variant = "default",
    showBio = false,
    showSocial = false,
  } = data;

  if (members.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="team-block"
      data-columns={columns}
      data-variant={variant}
    >
      {members.map((member: TeamMember, index: number) => (
        <div key={index} data-slot="team-block-member">
          {member.image ? (
            <div data-slot="team-block-image">
              {/* eslint-disable-next-line @next/next/no-img-element -- dynamic CMS images */}
              <img
                src={member.image}
                alt={member.name}
                data-slot="team-block-img"
              />
            </div>
          ) : null}

          <div data-slot="team-block-info">
            <div data-slot="team-block-name">{member.name}</div>
            <div data-slot="team-block-role">{member.role}</div>

            {showBio && member.bio ? (
              <p data-slot="team-block-bio">{member.bio}</p>
            ) : null}

            {showSocial && member.social && member.social.length > 0 ? (
              <div data-slot="team-block-social">
                {member.social.map((link: { platform: string; url: string }, linkIndex: number) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    data-slot="team-block-social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on ${link.platform}`}
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
