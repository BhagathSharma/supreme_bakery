"use client";

import { useParams } from "next/navigation";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import { useDeleteProject } from "@/hooks/useDeleteProject";
import { useUpdateProject } from "@/hooks/useUpdateProject";
import { useAddColumn } from "@/hooks/useAddColumn";
import { useUpdateColumn } from "@/hooks/useUpdateColumn";
import { useDeleteColumn } from "@/hooks/useDeleteColumn";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState } from "react";

import { MemberManager } from "@/components/MemberManager";
import FullPageLoader from "@/components/FullPageLoader";
import KanbanBoard from "@/components/KanbanBoard";

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProjectDetailPage() {
  const { projectId } = useParams();

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useProjectDetails(projectId);
  const { mutate: deleteProject } = useDeleteProject(projectId);
  const { mutate: updateProject } = useUpdateProject(projectId);
  const { mutate: addColumn } = useAddColumn(projectId);
  const { mutate: updateColumn } = useUpdateColumn(null, projectId);
  const { mutate: deleteColumn } = useDeleteColumn(null, projectId);
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [adding, setAdding] = useState(false);

  if (userLoading || projectLoading) return <FullPageLoader />;
  if (userError || !user)
    return <Typography color="error">Failed to load user</Typography>;
  if (projectError || !project)
    return <Typography color="error">Failed to load project</Typography>;

  const handleUpdate = () => {
    updateProject({ name, description });
    setEditMode(false);
  };

  const handleRenameColumn = (columnId, newTitle) => {
    updateColumn({ columnId, title: newTitle });
  };

  const handleDeleteColumn = (columnId) => {
    deleteColumn({ columnId });
  };

  return (
    <Box
      minHeight="100vh"
      py={8}
      px={3}
      sx={{ background: "linear-gradient(to bottom right, #eef2ff, #ffffff)" }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={4}
        >
          <Box flex={1}>
            {editMode ? (
              <Stack spacing={2}>
                <TextField
                  label="Project Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
                <Button
                  onClick={handleUpdate}
                  variant="contained"
                  color="primary"
                >
                  Save Changes
                </Button>
              </Stack>
            ) : (
              <>
                <Typography variant="h4" fontWeight={600} color="text.primary">
                  {project.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  {project.description}
                </Typography>
              </>
            )}
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => {
                setName(project.name || "");
                setDescription(project.description || "");
                setEditMode(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => deleteProject()}
            >
              Delete
            </Button>
          </Stack>
        </Stack>

        <Box mt={6}>
          <Typography variant="h6" fontWeight={500} gutterBottom>
            Team Members
          </Typography>
          <MemberManager
            members={project.members}
            projectId={projectId}
            currentUserId={user.id}
          />
        </Box>

        <Divider sx={{ my: 4 }} />

        <Stack direction="row" spacing={2} alignItems="center" mb={4}>
          <TextField
            label="New Column Title"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            fullWidth
            sx={{ maxWidth: 400 }}
          />
          <Button
            variant="contained"
            disabled={!newColumnTitle || adding}
            onClick={() => {
              setAdding(true);
              addColumn(
                { title: newColumnTitle },
                {
                  onSuccess: () => {
                    setNewColumnTitle("");
                    setAdding(false);
                  },
                  onError: () => setAdding(false),
                }
              );
            }}
          >
            {adding ? <CircularProgress size={20} /> : "Add Column"}
          </Button>
        </Stack>

        <KanbanBoard
          columns={project.columns}
          onRenameColumn={handleRenameColumn}
          onDeleteColumn={handleDeleteColumn}
          projectId={projectId}
        />
      </Container>
    </Box>
  );
}
