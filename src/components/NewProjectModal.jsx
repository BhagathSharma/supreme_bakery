"use client";

import { useState } from "react";
import { useCreateProject } from "@/hooks/useCreateProject";
import { Dialog } from "@headlessui/react";
import { Plus, Loader2 } from "lucide-react";

export function NewProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { mutate, isPending } = useCreateProject();

  function handleSubmit(e) {
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
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-xl shadow"
      >
        <Plus size={18} />
        Create Project
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        {/* Background Overlay */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 border border-gray-200">
            <Dialog.Title className="text-2xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
              🚀 New Project
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="Plan Pilot"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 placeholder:text-gray-700 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Managing myself using myself"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 placeholder:text-gray-700 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-sm rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 disabled:opacity-70"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
