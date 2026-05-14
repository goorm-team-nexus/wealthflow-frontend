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
      <div className="relative w-full max-w-[340px] transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          {title && <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>}
          <p className="text-[15px] leading-relaxed text-gray-600 whitespace-pre-wrap">{message}</p>
        </div>

        <div className={`mt-8 flex gap-2 ${type === "confirm" ? "flex-row" : "flex-col"}`}>
          {type === "confirm" && (
            <Button
              variant="outline"
              className="flex-1 rounded-xl py-6 text-[15px] font-semibold border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100"
              onClick={() => {
                onCancel?.();
                onClose();
              }}
            >
              {cancelText}
            </Button>
          )}
          <Button
            className="flex-1 rounded-xl py-6 text-[15px] font-semibold bg-gray-900 text-white hover:bg-black"
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
