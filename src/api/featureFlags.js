import { axiosInstance } from "./axios";

export const featureFlagsRequests = () => {
  return {
    getFeatureFlagsRequest: () =>
      axiosInstance.request({ method: "GET", url: "/feature-flags" }),

    updateFeatureFlagsRequest: (data) =>
      axiosInstance.request({ method: "PATCH", url: "/feature-flags", data }),
  };
};
