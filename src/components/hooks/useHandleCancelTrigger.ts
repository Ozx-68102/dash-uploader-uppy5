import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {TriggerStatus} from "../types/Uploader";

export const useHandleCancelTrigger = (
  uppy: Uppy,
  cancelTrigger?: number,
  cancelStatus?: TriggerStatus,
  onCancelStatus?: (status: TriggerStatus) => void
) => {
  const onCancelStatusRef = useRef(onCancelStatus);
  onCancelStatusRef.current = onCancelStatus;
  const lastHandledTriggerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (cancelTrigger === undefined || cancelTrigger === null || cancelTrigger === 0) return;
    if (lastHandledTriggerRef.current === cancelTrigger || cancelStatus?.attempt === cancelTrigger) {
      lastHandledTriggerRef.current = cancelTrigger;
      return;
    }
    lastHandledTriggerRef.current = cancelTrigger;

    try {
      uppy.cancelAll();
      onCancelStatusRef.current?.({
        status: "success",
        errorMessage: null,
        attempt: cancelTrigger,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown Error";
      onCancelStatusRef.current?.({
        status: "error",
        errorMessage,
        attempt: cancelTrigger,
      });
    }
  }, [cancelTrigger, cancelStatus?.attempt, uppy]);
};