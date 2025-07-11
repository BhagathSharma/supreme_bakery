"use client";

import { useUpdateProject } from "@/hooks/useUpdateProject";
import { useUserSearch } from "@/hooks/useUserSearch";
import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { MoreHoriz, PersonAdd, Delete } from "@mui/icons-material";
import { toast } from "sonner";

export function MemberManager({ members, projectId, currentUserId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuUserId, setMenuUserId] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("CONTRIBUTOR");

  const { data: users, isLoading: searching } = useUserSearch(search);
  const { mutate: updateProject } = useUpdateProject(projectId);

  const roles = ["PM", "CONTRIBUTOR", "VIEWER"];
  const currentUser = members.find((m) => m.user.id === currentUserId);
  const isPM = currentUser?.role === "PM";

  const handleMenuOpen = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setMenuUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuUserId(null);
  };

  const handleRoleChange = (userId, role) => {
    updateProject({ updateMembers: [{ userId, role }] });
    toast.success("Role updated");
    handleMenuClose();
  };

  const handleRemove = (userId) => {
    updateProject({ removeMembers: [userId] });
    toast.success("Member removed");
    handleMenuClose();
  };

  const handleInvite = (userId) => {
    const alreadyAdded = members.some((m) => m.user.id === userId);
    if (alreadyAdded) {
      toast("This user is already a member", { icon: "ℹ️" });
      return;
    }
    updateProject({ addMembers: [{ userId, role: selectedRole }] });
    toast.success("Member added");
    setInviteOpen(false);
    setSearch("");
    setSelectedRole("CONTRIBUTOR");
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {members.map((m) => {
        const isSelf = m.user.id === currentUserId;
        const canManage = isPM && !isSelf && m.role !== "PM";

        return (
          <Box
            key={m.user.id}
            display="flex"
            alignItems="center"
            gap={2}
            p={1.5}
            border={1}
            borderColor="grey.300"
            borderRadius={8}
            bgcolor="white"
          >
            <Avatar src={m.user.image} alt={m.user.name || m.user.email} />
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {m.user.name || m.user.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {m.role}
              </Typography>
            </Box>

            {canManage && (
              <>
                <IconButton onClick={(e) => handleMenuOpen(e, m.user.id)}>
                  <MoreHoriz fontSize="small" />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={menuUserId === m.user.id}
                  onClose={handleMenuClose}
                >
                  <Typography variant="caption" sx={{ px: 2, pt: 1 }}>
                    Change Role:
                  </Typography>
                  {roles.map((r) => (
                    <MenuItem
                      key={r}
                      onClick={() => handleRoleChange(m.user.id, r)}
                      selected={r === m.role}
                    >
                      {r}
                    </MenuItem>
                  ))}
                  <MenuItem
                    onClick={() => handleRemove(m.user.id)}
                    sx={{ color: "error.main", mt: 1 }}
                  >
                    <Delete fontSize="small" sx={{ mr: 1 }} />
                    Remove Member
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        );
      })}

      {isPM && (
        <>
          <Button
            variant="outlined"
            startIcon={<PersonAdd />}
            onClick={() => setInviteOpen(true)}
          >
            Add Member
          </Button>

          <Dialog
            open={inviteOpen}
            onClose={() => setInviteOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Invite Member</DialogTitle>
            <DialogContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email"
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  native
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {searching && (
                <Typography variant="caption" color="text.secondary">
                  Searching...
                </Typography>
              )}

              {users?.length > 0 && (
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  maxHeight={250}
                  overflow="auto"
                >
                  {users.map((user) => {
                    const alreadyAdded = members.some(
                      (m) => m.user.id === user.id
                    );
                    return (
                      <Box
                        key={user.id}
                        p={1.5}
                        border={1}
                        borderColor={alreadyAdded ? "grey.200" : "grey.300"}
                        borderRadius={2}
                        sx={{
                          cursor: alreadyAdded ? "not-allowed" : "pointer",
                          bgcolor: alreadyAdded ? "grey.100" : "white",
                          opacity: alreadyAdded ? 0.6 : 1,
                        }}
                        onClick={() => {
                          if (!alreadyAdded) handleInvite(user.id);
                        }}
                      >
                        <Typography fontWeight={500}>
                          {user.name || user.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {alreadyAdded ? "Already a member" : user.email}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setInviteOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}
