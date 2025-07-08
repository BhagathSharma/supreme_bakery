"use client";

import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { NewProjectModal } from "@/components/NewProjectModal";
import FullPageLoader from "@/components/FullPageLoader";
export default function DashboardPage() {
  const { data: projects, isLoading, error } = useProjects();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 sm:px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 text-sm mt-1">
              Your boards, your way. Collaborate with your team in real-time.
            </p>
          </div>

          <NewProjectModal />
        </div>

        {isLoading && <FullPageLoader />}
        {error && <div className="text-red-500">Error loading projects.</div>}
        {!isLoading && projects?.length === 0 && (
          <div className="text-gray-500 italic mt-12">
            You haven't created or joined any projects yet.
          </div>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {projects?.map((project) => (
            <li key={project.id}>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="block p-6 bg-white rounded-xl shadow hover:shadow-md border border-gray-200 hover:border-blue-400"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {project.name}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {project.description || "No description provided."}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
