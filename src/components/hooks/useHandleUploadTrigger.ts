import {useEffect, useRef} from "react";
import Uppy from "@uppy/core";
import {TriggerStatus} from "../types/Uploader";

export const useHandleUploadTrigger = (
  uppy: Uppy,
  uploadTrigger?: number,
  uploadStatus?: TriggerStatus,
  autoProceed?: boolean,
  onUploadStatus?: (status: TriggerStatus) => void
) => {
  const onUploadStatusRef = useRef(onUploadStatus);
  onUploadStatusRef.current = onUploadStatus;
  const lastHandledTriggerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (uploadTrigger === undefined || uploadTrigger === null || uploadTrigger === 0) return;
    if (lastHandledTriggerRef.current === uploadTrigger || uploadStatus?.attempt === uploadTrigger) {
      lastHandledTriggerRef.current = uploadTrigger;
      return;
    }
    lastHandledTriggerRef.current = uploadTrigger;

    // Defense: only allow manual trigger when autoProceed is false
    if (autoProceed) {
      onUploadStatusRef.current?.({
        status: "error",
        errorMessage: "Cannot use uploadTrigger when auto_proceed is True. Uploads start automatically when files are added.",
        attempt: uploadTrigger,
      });
      return;
    }

    // Defense: require at least one file before triggering upload
    if (uppy.getFiles().length === 0) {
      onUploadStatusRef.current?.({
        status: "error",
        errorMessage: "No files to upload.",
        attempt: uploadTrigger,
      });
      return;
    }

    try {
      uppy.upload()
        .then(() => {
          onUploadStatusRef.current?.({
            status: "success",
            errorMessage: null,
            attempt: uploadTrigger,
          });
        })
        .catch((error) => {
          const errorMessage = error instanceof Error ? error.message : "Unknown Upload Error";
          onUploadStatusRef.current?.({
            status: "error",
            errorMessage,
            attempt: uploadTrigger,
          });
        });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown Error";
      onUploadStatusRef.current?.({
        status: "error",
        errorMessage,
        attempt: uploadTrigger,
      });
    }
  }, [uploadTrigger, uploadStatus?.attempt, uppy, autoProceed]);
};
