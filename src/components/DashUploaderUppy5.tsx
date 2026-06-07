import Uppy from "@uppy/core";
import Dashboard from "@uppy/react/dashboard";
import React, {useState} from "react";
import Props from "./types/Uploader";
import {useSetupUppyEventHandlers} from "./hooks/useSetupUppyEventHandlers";
import {useHandleClearTrigger} from "./hooks/useHandleClearTrigger";
import {useHandleUploadTrigger} from "./hooks/useHandleUploadTrigger";
import CreateUppyInstance from "./utils/createUppy";
import CreateStringUnionGuard from "./utils/createStringUnionGuard";
import buildLocaleString from "./utils/buildLocaleString";

import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";

const isValidTheme = CreateStringUnionGuard(["auto", "dark", "light"] as const);
const isValidSelectType = CreateStringUnionGuard(["files", "folders", "both"] as const);

/**
 * A dash Component.
 */
const DashUploaderUppy5 = (props: Props) => {
  const [uppy] = useState<Uppy>(() => CreateUppyInstance(props));

  useSetupUppyEventHandlers(uppy, props);
  useHandleClearTrigger(uppy, props.clearTrigger, (result) => {
    if (props.setProps) {
      props.setProps({clearOperation: result});
    }
  });
  useHandleUploadTrigger(uppy, props.uploadTrigger, props.autoProceed, (result) => {
    if (props.setProps) {
      props.setProps({uploadOperation: result});
    }
  });

  return (
    <Dashboard
      id={props.id}
      uppy={uppy}

      disabled={props.disabled}
      theme={isValidTheme(props.theme) ? props.theme : undefined}
      note={props.note}

      width={props.size?.width}
      height={props.size?.height}

      locale={buildLocaleString(props.localeString)}

      hideProgressDetails={props.hideProgressDetails}
      disableThumbnailGenerator={props.disableThumbnailGenerator}
      waitForThumbnailsBeforeUpload={props.waitForThumbnailsBeforeUpload}
      showSelectedFiles={props.showSelectedFiles}
      singleFileFullScreen={props.singleFileFullScreen}
      fileManagerSelectionType={
        isValidSelectType(props.fileManagerSelectionType) ? props.fileManagerSelectionType : undefined
      }
      doneButtonHandler={props.disableDoneButton ? null : undefined}

      hideUploadButton={props.hideUploadButton}
      hideRetryButton={false}
      hideCancelButton={false}
      disableStatusBar={false}
      hidePauseResumeButton={true}
      proudlyDisplayPoweredByUppy={false}
    />
  );
}

export default DashUploaderUppy5;
