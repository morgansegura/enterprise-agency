import type { Testimonial } from "@/data/testimonials";
import type { Facility } from "@/data/facilities";
import { mediaUrl, type TestimonialDoc, type FacilityDoc } from "@/lib/cms";

/** A CMS Testimonials doc → FE `Testimonial`. */
export function cmsToTestimonial(d: TestimonialDoc): Testimonial {
  const img = mediaUrl(d.photo) ?? d.imageUrl ?? undefined;
  return {
    id: String(d.key ?? d.id),
    quote: d.quote ?? "",
    author: d.author ?? "",
    role: (d.role as Testimonial["role"]) ?? "Parent",
    context: d.context ?? undefined,
    featured: Boolean(d.featured),
    longform: d.longform ?? undefined,
    image: img ? { src: img, alt: d.author ?? "" } : undefined,
    status: (d.status as Testimonial["status"]) ?? "active",
  };
}

/** A CMS Facilities doc → FE `Facility`. */
export function cmsToFacility(d: FacilityDoc): Facility {
  const img = mediaUrl(d.photo) ?? d.imageUrl ?? undefined;
  return {
    id: String(d.key ?? d.id),
    name: d.name ?? "",
    tier: (d.tier as Facility["tier"]) ?? "park",
    role: (d.role ?? "") as Facility["role"],
    roleLabel: d.roleLabel ?? "",
    address: {
      street: d.address?.street ?? "",
      city: d.address?.city ?? "",
      state: d.address?.state ?? "",
      zip: d.address?.zip ?? "",
    },
    description: d.description ?? "",
    uses: Array.isArray(d.uses) ? d.uses : [],
    features: Array.isArray(d.features) ? d.features : [],
    image: img ? { src: img, alt: d.name ?? "" } : undefined,
    mapsUrl: d.mapsUrl ?? "#",
    status: (d.status as Facility["status"]) ?? "active",
  };
}
