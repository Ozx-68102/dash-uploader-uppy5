import Uppy from "@uppy/core";
import Dashboard from "@uppy/react/dashboard";
import React, {useEffect, useState} from "react";
import Props, {TriggerStatus} from "./types/Uploader";
import {useSetupUppyEventHandlers} from "./hooks/useSetupUppyEventHandlers";
import {useHandleClearTrigger} from "./hooks/useHandleClearTrigger";
import {useHandleUploadTrigger} from "./hooks/useHandleUploadTrigger";
import {useHandleRetryTrigger} from "./hooks/useHandleRetryTrigger";
import {useHandleCancelTrigger} from "./hooks/useHandleCancelTrigger";
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

  useSetupUppyEventHandlers(uppy, {
    uploadId: props.uploadId,
    setProps: props.setProps,
    autoClearOnComplete: props.autoClearOnComplete,
  });

  const setTriggerStatus = (key: string) => (status: TriggerStatus) => {
    if (props.setProps) props.setProps({[key]: status});
  };

  useHandleClearTrigger(uppy, props.clearTrigger, setTriggerStatus("clearStatus"));
  useHandleUploadTrigger(uppy, props.uploadTrigger, props.autoProceed, setTriggerStatus("uploadStatus"));
  useHandleRetryTrigger(uppy, props.retryTrigger, setTriggerStatus("retryStatus"));
  useHandleCancelTrigger(uppy, props.cancelTrigger, setTriggerStatus("cancelStatus"));

  useEffect(() => {
    if (!props.hideDragOverHint) return;

    const styleId = "uppy-hide-dragover-hint";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      .uppy-Dashboard-dropFilesHereHint {
        background-image: none !important;
        padding: 0 !important;
      }
    `;

    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [props.hideDragOverHint]);

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
      hideRetryButton={props.hideRetryButton}
      hideCancelButton={props.hideCancelButton}
      disableStatusBar={props.disableStatusBar}
      hidePauseResumeButton={true}
      proudlyDisplayPoweredByUppy={false}
    />
  );
}

export default DashUploaderUppy5;
