"use client";

import { useUpdateProject } from "@/hooks/useUpdateProject";
import { useUserSearch } from "@/hooks/useUserSearch";
import { useState } from "react";
import { MoreHorizontal, Trash2, UserPlus2 } from "lucide-react";
import { toast } from "sonner";

export function MemberManager({ members, projectId, currentUserId }) {
  const [openId, setOpenId] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("CONTRIBUTOR");

  const { data: users, isLoading: searching } = useUserSearch(search);
  const { mutate: updateProject } = useUpdateProject(projectId);

  const roles = ["PM", "CONTRIBUTOR", "VIEWER"];
  const currentUser = members.find((m) => m.user.id === currentUserId);
  const isPM = currentUser?.role === "PM";

  const handleRoleChange = (userId, role) => {
    updateProject({ updateMembers: [{ userId, role }] });
    setOpenId(null);
    toast.success("Role updated");
  };

  const handleRemove = (userId) => {
    updateProject({ removeMembers: [userId] });
    setOpenId(null);
    toast.success("Member removed");
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
    <div className="flex flex-wrap gap-3">
      {members.map((m) => {
        const isSelf = m.user.id === currentUserId;
        const canManage = isPM && !isSelf && m.role !== "PM";

        return (
          <div
            key={m.user.id}
            className="relative bg-white border px-3 py-2 rounded-full flex items-center gap-2 shadow-sm"
          >
            <div className="flex flex-col text-sm">
              <span className="text-gray-800 font-medium">
                {m.user.name || m.user.email}
              </span>
              <span className="text-xs text-gray-500">{m.role}</span>
            </div>

            {canManage && (
              <button
                onClick={() =>
                  setOpenId((prev) => (prev === m.user.id ? null : m.user.id))
                }
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </button>
            )}

            {openId === m.user.id && canManage && (
              <div className="absolute top-10 right-0 z-50 w-48 bg-white border rounded shadow-lg p-2">
                <p className="text-xs text-gray-500 px-2 mb-2">Change Role:</p>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(m.user.id, r)}
                    className={`block w-full text-left px-3 py-1 text-sm rounded hover:bg-indigo-50 ${
                      r === m.role
                        ? "text-indigo-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
                <div className="border-t mt-2 pt-2">
                  <button
                    onClick={() => handleRemove(m.user.id)}
                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-3 py-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Member
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {isPM && (
        <div className="relative">
          <button
            onClick={() => setInviteOpen((v) => !v)}
            className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm rounded-full flex items-center gap-1"
          >
            <UserPlus2 className="w-4 h-4" />
            Add Member
          </button>

          {inviteOpen && (
            <div className="absolute z-50 mt-2 w-80 bg-white border shadow-lg rounded-lg p-4 text-gray-800">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email"
                className="w-full border px-3 py-2 rounded-md text-sm text-gray-800 bg-white"
              />

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full mt-2 border px-3 py-2 rounded-md text-sm text-gray-800 bg-white"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {searching && (
                <p className="text-xs text-gray-400 mt-2">Searching...</p>
              )}

              <ul className="mt-2 space-y-2 max-h-52 overflow-y-auto">
                {users?.map((user) => {
                  const alreadyAdded = members.some(
                    (m) => m.user.id === user.id
                  );

                  return (
                    <li
                      key={user.id}
                      onClick={() => {
                        if (!alreadyAdded) handleInvite(user.id);
                      }}
                      className={`cursor-pointer px-3 py-2 rounded-md border text-sm ${
                        alreadyAdded
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "hover:bg-indigo-50 text-gray-800"
                      }`}
                    >
                      <p className="font-medium">{user.name || user.email}</p>
                      <p className="text-xs text-gray-500">
                        {alreadyAdded ? "Already a member" : user.email}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
