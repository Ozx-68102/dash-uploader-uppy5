import React, { useEffect, useMemo } from 'react';
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import ProgressBarPlugin from "@uppy/progress-bar";
// import { UppyContextProvider, Dropzone, UploadButton } from "@uppy/react";
import { DashComponentProps } from '../props';

import '@uppy/react/css/style.css';

type Props = {
  /**
   * Target url for dash endpoint
   */
  uploadUrl?: string,

  /**
   * Max file size (bite)
   */
  maxFileSize?: number,

  /**
   * Allowed file types, such as ['image/*', 'application/pdf']
   */
  allowedFileTypes?: string[],


  /**
   * Max number of files
   */
  maxNumberOfFiles?: number,

  /**
   * Files that success to upload
   */
  successFiles?: Array<{
    id: string,
    name: string,
    size: number,
    type: string
  }>,

  /**
   * Files that failed to upload
   */
  failedFiles?: Array<{
    id: string,
    name: string,
    size: number,
    error?: string
  }>,

  /**
   * Whether files are uploading
   */
  isUploading?: boolean

} & DashComponentProps;

/**
 * Component description
 */
const DashUploaderUppy5 = (props: Props) => {
  const { id, uploadUrl = '/upload', maxFileSize, allowedFileTypes, maxNumberOfFiles, setProps } = props;

  const uppy = useMemo(() => {
    const uppyInstance = new Uppy({
      restrictions: {
        maxFileSize: maxFileSize,
        allowedFileTypes: allowedFileTypes,
        maxNumberOfFiles: maxNumberOfFiles,
      },
      autoProceed: false,
    });

    // configure XHR Upload Plugin
    uppyInstance.use(XHRUpload, {
      endpoint: uploadUrl,
      method: 'post',
      fieldName: 'file',
      formData: true,
    });

    // configure Progress Bar Plugin
    uppyInstance.use(ProgressBarPlugin, {
      hideAfterFinish: true,
    });


    uppyInstance.on('upload', () => {
      if (setProps) {
        setProps({ isUploading: true });
      }
    });

    uppyInstance.on('complete', (result: any) => {
      const successful = result.successful.map((f: any) => ({
        id: f.id,
        name: f.name || 'unknown',
        size: f.size || 0,
        type: f.type || '',
      }));

      const failed = result.failed.map((f: any) => ({
        id: f.id,
        name: f.name || 'unknown',
        size: f.size || 0,
        error: f.error?.message || 'Upload failed',
      }));

      if (setProps) {
        setProps({
          successFiles: successful,
          failedFiles: failed,
          isUploading: false,
        });
      }
    });

    return uppyInstance;
  }, [uploadUrl, maxFileSize, allowedFileTypes, maxNumberOfFiles, setProps]);

  useEffect(() => {
    return () => {
      // Cleanup uppy instance on unmount
      if (uppy) {
        uppy.cancelAll();
      }
    }
  }, [uppy]);

  return (
    <div id={id}>
      Welcome to Dash + Uppy5
    </div>
  )
}

export default DashUploaderUppy5;
