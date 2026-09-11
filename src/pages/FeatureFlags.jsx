import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useEffect, useState } from "react";
import {
  createFeatureFlag,
  deleteFeatureFlag,
  getFeatureFlags,
  updateFeatureFlags,
} from "../api";

const FeatureFlags = () => {
  const [featureFlags, setFeatureFlags] = useState([]);
  const [isSaving, setIsSaving] = useState();

  const [newFlagName, setNewFlagName] = useState("");
  const [newFlagValue, setNewFlagValue] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [flagToDelete, setFlagToDelete] = useState(null);

  const [textError, setTextError] = useState("");

  const fetchFeatureFlags = async () => {
    try {
      const data = await getFeatureFlags();
      setFeatureFlags(data);
    } catch (error) {
      console.error("fetch featureFlags error: ", error);
    }
  };

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  const newParsedFlagName = newFlagName.trim().toUpperCase().replace(" ", "_");
  const passedRegexValidationName =
    newParsedFlagName && /^[A-Z][A-Z0-9_]*$/.test(newParsedFlagName);
  const isExists = featureFlags.some((flag) => flag.name === newParsedFlagName);
  const isValidFlag = passedRegexValidationName && !isExists;

  const handleChange = (id) => {
    setFeatureFlags((prev) =>
      prev.map((flag) =>
        flag._id === id ? { ...flag, value: !flag.value } : flag,
      ),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    const parsedFlags = featureFlags.reduce((acc, currentValue) => {
      acc[currentValue.name] = currentValue.value;
      return acc;
    }, {});

    await updateFeatureFlags(parsedFlags);
    setIsSaving(false);
  };

  const handleAddFeatureFlag = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const newFlags = await createFeatureFlag({
        [newParsedFlagName]: newFlagValue,
      });

      setFeatureFlags(newFlags);
      setNewFlagName("");
      setNewFlagValue(false);
    } catch (error) {
      if (error.status === 409) {
        setTextError("This flag is already exist");
      }
      console.error("create feature flag error: ", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteClick = (flag) => {
    setFlagToDelete(flag);
  };

  const handleConfirmDelete = async () => {
    if (!flagToDelete) return;
    try {
      await deleteFeatureFlag(flagToDelete._id);
      await fetchFeatureFlags();
      setFlagToDelete(null);
    } catch (error) {
      console.error("delete feature flag error:", error);
    }
  };

  const handleCancelDelete = () => {
    setFlagToDelete(null);
  };

  return (
    <Box>
      <Box>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Feature Flags
        </Typography>
      </Box>
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
            borderTop: 0,
            borderLeft: 0,
            borderBottom: 0,
            borderRadius: 0,
          }}
        >
          <FormGroup>
            {featureFlags.map((flag) => (
              <Box
                key={flag._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <FormControlLabel
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
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClick(flag)}
                  aria-label={`Delete ${flag.name}`}
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Box>
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

        <Paper
          component="form"
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: 500,
            p: 4,
            border: 0,
          }}
        >
          <TextField
            label="Feature flag name"
            error={!!textError}
            placeholder="e.g. NEW_COLORSCHEME"
            value={newFlagName}
            onChange={(e) => setNewFlagName(e.target.value)}
            fullWidth
            required
            helperText={textError || "Use uppercase letters and underscores"}
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
            onClick={handleAddFeatureFlag}
            disabled={isAdding || !isValidFlag}
            sx={{ mt: 2 }}
          >
            {isAdding ? "Adding..." : "Add Feature Flag"}
          </Button>
        </Paper>
      </Box>
      <Dialog open={Boolean(flagToDelete)} onClose={handleCancelDelete}>
        <DialogTitle>Delete Feature Flag?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete
            <strong>{flagToDelete?.name}</strong>?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>

          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeatureFlags;
