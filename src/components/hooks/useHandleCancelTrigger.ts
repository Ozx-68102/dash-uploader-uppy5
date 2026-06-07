import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {TriggerStatus} from "../types/Uploader";

export const useHandleCancelTrigger = (
  uppy: Uppy,
  cancelTrigger?: number,
  onCancelStatus?: (status: TriggerStatus) => void
) => {
  const onCancelStatusRef = useRef(onCancelStatus);
  onCancelStatusRef.current = onCancelStatus;

  useEffect(() => {
    if (cancelTrigger === undefined || cancelTrigger === null) return;

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
  }, [cancelTrigger, uppy]);
};