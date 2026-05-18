"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MessageBoxProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "alert" | "confirm";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function MessageBox({
  isOpen,
  onClose,
  title,
  message,
  type = "alert",
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: MessageBoxProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-[340px]" showCloseButton={false}>
        <DialogHeader className="items-center text-center">
          {title ? (
            <DialogTitle>{title}</DialogTitle>
          ) : (
            <DialogTitle className="sr-only">알림</DialogTitle>
          )}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
        </DialogHeader>

        <div className={`flex gap-2 ${type === "confirm" ? "flex-row" : "flex-col"}`}>
          {type === "confirm" && (
            <Button
              variant="outline"
              className="flex-1 font-semibold"
              onClick={() => {
                onCancel?.();
                onClose();
              }}
            >
              {cancelText}
            </Button>
          )}
          <Button
            className="flex-1 font-semibold"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
