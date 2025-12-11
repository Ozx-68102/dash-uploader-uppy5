import Uppy from '@uppy/core';
import {useUppyEvent} from "@uppy/react";
import Dashboard from '@uppy/react/dashboard';
import React, {useState} from 'react';
import Props from './types/Uploader';
import CreateUppyInstance from './utils/createUppy';

import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';

/**
 * A dash Component.
 */
const DashUploaderUppy5 = (props: Props) => {
  const [uppy] = useState<Uppy>(() => CreateUppyInstance(props));
  const correctTheme = () => {
        const isValidTheme = (value: string): value is "auto" | "dark" | "light" => {
          return ["auto", "dark", "light"].includes(value);
        };

        if (props.theme === undefined) return undefined;

        return isValidTheme(props.theme) ? props.theme : undefined;
  };

  const correctFileManagerSelectionType = () => {
    const isValidType = (value: string): value is "files" | "folders" | "both" => {
      return ["files", "folders", "both"].includes(value);
    };

    if (props.fileManagerSelectionType === undefined) return undefined;

    return isValidType(props.fileManagerSelectionType) ? props.fileManagerSelectionType : undefined;
  };

  useUppyEvent(uppy, 'complete', (result) => {
    if (!props.setProps) return;

    const uploadedFiles = result.successful?.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
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
      failedFiles
    });
  });

  return (
    <Dashboard
      id={props.id}
      uppy={uppy}

      disabled={props.disabled}
      theme={correctTheme()}
      note={props.note}

      width={props.size?.width}
      height={props.size?.height}

      hideProgressDetails={props.hideProgressDetails}
      disableThumbnailGenerator={props.disableThumbnailGenerator}
      waitForThumbnailsBeforeUpload={props.waitForThumbnailsBeforeUpload}
      showSelectedFiles={props.showSelectedFiles}
      singleFileFullScreen={props.singleFileFullScreen}
      fileManagerSelectionType={correctFileManagerSelectionType()}

      hideUploadButton={false}
      hideRetryButton={false}
      hideCancelButton={false}
      hidePauseResumeButton={false}
      proudlyDisplayPoweredByUppy={false}
    />
  );
}

export default DashUploaderUppy5;
