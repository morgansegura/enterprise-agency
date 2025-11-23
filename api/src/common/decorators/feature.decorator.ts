import { SetMetadata } from "@nestjs/common";

export const FEATURE_KEY = "required_features";

/**
 * Decorator to require specific features for accessing a route
 * Supports nested features using dot notation (e.g., 'payments.stripe')
 *
 * @param features - One or more feature keys required (e.g., 'shop', 'payments.stripe')
 */
export const RequireFeature = (...features: string[]) =>
  SetMetadata(FEATURE_KEY, features);
