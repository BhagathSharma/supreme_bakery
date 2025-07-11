import {
  Card,
  Typography,
  Box,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import dayjs from "dayjs";

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  disableUp = false,
  disableDown = false,
  disableLeft = false,
  disableRight = false,
}) {
  const dueDateFormatted = task.dueDate
    ? dayjs(task.dueDate).format("MMM D, YYYY")
    : null;

  const assigneeLabel = task.assignee?.name || task.assignee?.email || null;

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 2, position: "relative" }}>
        <Stack direction="row" justifyContent="space-between">
          <Box
            onClick={() => onEdit?.(task)}
            sx={{ flexGrow: 1, cursor: "pointer" }}
          >
            <Typography fontWeight={600}>{task.title}</Typography>

            {task.description && (
              <Typography variant="body2" color="text.secondary">
                {task.description}
              </Typography>
            )}

            {/* Due Date and Assignee */}
            {(dueDateFormatted || assigneeLabel) && (
              <Stack direction="row" spacing={2} mt={0.5}>
                {dueDateFormatted && (
                  <Typography variant="caption" color="text.secondary">
                    📅 {dueDateFormatted}
                  </Typography>
                )}
                {assigneeLabel && (
                  <Typography variant="caption" color="text.secondary">
                    👤 {assigneeLabel}
                  </Typography>
                )}
              </Stack>
            )}
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Move Left">
              <span>
                <IconButton
                  size="small"
                  onClick={() => onMoveLeft?.(task)}
                  disabled={disableLeft}
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Move Right">
              <span>
                <IconButton
                  size="small"
                  onClick={() => onMoveRight?.(task)}
                  disabled={disableRight}
                >
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Move Up">
              <span>
                <IconButton
                  size="small"
                  onClick={() => onMoveUp?.(task)}
                  disabled={disableUp}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Move Down">
              <span>
                <IconButton
                  size="small"
                  onClick={() => onMoveDown?.(task)}
                  disabled={disableDown}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <IconButton size="small" onClick={() => onEdit?.(task)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete?.(task.id)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
