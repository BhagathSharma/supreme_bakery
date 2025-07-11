"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { useUserSearch } from "@/hooks/useUserSearch";
import { useUserById } from "@/hooks/useUserById";
import dayjs from "dayjs";

const priorities = ["Low", "Medium", "High"];

export default function TaskFormModal({
  open,
  onClose,
  onSubmit,
  initialData = {},
  mode = "create",
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(null);
  const [assigneeQuery, setAssigneeQuery] = useState("");
  const [assignee, setAssignee] = useState(null);

  const { data: users = [], isFetching } = useUserSearch(assigneeQuery);

  const {
    data: fetchedAssignee,
    refetch: refetchAssignee,
    isFetching: loadingAssignee,
  } = useUserById(initialData?.assigneeId);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPriority(initialData.priority || "Medium");
      setDueDate(initialData.dueDate ? dayjs(initialData.dueDate) : null);

      if (initialData.assignee) {
        setAssignee({
          id: initialData.assignee.id,
          name: initialData.assignee.name,
          email: initialData.assignee.email,
        });
      } else if (initialData?.assigneeId) {
        refetchAssignee();
      }
    }

    if (mode === "create") {
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate(null);
      setAssignee(null);
    }
  }, [open]);

  useEffect(() => {
    if (fetchedAssignee && !assignee) {
      setAssignee({
        id: fetchedAssignee.id,
        name: fetchedAssignee.name,
        email: fetchedAssignee.email,
      });
    }
  }, [fetchedAssignee]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title,
      description,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : null,
      assigneeId: assignee?.id || null,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "edit" ? "Edit Task" : "New Task"}</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
      >
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          label="Title"
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {priorities.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>

        <DatePicker
          label="Due Date"
          value={dueDate}
          onChange={setDueDate}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <Autocomplete
          loading={isFetching || loadingAssignee}
          inputValue={assigneeQuery}
          onInputChange={(_, val) => setAssigneeQuery(val)}
          value={assignee}
          onChange={(_, newValue) => {
            if (!newValue) {
              setAssignee(null);
            } else {
              setAssignee({
                id: newValue.id,
                name: newValue.name,
                email: newValue.email,
              });
            }
          }}
          options={users}
          getOptionLabel={(option) => option?.name || option?.email || ""}
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name || option.email}
              {option.name && option.email && (
                <span style={{ color: "#888", marginLeft: 8 }}>
                  ({option.email})
                </span>
              )}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Assignee"
              placeholder="Search user by name or email"
              helperText="Start typing to search project members"
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {(isFetching || loadingAssignee) && (
                      <CircularProgress size={20} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === "edit" ? "Save Changes" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
