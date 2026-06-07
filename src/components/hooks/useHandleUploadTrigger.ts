import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {OperationResult} from "../types/Uploader";

export const useHandleUploadTrigger = (
  uppy: Uppy,
  uploadTrigger?: number,
  autoProceed?: boolean,
  onUploadResult?: (result: OperationResult) => void
) => {
  const onUploadResultRef = useRef(onUploadResult);
  onUploadResultRef.current = onUploadResult;

  useEffect(() => {
    if (uploadTrigger === undefined || uploadTrigger === null) return;

    // Defense: only allow manual trigger when autoProceed is false
    if (autoProceed) {
      onUploadResultRef.current?.({
        status: "error",
        errorMessage: "Cannot use uploadTrigger when autoProceed is true. Uploads start automatically when files are added.",
        attempt: uploadTrigger,
      });
      return;
    }

    // Defense: require at least one file before triggering upload
    if (uppy.getFiles().length === 0) {
      onUploadResultRef.current?.({
        status: "error",
        errorMessage: "No files to upload.",
        attempt: uploadTrigger,
      });
      return;
    }

    try {
      uppy.upload()
        .then(() => {
          onUploadResultRef.current?.({
            status: "success",
            errorMessage: null,
            attempt: uploadTrigger,
          });
        })
        .catch((error) => {
          const errorMessage = error instanceof Error ? error.message : "Unknown upload error";
          onUploadResultRef.current?.({
            status: "error",
            errorMessage,
            attempt: uploadTrigger,
          });
        });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown Error";
      onUploadResultRef.current?.({
        status: "error",
        errorMessage,
        attempt: uploadTrigger,
      });
    }
  }, [uploadTrigger, uppy, autoProceed]);
};