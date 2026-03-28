import type { BlockRendererProps } from "@/lib/renderer/block-renderer-registry";
import { cn } from "@/lib/utils";

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

export default function TeamBlockRenderer({ block, onChange, isEditing }: BlockRendererProps) {
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
      className={cn(
        "grid gap-6",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      )}
    >
      {members.map((member, i) => (
        <div
          key={i}
          className={cn(
            "flex flex-col items-center text-center p-4",
            variant === "card" &&
              "bg-card border border-border rounded-lg shadow-sm",
            variant === "minimal" && "py-2",
          )}
        >
          {member.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={member.image}
              alt={member.name}
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[var(--el-100)] flex items-center justify-center mb-3 text-2xl font-bold text-[var(--el-500)]">
              {member.name.charAt(0)}
            </div>
          )}
          <h4
            className="text-sm font-semibold"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const v = e.currentTarget.textContent || "";
              if (v !== member.name && onChange) {
                const updated = [...members];
                updated[i] = { ...member, name: v };
                onChange({ ...block, data: { ...block.data, members: updated } });
              }
            }}
            style={isEditing ? { cursor: "text", outline: "none" } : undefined}
          >
            {member.name}
          </h4>
          <p
            className="text-xs text-[var(--el-500)]"
            contentEditable={!!isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              const v = e.currentTarget.textContent || "";
              if (v !== member.role && onChange) {
                const updated = [...members];
                updated[i] = { ...member, role: v };
                onChange({ ...block, data: { ...block.data, members: updated } });
              }
            }}
            style={isEditing ? { cursor: "text", outline: "none" } : undefined}
          >
            {member.role}
          </p>
          {showBio && member.bio && (
            <p className="text-xs text-[var(--el-500)] mt-2 line-clamp-3">
              {member.bio}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
