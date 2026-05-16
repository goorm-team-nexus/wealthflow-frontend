"use client";

import React from "react";
import { Button } from "@/components/ui/button";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div className="relative w-full max-w-[340px] transform overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          {title && <h3 className="mb-2 text-lg font-semibold">{title}</h3>}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
        </div>

        <div className={`mt-8 flex gap-2 ${type === "confirm" ? "flex-row" : "flex-col"}`}>
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
      </div>
    </div>
  );
}
