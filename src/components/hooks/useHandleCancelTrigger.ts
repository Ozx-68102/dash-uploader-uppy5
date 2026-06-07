import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {OperationResult} from "../types/Uploader";

export const useHandleCancelTrigger = (
  uppy: Uppy,
  cancelTrigger?: number,
  onCancelResult?: (result: OperationResult) => void
) => {
  const onCancelResultRef = useRef(onCancelResult);
  onCancelResultRef.current = onCancelResult;

  useEffect(() => {
    if (cancelTrigger === undefined || cancelTrigger === null) return;

    try {
      uppy.cancelAll();
      onCancelResultRef.current?.({
        status: "success",
        errorMessage: null,
        attempt: cancelTrigger,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown Error";
      onCancelResultRef.current?.({
        status: "error",
        errorMessage,
        attempt: cancelTrigger,
      });
    }
  }, [cancelTrigger, uppy]);
};