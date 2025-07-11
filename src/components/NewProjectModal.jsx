"use client";

import { useState } from "react";
import { useCreateProject } from "@/hooks/useCreateProject";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export function NewProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending } = useCreateProject();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(
      { name, description },
      {
        onSuccess: () => {
          setIsOpen(false);
          setName("");
          setDescription("");
        },
      }
    );
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
        sx={{
          textTransform: "none",
          borderRadius: "12px",
          boxShadow: 2,
          background: "linear-gradient(to right, #6366f1, #8b5cf6)",
          "&:hover": {
            background: "linear-gradient(to right, #4f46e5, #7c3aed)",
          },
        }}
      >
        Create Project
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography
            variant="h6"
            color="primary"
            display="flex"
            gap={1}
            alignItems="center"
          >
            🚀 New Project
          </Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent
            dividers
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Project Name"
              placeholder="Plan Pilot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Description"
              placeholder="Managing myself using myself"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setIsOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isPending}
              startIcon={isPending && <CircularProgress size={16} />}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
