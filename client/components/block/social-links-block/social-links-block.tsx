import { cn } from "@/lib/utils";

interface SocialLinksBlockProps {
  data: {
    links?: Array<{ platform: string; url: string }>;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "filled" | "outline";
    align?: "left" | "center" | "right";
  };
}

const emoji: Record<string, string> = {
  facebook: "📘", twitter: "🐦", instagram: "📷", linkedin: "💼",
  youtube: "▶️", tiktok: "🎵", github: "🐙", dribbble: "🏀", behance: "🎨", pinterest: "📌",
};

const sizes = { sm: "size-8 text-sm", md: "size-10 text-base", lg: "size-12 text-lg" };
const aligns = { left: "justify-start", center: "justify-center", right: "justify-end" };

export function SocialLinksBlock({ data }: SocialLinksBlockProps) {
  const { links = [], size = "md", variant = "default", align = "center" } = data;

  return (
    <div className={cn("flex gap-2 flex-wrap", aligns[align])}>
      {links.map((link, i) => (
        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
          className={cn("flex items-center justify-center rounded-full transition-colors", sizes[size],
            variant === "filled" && "bg-foreground text-background hover:bg-primary",
            variant === "outline" && "border hover:border-primary hover:text-primary",
            variant === "default" && "text-muted-foreground hover:text-primary",
          )}
          title={link.platform}
        >
          {emoji[link.platform.toLowerCase()] || "🔗"}
        </a>
      ))}
    </div>
  );
}
