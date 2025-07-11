"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import TaskCard from "./TaskCard";

export default function ColumnCard({
  column,
  columnIndex,
  totalColumns,
  onRename,
  onDelete,
  projectId,
  onOpenTaskModal,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(column.title);

  return (
    <Box
      sx={{
        borderRadius: 2,
        p: 2,
        backgroundColor: "white",
        boxShadow: 2,
        minHeight: "200px",
      }}
    >
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography fontWeight={600}>{column.title}</Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => setRenameOpen(true)}>
            Rename
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      <Stack spacing={1}>
        {column.tasks.map((task, idx) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onMoveUp={() => onMoveTask("up", column.id, idx)}
            onMoveDown={() => onMoveTask("down", column.id, idx)}
            onMoveLeft={() => onMoveTask("left", column.id, idx)}
            onMoveRight={() => onMoveTask("right", column.id, idx)}
            disableUp={idx === 0}
            disableDown={idx === column.tasks.length - 1}
            disableLeft={columnIndex === 0}
            disableRight={columnIndex === totalColumns - 1}
          />
        ))}
      </Stack>

      <Button
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => onOpenTaskModal(column.id)}
      >
        + New Task
      </Button>
      {/* Rename Dialog */}
      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)}>
        <DialogTitle>Rename Column</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onRename(column.id, newTitle);
              setRenameOpen(false);
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>
          <Typography color="error">Delete Column</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this column? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              onDelete(column.id);
              setDeleteOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
