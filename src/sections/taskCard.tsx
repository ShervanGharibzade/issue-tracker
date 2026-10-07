import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@/components/Avatar";
import type { Task } from "@/types";

const MAX_VISIBLE_ASSIGNEES = 3;

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  isOverlay?: boolean;
}

/** Purely presentational task card (also used for the drag overlay). */
export default function TaskCard({
  task,
  onEdit,
  onDelete,
  isOverlay = false,
}: TaskCardProps) {
  const visible = task.assignees.slice(0, MAX_VISIBLE_ASSIGNEES);
  const hidden = task.assignees.length - visible.length;

  return (
    <div
      className={`group rounded-lg border bg-zinc-800 p-3 transition-colors ${
        isOverlay
          ? "rotate-2 cursor-grabbing border-purple-500 shadow-2xl shadow-purple-900/50"
          : "cursor-grab border-zinc-700/60 shadow-sm hover:border-zinc-500"
      }`}
    >
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm leading-snug text-zinc-100">
          {task.description}
        </p>
        {!isOverlay && (
          <div className="-mr-1 -mt-1 flex shrink-0 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
            <button
              type="button"
              className="icon-btn h-7 w-7"
              aria-label={`Edit task: ${task.description}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.();
              }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </button>
            <button
              type="button"
              className="icon-btn h-7 w-7 hover:text-red-400"
              aria-label={`Delete task: ${task.description}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.();
              }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        )}
      </div>

      {task.assignees.length > 0 && (
        <div className="mt-3 flex items-center -space-x-1.5">
          {visible.map((name) => (
            <Avatar
              key={name}
              name={name}
              size="sm"
              className="ring-2 ring-zinc-800"
            />
          ))}
          {hidden > 0 && (
            <span
              title={task.assignees.slice(MAX_VISIBLE_ASSIGNEES).join(", ")}
              className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-zinc-600 px-1 text-[10px] font-bold text-white ring-2 ring-zinc-800"
            >
              +{hidden}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
