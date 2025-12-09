import { SetMetadata } from "@nestjs/common";

export const TIER_KEY = "required_tier";

/**
 * Decorator to require specific tenant tier for accessing a route
 * @param tiers - One or more tenant tiers required (CONTENT_EDITOR, BUILDER)
 */
export const RequireTier = (...tiers: string[]) => SetMetadata(TIER_KEY, tiers);
