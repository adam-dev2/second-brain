import { AlertTriangle } from "lucide-react";

interface Props {
  onClose: () => void;
  onDeleteAll: () => void;
  onMoveAndDelete: () => void;
}

const DeleteConfirmation = ({onClose, onDeleteAll, onMoveAndDelete}: Props) => {


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* MODAL */}
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-xl
        bg-white dark:bg-neutral-900
        border border-black/10 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ICON + TITLE */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-100 dark:bg-red-500/10">
            <AlertTriangle className="text-red-500" size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Delete Section?
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              This action cannot be undone. Choose how you want to proceed.
            </p>
          </div>
        </div>

        {/* OPTIONS */}
        <div className="space-y-3 mt-5">
          {/* DELETE ALL */}
          <button
            onClick={onDeleteAll}
            className="w-full text-left p-4 rounded-xl border
            border-red-300 dark:border-red-500/30
            bg-red-50 dark:bg-red-500/10
            hover:bg-red-100 dark:hover:bg-red-500/20
            transition"
          >
            <p className="font-medium text-red-600 dark:text-red-400">
              Delete everything
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Permanently delete this section and all cards inside it.
            </p>
          </button>

          {/* SAFE OPTION */}
          <button
            onClick={onMoveAndDelete}
            className="w-full text-left p-4 rounded-xl border
            border-black/10 dark:border-white/10
            bg-neutral-50 dark:bg-neutral-800
            hover:bg-neutral-100 dark:hover:bg-neutral-700
            transition"
          >
            <p className="font-medium text-black dark:text-white">
              Move cards to Default
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Keep your cards safe by moving them, then delete this section.
            </p>
          </button>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg
            border border-black/10 dark:border-white/10
            hover:bg-neutral-100 dark:hover:bg-neutral-800
            transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;