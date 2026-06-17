import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {TriggerStatus} from "../types/Uploader";

export const useHandleRetryTrigger = (
  uppy: Uppy,
  retryTrigger?: number,
  retryStatus?: TriggerStatus,
  autoClearOnComplete?: boolean,
  onRetryStatus?: (status: TriggerStatus) => void
) => {
  const onRetryStatusRef = useRef(onRetryStatus);
  onRetryStatusRef.current = onRetryStatus;
  const lastHandledTriggerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (retryTrigger === undefined || retryTrigger === null || retryTrigger === 0) return;
    if (lastHandledTriggerRef.current === retryTrigger || retryStatus?.attempt === retryTrigger) {
      lastHandledTriggerRef.current = retryTrigger;
      return;
    }
    lastHandledTriggerRef.current = retryTrigger;

    if (autoClearOnComplete) {
      onRetryStatusRef.current?.({
        status: "error",
        errorMessage: "Cannot use retryTrigger when auto_clear_on_complete is True. Failed files are cleared on complete.",
        attempt: retryTrigger,
      });
      return;
    }

    try {
      // Fire-and-forget: void = don't await; `.catch` (not `.then`) only guards against unhandled rejection.
      // Retry outcomes are reported via uploadedFiles/failedFiles on the complete event.
      void uppy.retryAll().catch(() => {
      });
      onRetryStatusRef.current?.({
        status: "success",
        errorMessage: null,
        attempt: retryTrigger,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown Error";
      onRetryStatusRef.current?.({
        status: "error",
        errorMessage,
        attempt: retryTrigger,
      });
    }
  }, [retryTrigger, retryStatus?.attempt, uppy, autoClearOnComplete]);
};