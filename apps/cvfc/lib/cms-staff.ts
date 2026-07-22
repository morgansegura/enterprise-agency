import type { Coach } from "@/data/coaches";
import type { AdminMember } from "@/data/administrators";
import { mediaUrl, type StaffDoc } from "@/lib/cms";

/**
 * Maps CMS `Staff` collection docs → the FE `Coach` / `AdminMember` shapes the
 * directory features expect, so coaching-staff + administrators render from the
 * single Staff source of truth (with the static data files as fallback).
 */

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() !== "" ? v : undefined;

const arr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

function image(d: StaffDoc): { src: string; alt: string } | undefined {
  const src = mediaUrl(d.photo) ?? str(d.imageUrl);
  return src ? { src, alt: d.name ?? "" } : undefined;
}

/** A CMS Staff doc → FE `Coach` (for StaffDirectory). */
export function staffToCoach(d: StaffDoc): Coach {
  return {
    id: String(d.key ?? d.id),
    name: d.name ?? "",
    title: str(d.title) ?? "",
    role: "head-coach",
    pathway: arr(d.pathway) as Coach["pathway"],
    programs: arr(d.programs) as Coach["programs"],
    team: str(d.team),
    credentials: arr(d.credentials),
    achievements: arr(d.achievements),
    bio: str(d.bio),
    image: image(d),
    contact: { email: str(d.email), phone: str(d.phone) },
    isFeatured: Boolean(d.isFeatured),
    status: (str(d.status) as Coach["status"]) ?? "active",
    joinedYear: typeof d.joinedYear === "number" ? d.joinedYear : undefined,
  };
}

/** A CMS Staff doc → FE `AdminMember` (for AdminDirectory). */
export function staffToAdmin(d: StaffDoc): AdminMember {
  return {
    id: String(d.key ?? d.id),
    name: d.name ?? "",
    title: str(d.title) ?? "",
    department: str(d.department),
    credentials: arr(d.credentials),
    achievements: arr(d.achievements),
    bio: str(d.bio),
    image: image(d),
    contact: { email: str(d.email), phone: str(d.phone) },
    status: (str(d.status) as AdminMember["status"]) ?? "active",
    joinedYear: typeof d.joinedYear === "number" ? d.joinedYear : undefined,
  };
}
