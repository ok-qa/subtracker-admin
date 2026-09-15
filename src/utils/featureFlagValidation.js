const FEATURE_FLAG_NAME_REGEX = /^[A-Z][A-Z0-9_]*$/;

export const normalizeFeatureFlagName = (name) =>
  name.trim().toUpperCase().replace(/\s+/g, "_");

export const isValidFeatureFlagName = (name) =>
  FEATURE_FLAG_NAME_REGEX.test(name);

export const getRawFeatureFlagName = (name) =>
  name.replace(/[^A-Za-z0-9]/g, "");
