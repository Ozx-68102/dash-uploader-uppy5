import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {ClearOperation} from "../types/Uploader";

export const useHandleClearTrigger = (
  uppy: Uppy,
  clearTrigger?: number,
  onClearResult?: (result: ClearOperation) => void
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
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown Error";
      onClearResultRef.current?.({
        status: "error",
        errorMessage,
      });
    }
  }, [clearTrigger, uppy]);
};
