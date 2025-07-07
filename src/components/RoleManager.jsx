"use client";

import { useUpdateProject } from "@/hooks/useUpdateProject";
import { useState } from "react";

export function RoleManager({ userId, name, email, currentRole, projectId }) {
  const [open, setOpen] = useState(false);
  const { mutate: updateProject } = useUpdateProject(projectId);

  const roles = ["PM", "CONTRIBUTOR", "VIEWER"];

  const handleRoleChange = (role) => {
    updateProject({
      updateMembers: [{ userId, role }],
    });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="bg-white border px-3 py-2 rounded-full flex items-center gap-2 shadow-sm hover:ring-1 hover:ring-indigo-300 transition"
      >
        <span className="text-gray-800 font-medium">{name || email}</span>
        <span className="text-xs text-gray-500">({currentRole})</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-48 bg-white border shadow-lg rounded-lg p-2">
          <p className="text-sm font-semibold text-gray-600 px-2 mb-1">
            Change role:
          </p>
          <ul className="space-y-1">
            {roles.map((r) => (
              <li key={r}>
                <button
                  onClick={() => handleRoleChange(r)}
                  className={`w-full text-left px-3 py-1 rounded hover:bg-indigo-50 text-sm ${
                    r === currentRole
                      ? "font-bold text-indigo-600"
                      : "text-gray-700"
                  }`}
                >
                  {r}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
