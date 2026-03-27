import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import "./inline-edit.css";

interface InlineEditProps<T = string> {
  defaultValue: T;
  readView: (value: T) => React.ReactNode;
  editView: (
    fieldProps: {
      value: T;
      onChange: (value: T) => void;
      autoFocus: boolean;
    },
    ref: React.Ref<HTMLElement>,
  ) => React.ReactNode;
  onConfirm: (value: T) => void;
  validate?: (value: T) => string | undefined;
  startWithEditViewOpen?: boolean;
  keepEditViewOpenOnBlur?: boolean;
  hideActionButtons?: boolean;
  readViewFitContainerWidth?: boolean;
  className?: string;
}

function InlineEdit<T = string>({
  defaultValue,
  readView,
  editView,
  onConfirm,
  validate,
  startWithEditViewOpen = false,
  keepEditViewOpenOnBlur = false,
  hideActionButtons = false,
  readViewFitContainerWidth = false,
  className,
}: InlineEditProps<T>) {
  const [isEditing, setIsEditing] = React.useState(startWithEditViewOpen);
  const [editValue, setEditValue] = React.useState<T>(defaultValue);
  const [error, setError] = React.useState<string | undefined>();
  const editRef = React.useRef<HTMLElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setEditValue(defaultValue);
  }, [defaultValue]);

  const handleConfirm = React.useCallback(() => {
    if (validate) {
      const validationError = validate(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    setError(undefined);
    setIsEditing(false);
    onConfirm(editValue);
  }, [editValue, onConfirm, validate]);

  const handleCancel = React.useCallback(() => {
    setError(undefined);
    setIsEditing(false);
    setEditValue(defaultValue);
  }, [defaultValue]);

  const handleReadViewClick = React.useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleConfirm, handleCancel],
  );

  const handleBlur = React.useCallback(
    (e: React.FocusEvent) => {
      if (keepEditViewOpenOnBlur) return;
      const container = containerRef.current;
      if (container && !container.contains(e.relatedTarget as Node)) {
        handleConfirm();
      }
    },
    [keepEditViewOpenOnBlur, handleConfirm],
  );

  if (!isEditing) {
    return (
      <div
        data-slot="inline-edit"
        data-state="read"
        data-fit={readViewFitContainerWidth || undefined}
        className={cn(className)}
        onClick={handleReadViewClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleReadViewClick();
          }
        }}
      >
        <div data-slot="inline-edit-read">{readView(defaultValue)}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-slot="inline-edit"
      data-state="edit"
      data-fit={readViewFitContainerWidth || undefined}
      className={cn(className)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <div data-slot="inline-edit-field">
        {editView(
          {
            value: editValue,
            onChange: (val) => {
              setEditValue(val);
              if (error) setError(undefined);
            },
            autoFocus: true,
          },
          editRef,
        )}
      </div>
      {error && <div data-slot="inline-edit-error">{error}</div>}
      {!hideActionButtons && (
        <div data-slot="inline-edit-buttons">
          <button
            data-slot="inline-edit-confirm"
            type="button"
            onClick={handleConfirm}
            tabIndex={0}
          >
            <Check className="size-3.5" />
          </button>
          <button
            data-slot="inline-edit-cancel"
            type="button"
            onClick={handleCancel}
            tabIndex={0}
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export { InlineEdit, type InlineEditProps };
