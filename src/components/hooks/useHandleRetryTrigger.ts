import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {OperationResult} from "../types/Uploader";

export const useHandleRetryTrigger = (
  uppy: Uppy,
  retryTrigger?: number,
  onRetryResult?: (result: OperationResult) => void
) => {
  const onRetryResultRef = useRef(onRetryResult);
  onRetryResultRef.current = onRetryResult;

  useEffect(() => {
    if (retryTrigger === undefined || retryTrigger === null) return;

    try {
      uppy.retryAll()
        .then(() => {
          onRetryResultRef.current?.({
            status: "success",
            errorMessage: null,
            attempt: retryTrigger,
          });
        })
        .catch((error) => {
          const errorMessage = error instanceof Error ? error.message : "Unknown Retry Error";
          onRetryResultRef.current?.({
            status: "error",
            errorMessage,
            attempt: retryTrigger,
          });
        });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown Error";
      onRetryResultRef.current?.({
        status: "error",
        errorMessage,
        attempt: retryTrigger,
      });
    }
  }, [retryTrigger, uppy]);
};