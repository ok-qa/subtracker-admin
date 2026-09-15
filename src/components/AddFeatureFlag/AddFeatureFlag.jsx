import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { createFeatureFlag } from "../../api";
import {
  getRawFeatureFlagName,
  isValidFeatureFlagName,
  normalizeFeatureFlagName,
} from "../../utils/featureFlagValidation";

const AddFeatureFlag = ({ featureFlags, setFeatureFlags }) => {
  const [newFlagName, setNewFlagName] = useState("");
  const [newFlagValue, setNewFlagValue] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [textError, setTextError] = useState("");

  const normalizedName = normalizeFeatureFlagName(newFlagName);

  const isExists = featureFlags.some(
    (flag) =>
      getRawFeatureFlagName(flag.name) ===
      getRawFeatureFlagName(normalizedName),
  );

  const isValidName =
    normalizedName.length > 0 && isValidFeatureFlagName(normalizedName);

  const handleNameChange = (e) => {
    setNewFlagName(e.target.value);
    setTextError("");
  };

  const handleAddFeatureFlag = async (e) => {
    e.preventDefault();

    if (!isValidName) {
      setTextError(
        "Use letters, numbers, and underscores. The name must start with a letter.",
      );
      return;
    }

    if (isExists) {
      setTextError("A feature flag with this name already exists.");
      return;
    }

    setIsAdding(true);
    setTextError("");

    try {
      const newFlags = await createFeatureFlag({
        [normalizedName]: newFlagValue,
      });

      setFeatureFlags(newFlags);

      setNewFlagName("");
      setNewFlagValue(false);
    } catch (error) {
      if (error.response?.status === 409) {
        setTextError("A feature flag with this name already exists.");
      } else {
        setTextError("Failed to create feature flag.");
        console.error("create feature flag error:", error);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const getHelperText = () => {
    if (textError) {
      return textError;
    }

    if (newFlagName && !isValidName) {
      return "The name must start with a letter and contain only letters, numbers, and underscores.";
    }

    if (isExists) {
      return "A feature flag with this name already exists.";
    }

    return "Use letters, numbers, and underscores.";
  };

  const showError =
    Boolean(textError) || (Boolean(newFlagName) && !isValidName) || isExists;

  return (
    <Paper
      component="form"
      onSubmit={handleAddFeatureFlag}
      variant="outlined"
      sx={{
        width: "100%",
        maxWidth: 500,
        p: 4,
        border: 0,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Add Feature Flag
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Feature flag naming rules:
        </Typography>

        <Box
          component="ol"
          sx={{
            mt: 0,
            mb: 0,
            pl: 2.5,
            color: "text.secondary",
            fontSize: 14,
          }}
        >
          <li>Use letters, numbers, and underscores only.</li>
          <li>The name must start with a letter.</li>
          <li>Numbers are allowed after the first letter.</li>
          <li>Special characters are not allowed.</li>
          <li>Feature flag names must be unique.</li>
        </Box>
      </Box>

      <TextField
        label="Feature flag name"
        placeholder="e.g. NEW_DASHBOARD"
        value={newFlagName}
        onChange={handleNameChange}
        fullWidth
        required
        error={showError}
        helperText={getHelperText()}
        inputProps={{
          maxLength: 50,
        }}
      />

      <FormControlLabel
        sx={{ mt: 2 }}
        control={
          <Checkbox
            checked={newFlagValue}
            onChange={(e) => setNewFlagValue(e.target.checked)}
          />
        }
        label="Enable by default"
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isAdding || !isValidName || isExists}
        sx={{ mt: 2 }}
      >
        {isAdding ? "Adding..." : "Add Feature Flag"}
      </Button>
    </Paper>
  );
};

export default AddFeatureFlag;
