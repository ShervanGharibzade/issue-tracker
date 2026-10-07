"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@/components/Button";
import InlineInput from "@/components/InlineInput";
import { useAppDispatch } from "@/redux/hooks";
import { addColumn } from "@/redux/slices/userSlice";

export default function AddColumn({ workSpaceId }: { workSpaceId: string }) {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);

  if (isAdding) {
    return (
      <div className="w-72 shrink-0 space-y-2 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
        <InlineInput
          ariaLabel="New column name"
          placeholder="Column name"
          onCommit={(title) => {
            dispatch(addColumn({ workSpaceId, title }));
            setIsAdding(false);
          }}
          onCancel={() => setIsAdding(false)}
        />
        <p className="text-xs text-zinc-500">
          Press Enter to add, Escape to cancel.
        </p>
      </div>
    );
  }

  return (
    <Button
      variant="secondary"
      onClick={() => setIsAdding(true)}
      className="h-11 w-72 shrink-0 justify-start border-dashed"
    >
      <AddIcon fontSize="small" />
      Add column
    </Button>
  );
}
