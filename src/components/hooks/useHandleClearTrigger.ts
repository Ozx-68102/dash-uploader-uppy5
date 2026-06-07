import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {TriggerStatus} from "../types/Uploader";

export const useHandleClearTrigger = (
  uppy: Uppy,
  clearTrigger?: number,
  onClearStatus?: (status: TriggerStatus) => void
) => {
  const onClearStatusRef = useRef(onClearStatus);
  onClearStatusRef.current = onClearStatus;

  useEffect(() => {
    if (clearTrigger === undefined || clearTrigger === null) return;

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
  }, [clearTrigger, uppy]);
};
