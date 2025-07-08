"use client";

import { useParams } from "next/navigation";
import { useProjectDetails } from "@/hooks/useProjectDetails";
import { useDeleteProject } from "@/hooks/useDeleteProject";
import { useUpdateProject } from "@/hooks/useUpdateProject";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState } from "react";
import { Trash, Pencil } from "lucide-react";
import { MemberManager } from "@/components/MemberManager";
import FullPageLoader from "@/components/FullPageLoader";
export default function ProjectDetailPage() {
  const { projectId } = useParams();

  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useProjectDetails(projectId);
  const { mutate: deleteProject, isPending: deleting } =
    useDeleteProject(projectId);
  const { mutate: updateProject } = useUpdateProject(projectId);
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // First handle user loading
  if (userLoading) return <FullPageLoader />;
  if (userError || !user)
    return <p className="p-4 text-red-500">Failed to load user</p>;

  // Then handle project loading
  if (projectLoading) return <FullPageLoader />;
  if (projectError || !project)
    return <div className="p-6 text-red-500">Failed to load project.</div>;

  const handleUpdate = () => {
    updateProject({ name, description });
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            {editMode ? (
              <div className="space-y-2">
                <input
                  className="text-3xl font-bold text-gray-800 border border-gray-300 px-4 py-2 rounded-md w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <textarea
                  className="w-full border px-4 py-2 rounded-md text-gray-700"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
                <button
                  onClick={handleUpdate}
                  className="mt-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-gray-900">
                  {project.name}
                </h1>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setName(project.name || "");
                setDescription(project.description || "");
                setEditMode(true);
              }}
              className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-800 rounded-md shadow-sm flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={() => deleteProject()}
              className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md shadow-sm flex items-center gap-2"
            >
              <Trash className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Members */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Team Members
          </h2>
          <MemberManager
            members={project.members}
            projectId={projectId}
            currentUserId={user.id}
          />
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {project.columns.map((column) => (
            <div
              key={column.id}
              className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="p-3 bg-gray-50 hover:bg-gray-100 border rounded-md cursor-pointer shadow-sm"
                  >
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    {task.description && (
                      <p className="text-sm text-gray-600">
                        {task.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
