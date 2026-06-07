import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {TriggerStatus} from "../types/Uploader";

export const useHandleClearTrigger = (
  uppy: Uppy,
  clearTrigger?: number,
  clearStatus?: TriggerStatus,
  onClearStatus?: (status: TriggerStatus) => void
) => {
  const onClearStatusRef = useRef(onClearStatus);
  onClearStatusRef.current = onClearStatus;
  const lastHandledTriggerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (clearTrigger === undefined || clearTrigger === null || clearTrigger === 0) return;
    if (lastHandledTriggerRef.current === clearTrigger || clearStatus?.attempt === clearTrigger) {
      lastHandledTriggerRef.current = clearTrigger;
      return;
    }
    lastHandledTriggerRef.current = clearTrigger;

    try {
      uppy.clear();
      onClearStatusRef.current?.({
        status: "success",
        errorMessage: null,
        attempt: clearTrigger,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown Error";
      onClearStatusRef.current?.({
        status: "error",
        errorMessage,
        attempt: clearTrigger,
      });
    }
  }, [clearTrigger, clearStatus?.attempt, uppy]);
};
