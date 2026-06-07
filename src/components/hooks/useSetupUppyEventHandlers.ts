import {useUppyEvent} from "@uppy/react";
import Uppy from "@uppy/core";

export const useSetupUppyEventHandlers = (
  uppy: Uppy,
  props: {
    uploadId?: string;
    setProps?: (props: Record<string, any>) => void;
    autoClearOnComplete?: boolean;
  }
) => {
  useUppyEvent(uppy, 'upload', () => {
    if (!props.setProps) return;

    props.setProps({isUploading: true});
  });

  useUppyEvent(uppy, 'complete', (result) => {
    if (!props.setProps) return;

    const uploadedFiles = result.successful?.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      upload_id: props.uploadId || '',
      response: {
        status: f.response?.status || 200,
        filename: f.response?.body?.filename || f.name
      }
    }));

    const failedFiles = result.failed?.map(f => ({
      name: f.name,
      error: f.error || 'Unknown error'
    }));

    props.setProps({
      uploadedFiles,
      failedFiles,
      isUploading: false,
    });

    // Auto-clear files after successful upload if enabled
    if (props.autoClearOnComplete && result.successful && result.successful.length > 0) uppy.clear();
  });
};