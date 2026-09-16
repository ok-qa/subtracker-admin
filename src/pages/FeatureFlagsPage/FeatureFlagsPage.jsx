import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getFeatureFlags } from "../../api";
import EditFeatureFlags from "../../components/EditFeatureFlag/EditFeatureFlags";
import AddFeatureFlag from "../../components/AddFeatureFlag/AddFeatureFlag";

const FeatureFlagsPage = () => {
  const [featureFlags, setFeatureFlags] = useState([]);

  const fetchFeatureFlags = async () => {
    try {
      const data = await getFeatureFlags();
      setFeatureFlags(data);
    } catch (error) {
      console.error("fetch feature flags error:", error);
    }
  };

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Feature Flags
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 4,
          p: 4,
        }}
      >
        <EditFeatureFlags
          featureFlags={featureFlags}
          setFeatureFlags={setFeatureFlags}
          fetchFeatureFlags={fetchFeatureFlags}
        />
        <Divider orientation="vertical" flexItem />

        <AddFeatureFlag
          featureFlags={featureFlags}
          setFeatureFlags={setFeatureFlags}
        />
      </Box>
    </Box>
  );
};

export default FeatureFlagsPage;
