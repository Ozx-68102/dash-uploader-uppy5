import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {OperationResult} from "../types/Uploader";

export const useHandleClearTrigger = (
  uppy: Uppy,
  clearTrigger?: number,
  onClearResult?: (result: OperationResult) => void
) => {
  const onClearResultRef = useRef(onClearResult);
  onClearResultRef.current = onClearResult;

  useEffect(() => {
    if (clearTrigger === undefined || clearTrigger === null) return;

    try {
      uppy.clear();
      onClearResultRef.current?.({
        status: "success",
        errorMessage: null,
        attempt: clearTrigger,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown Error";
      onClearResultRef.current?.({
        status: "error",
        errorMessage,
        attempt: clearTrigger,
      });
    }
  }, [clearTrigger, uppy]);
};
