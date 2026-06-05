import Uppy from '@uppy/core';
import Dashboard from '@uppy/react/dashboard';
import React, {useState} from 'react';
import Props from './types/Uploader';
import {useSetupUppyEventHandlers} from "./hooks/useSetupUppyEventHandlers";
import CreateUppyInstance from './utils/createUppy';
import CreateStringUnionGuard from "./utils/createStringUnionGuard";

import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';

const isValidTheme = CreateStringUnionGuard(["auto", "dark", "light"] as const);
const isValidSelectType = CreateStringUnionGuard(["files", "folders", "both"] as const);

/**
 * A dash Component.
 */
const DashUploaderUppy5 = (props: Props) => {
  const [uppy] = useState<Uppy>(() => CreateUppyInstance(props));

  useSetupUppyEventHandlers(uppy, props);

  return (
    <Dashboard
      id={props.id}
      uppy={uppy}

      disabled={props.disabled}
      theme={isValidTheme(props.theme) ? props.theme : undefined}
      note={props.note}

      width={props.size?.width}
      height={props.size?.height}

      hideProgressDetails={props.hideProgressDetails}
      disableThumbnailGenerator={props.disableThumbnailGenerator}
      waitForThumbnailsBeforeUpload={props.waitForThumbnailsBeforeUpload}
      showSelectedFiles={props.showSelectedFiles}
      singleFileFullScreen={props.singleFileFullScreen}
      fileManagerSelectionType={isValidSelectType(props.fileManagerSelectionType) ? props.fileManagerSelectionType : undefined}

      hideUploadButton={false}
      hideRetryButton={false}
      hideCancelButton={false}
      hidePauseResumeButton={false}
      proudlyDisplayPoweredByUppy={false}
    />
  );
}

export default DashUploaderUppy5;
