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
  Typography,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useState } from "react";
import { deleteFeatureFlag, updateFeatureFlags } from "../../api";

const EditFeatureFlags = ({
  featureFlags,
  setFeatureFlags,
  fetchFeatureFlags,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [flagToDelete, setFlagToDelete] = useState(null);

  const handleChange = (id) => {
    const updatedFlags = featureFlags.map((flag) =>
      flag._id === id ? { ...flag, value: !flag.value } : flag,
    );

    setFeatureFlags(updatedFlags);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const parsedFlags = featureFlags.reduce((acc, flag) => {
        acc[flag.name] = flag.value;
        return acc;
      }, {});

      const updatedFlags = await updateFeatureFlags(parsedFlags);

      setFeatureFlags(updatedFlags);
    } catch (error) {
      console.error("update feature flags error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (flag) => {
    setFlagToDelete(flag);
  };

  const handleConfirmDelete = async () => {
    if (!flagToDelete) return;

    setIsDeleting(true);

    try {
      await deleteFeatureFlag(flagToDelete._id);
      await fetchFeatureFlags();
    } catch (error) {
      console.error("delete feature flag error:", error);
    } finally {
      setFlagToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setFlagToDelete(null);
  };

  return (
    <>
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
        <Typography variant="h5" sx={{ mb: 2 }}>
          Feature Flags List:
        </Typography>

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
                sx={{
                  "&:focus": { outline: "none" },
                }}
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
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Paper>

      <Dialog open={Boolean(flagToDelete)} onClose={handleCancelDelete}>
        <DialogTitle>Delete Feature Flag?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{flagToDelete?.name}</strong>?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={isDeleting}>
            Cancel
          </Button>

          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditFeatureFlags;
