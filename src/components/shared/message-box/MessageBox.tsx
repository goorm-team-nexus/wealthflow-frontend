"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[340px] rounded-2xl p-6 gap-0 border-none shadow-2xl">
        <div className="flex flex-col items-center text-center">
          {title && (
            <DialogHeader className="mb-2">
              <DialogTitle className="text-lg font-bold text-gray-900">{title}</DialogTitle>
            </DialogHeader>
          )}
          <DialogDescription className="text-[15px] leading-relaxed text-gray-600 whitespace-pre-wrap">
            {message}
          </DialogDescription>
        </div>

        <DialogFooter
          className={`mt-8 flex gap-2 sm:justify-center ${
            type === "confirm" ? "flex-row" : "flex-col"
          }`}
        >
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
