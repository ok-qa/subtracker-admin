import { axiosInstance } from "./axios";

export const featureFlagsRequests = () => {
  return {
    getFeatureFlagsRequest: () =>
      axiosInstance.request({ method: "GET", url: "/feature-flags" }),

    updateFeatureFlagsRequest: (data) =>
      axiosInstance.request({ method: "PATCH", url: "/feature-flags", data }),

    createFeatureFlagRequest: (data) =>
      axiosInstance.request({ method: "POST", url: "/feature-flags", data }),

    deleteFeatureFlagRequest: (id) =>
      axiosInstance.request({ method: "DELETE", url: `/feature-flags/${id}` }),
  };
};
