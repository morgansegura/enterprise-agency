/* eslint-disable @next/next/no-img-element -- dynamic CMS images */
import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

interface TeamBlockData {
  members: TeamMember[];
  columns?: 2 | 3 | 4;
  variant?: "default" | "card" | "minimal";
  showBio?: boolean;
}

export default function TeamBlockRenderer({
  block,
  onChange,
  isEditing,
}: BlockRendererProps) {
  const data = block.data as unknown as TeamBlockData;
  const {
    members = [],
    columns = 3,
    variant = "default",
    showBio = false,
  } = data;

  if (members.length === 0) return null;

  return (
    <div
      data-slot="team-block"
      data-columns={columns}
      data-variant={variant}
    >
      {members.map((member, i) => (
        <div key={i} data-slot="team-block-member">
          {member.image ? (
            <div data-slot="team-block-image">
              <img
                src={member.image}
                alt={member.name}
                data-slot="team-block-img"
              />
            </div>
          ) : null}

          <div data-slot="team-block-info">
            <div
              data-slot="team-block-name"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== member.name && onChange) {
                  const updated = [...members];
                  updated[i] = { ...member, name: v };
                  onChange({
                    ...block,
                    data: { ...block.data, members: updated },
                  });
                }
              }}
              style={
                isEditing
                  ? { cursor: "text", outline: "none" }
                  : undefined
              }
            >
              {member.name}
            </div>

            <div
              data-slot="team-block-role"
              contentEditable={!!isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = e.currentTarget.textContent || "";
                if (v !== member.role && onChange) {
                  const updated = [...members];
                  updated[i] = { ...member, role: v };
                  onChange({
                    ...block,
                    data: { ...block.data, members: updated },
                  });
                }
              }}
              style={
                isEditing
                  ? { cursor: "text", outline: "none" }
                  : undefined
              }
            >
              {member.role}
            </div>

            {showBio && member.bio ? (
              <p data-slot="team-block-bio">{member.bio}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
