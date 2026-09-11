import { axiosInstance } from "./axios";
import { featureFlagsRequests } from "./featureFlags";

export const api = {
  ...featureFlagsRequests(),
  getBaseURL: () => axiosInstance.defaults.baseURL,
};

export const getFeatureFlags = async () => {
  try {
    const {
      data: { data },
    } = await api.getFeatureFlagsRequest();
    return data;
  } catch (error) {
    console.error("Failed to get feature flags", error);
    return [];
  }
};

export const updateFeatureFlags = async (featureFlags) => {
  try {
    const {
      data: { data },
    } = await api.updateFeatureFlagsRequest(featureFlags);
    return data;
  } catch (error) {
    console.error("Failed to update feature flags", error);
    return [];
  }
};

export const createFeatureFlag = async (newFlagData) => {
  const {
    data: { data },
  } = await api.createFeatureFlagRequest(newFlagData);
  return data;
};

export const deleteFeatureFlag = async (id) => {
  try {
    await api.deleteFeatureFlagRequest(id);
    return id;
  } catch (error) {
    console.error("Failed to delete featureFlag:", error);
    throw error;
  }
};
