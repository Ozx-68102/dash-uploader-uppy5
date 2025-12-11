import Uppy from '@uppy/core';
import Dashboard from '@uppy/react/dashboard';
import React, { useState } from 'react';
import Props from './types/Uploader';
import CreateUppyInstance from './utils/createUppy';

import '@uppy/core/css/style.min.css';
import '@uppy/dashboard/css/style.min.css';


const DashUploaderUppy5 = (props: Props) => {
  const [uppy] = useState<Uppy>(() => CreateUppyInstance(props));

  return (
    <Dashboard
      id={props.id}
      uppy={uppy}

      disabled={props.disabled}
      theme={props.theme}
      note={props.note}

      width={props.size?.width || '100%'}
      height={props.size?.height || 550}

      hideProgressDetails={props.hideProgressDetails}
      disableThumbnailGenerator={props.disableThumbnailGenerator}
      waitForThumbnailsBeforeUpload={props.waitForThumbnailsBeforeUpload}
      showSelectedFiles={props.showSelectedFiles}
      singleFileFullScreen={props.singleFileFullScreen}
      fileManagerSelectionType={props.fileManagerSelectionType}

      hideUploadButton={false}
      hideRetryButton={false}
      hideCancelButton={false}
      hidePauseResumeButton={false}
    />
  );
}

export default DashUploaderUppy5;
