import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {TriggerStatus} from "../types/Uploader";

export const useHandleRetryTrigger = (
  uppy: Uppy,
  retryTrigger?: number,
  autoClearOnComplete?: boolean,
  onRetryStatus?: (status: TriggerStatus) => void
) => {
  const onRetryStatusRef = useRef(onRetryStatus);
  onRetryStatusRef.current = onRetryStatus;

  useEffect(() => {
    if (retryTrigger === undefined || retryTrigger === null) return;

    if (autoClearOnComplete) {
      onRetryStatusRef.current?.({
        status: "error",
        errorMessage: "Cannot use retryTrigger when auto_clear_on_complete is True. Failed files are cleared on complete.",
        attempt: retryTrigger,
      });
      return;
    }

    try {
      uppy.retryAll()
        .then(() => {
          onRetryStatusRef.current?.({
            status: "success",
            errorMessage: null,
            attempt: retryTrigger,
          });
        })
        .catch((error) => {
          const errorMessage = error instanceof Error ? error.message : "Unknown Retry Error";
          onRetryStatusRef.current?.({
            status: "error",
            errorMessage,
            attempt: retryTrigger,
          });
        });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown Error";
      onRetryStatusRef.current?.({
        status: "error",
        errorMessage,
        attempt: retryTrigger,
      });
    }
  }, [retryTrigger, uppy, autoClearOnComplete]);
};