"use client";

import { useId, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useAppDispatch } from "@/redux/hooks";
import { editTask } from "@/redux/slices/userSlice";
import type { Task } from "@/types";

const MAX_DESCRIPTION = 280;

interface EditTaskProps {
  task: Task;
  onClose: () => void;
}

/** Mount only while open, so the draft always starts from the saved task. */
export default function EditTask({ task, onClose }: EditTaskProps) {
  const dispatch = useAppDispatch();
  const formId = useId();
  const [description, setDescription] = useState(task.description);
  const [assignees, setAssignees] = useState<string[]>(task.assignees);
  const [pendingUser, setPendingUser] = useState("");

  const isValid = description.trim().length > 0;

  function addPendingUser(current: string[]): string[] {
    const name = pendingUser.trim();
    if (!name) return current;
    if (current.some((a) => a.toLowerCase() === name.toLowerCase())) {
      return current;
    }
    return [...current, name];
  }

  function handleAddUser() {
    setAssignees((current) => addPendingUser(current));
    setPendingUser("");
  }

  function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault();
    if (!isValid) return;
    dispatch(
      editTask({
        id: task.id,
        description,
        // Include a name that was typed but not confirmed with Enter yet.
        assignees: addPendingUser(assignees),
      })
    );
    onClose();
  }

  return (
    <Modal
      open
      title="Task details"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={!isValid}>
            Save changes
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor={`${formId}-description`}
            className="text-sm font-semibold text-zinc-200"
          >
            Description
          </label>
          <textarea
            id={`${formId}-description`}
            data-autofocus
            rows={4}
            maxLength={MAX_DESCRIPTION}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                handleSubmit();
              }
            }}
            aria-invalid={!isValid}
            className="field resize-none"
          />
          <div className="flex justify-between text-xs text-zinc-500">
            <span className={isValid ? "" : "text-red-400"}>
              {isValid ? "Ctrl/⌘ + Enter to save" : "Description is required"}
            </span>
            <span>
              {description.length}/{MAX_DESCRIPTION}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${formId}-assignee`}
            className="text-sm font-semibold text-zinc-200"
          >
            Assigned to
          </label>
          {assignees.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {assignees.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-full bg-zinc-800 py-1 pl-1 pr-2 text-sm"
                >
                  <Avatar name={name} size="sm" />
                  {name}
                  <button
                    type="button"
                    onClick={() =>
                      setAssignees((current) =>
                        current.filter((a) => a !== name)
                      )
                    }
                    aria-label={`Remove ${name}`}
                    className="rounded-full text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">Not assigned to anyone.</p>
          )}
          <div className="flex gap-2">
            <input
              id={`${formId}-assignee`}
              value={pendingUser}
              maxLength={30}
              placeholder="Add a person and press Enter"
              onChange={(event) => setPendingUser(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  handleAddUser();
                }
              }}
              className="field"
            />
            <Button
              variant="secondary"
              onClick={handleAddUser}
              disabled={!pendingUser.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
