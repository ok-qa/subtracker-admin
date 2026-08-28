import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getFeatureFlags, updateFeatureFlags } from "../api";

const FeatureFlags = () => {
  const [featureFlags, setFeatureFlags] = useState([]);
  const [isSaving, setIsSaving] = useState();

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const data = await getFeatureFlags();
        console.log("fetch featureFlags data: ", data);
        setFeatureFlags(data);
      } catch (error) {
        console.error("fetch featureFlags error: ", error);
      }
    };
    fetchFeatureFlags();
  }, []);

  const handleChange = (id) => {
    setFeatureFlags((prev) =>
      prev.map((flag) =>
        flag._id === id ? { ...flag, value: !flag.value } : flag,
      ),
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    const parsedFlags = featureFlags.reduce((acc, currentValue) => {
      acc[currentValue.name] = currentValue.value;
      return acc;
    }, {});
    console.log("parsedFlags: ", parsedFlags);

    updateFeatureFlags(parsedFlags);
    setIsSaving(false);
  };

  return (
    <Box
      sx={{
        // minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 4,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 4,
        }}
      >
        <Typography variant="h3" sx={{ mb: 3 }}>
          Feature Flags
        </Typography>
        <FormGroup>
          {featureFlags.map((flag) => (
            <FormControlLabel
              key={flag._id}
              control={
                <Checkbox
                  checked={flag.value}
                  onChange={() => handleChange(flag._id)}
                />
              }
              label={flag.name
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            />
          ))}
        </FormGroup>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving}
          sx={{ mt: 3 }}
        >
          Save
        </Button>
      </Paper>
    </Box>
  );
};

export default FeatureFlags;
