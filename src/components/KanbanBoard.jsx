"use client";

import ColumnCard from "./ColumnCard";
import { Grid } from "@mui/material";
import TaskFormModal from "./TaskFormModal";
import { useState } from "react";
import { useCreateTask } from "@/hooks/useCreateTask";
import { useDeleteTask } from "@/hooks/useDeleteTask";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { useUpdateTaskPosition } from "@/hooks/useUpdateTaskPosition";

export default function KanbanBoard({
  columns,
  onRenameColumn,
  onDeleteColumn,
  projectId,
}) {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskMode, setTaskMode] = useState("create");
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [currentColumnId, setCurrentColumnId] = useState(null);

  const createTask = useCreateTask(projectId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);
  const updateTaskPos = useUpdateTaskPosition(projectId);

  const onMoveTask = (direction, currentColumnId, taskIndex) => {
    const colIndex = columns.findIndex((c) => c.id === currentColumnId);
    const column = columns[colIndex];
    const task = column.tasks[taskIndex];

    let targetColumnId = currentColumnId;
    let targetIndex = taskIndex;

    if (direction === "up" && taskIndex > 0) {
      targetIndex -= 1;
    } else if (direction === "down" && taskIndex < column.tasks.length - 1) {
      targetIndex += 1;
    } else if (direction === "left" && colIndex > 0) {
      targetColumnId = columns[colIndex - 1].id;
      targetIndex = columns[colIndex - 1].tasks.length;
    } else if (direction === "right" && colIndex < columns.length - 1) {
      targetColumnId = columns[colIndex + 1].id;
      targetIndex = columns[colIndex + 1].tasks.length;
    } else {
      return;
    }

    updateTaskPos.mutate({
      taskId: task.id,
      columnId: targetColumnId,
      order: targetIndex,
    });
  };

  const handleCreateTask = (columnId) => {
    setTaskMode("create");
    setCurrentColumnId(columnId);
    setTaskToEdit(null);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setTaskMode("edit");
    setTaskToEdit(task);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = (data) => {
    if (taskMode === "edit" && taskToEdit?.id) {
      updateTask.mutate({ taskId: taskToEdit.id, ...data });
    } else {
      createTask.mutate({ ...data, columnId: currentColumnId, projectId });
    }
    setTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeleteTask = (taskId) => {
    deleteTask.mutate({ taskId });
  };

  return (
    <>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {columns.map((column, colIndex) => (
          <Grid item xs={12} sm={6} lg={3} key={column.id}>
            <ColumnCard
              column={column}
              onRename={onRenameColumn}
              onDelete={onDeleteColumn}
              projectId={projectId}
              onOpenTaskModal={handleCreateTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onMoveTask={onMoveTask}
              columnIndex={colIndex}
              totalColumns={columns.length}
            />
          </Grid>
        ))}
      </Grid>

      <TaskFormModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        mode={taskMode}
        initialData={taskToEdit}
      />
    </>
  );
}
