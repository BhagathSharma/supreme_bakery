"use client";

import { useState } from "react";
import { useUpdateProject } from "@/hooks/useUpdateProject";
import { Button, Menu, MenuItem, Typography, Box } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export function RoleManager({ userId, name, email, currentRole, projectId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { mutate: updateProject } = useUpdateProject(projectId);

  const roles = ["PM", "CONTRIBUTOR", "VIEWER"];

  const handleRoleChange = (role) => {
    updateProject({ updateMembers: [{ userId, role }] });
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: "none",
          borderRadius: 5,
          backgroundColor: "white",
          boxShadow: 1,
        }}
      >
        <Box textAlign="left">
          <Typography variant="body2" fontWeight={500} color="text.primary">
            {name || email}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({currentRole})
          </Typography>
        </Box>
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Typography
          variant="caption"
          sx={{ px: 2, pt: 1, fontWeight: 500, color: "text.secondary" }}
        >
          Change role:
        </Typography>
        {roles.map((role) => (
          <MenuItem
            key={role}
            onClick={() => handleRoleChange(role)}
            selected={role === currentRole}
            sx={{ fontWeight: role === currentRole ? 600 : 400 }}
          >
            {role}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
