import DashComponentProps from './DashComponent';

// Many API descriptions comes from here:
// https://uppy.io/docs/uppy/
// and here:
// https://uppy.io/docs/dashboard/


interface DashboardSize {
  /**
   * Width of the Dashboard in pixels.
   */
  width?: number;

  /**
   * Height of the Dashboard in pixels.
   */
  height?: number;
}

interface ResponseInfo {
  filename: string;
  status: number;
}


export interface UppyCore {
  /**
   * URL of the HTTP server
   */
  uploadUrl: string;

  /**
   * If `true`, it will upload as soon as files are added
   */
  autoProceed?: boolean;

  /**
   * Whether to allow several upload batches. Default: `True`
   */
  allowMultipleUploadBatches?: boolean;

  /**
   * Maximum file size in bytes for each individual file
   */
  maxFileSize?: number;

  /**
   * Minimum file size in bytes for each individual file
   */
  minFileSize?: number;

  /**
   * Maximum file size in bytes for all the files
   * that can be selected for upload
   */
  maxTotalFileSize?: number;

  /**
   * Total number of files that can be selected
   */
  maxNumberOfFiles?: number;

  /**
   * Minimum number of files that must be selected before the upload
   */
  minNumberOfFiles?: number;

  /**
   * Wildcards `image/*`, or exact mime types `image/jpeg`,
   * or file extensions `.jpg`
   */
  allowedFileTypes?: string[];

  /**
   * The unique identifier for the upload session.
   * This will be sent to the backend to create a specific sub-folder.
   */
  uploadId?: string;
}

export interface UppyDashboard {
  /**
   * Enabling this option makes the Dashboard grayed-out and non-interactive.
   */
  disabled?: boolean;

  /**
   * Light or dark theme for the Dashboard.
   * When it is set to `auto`, it will respect the user’s system settings and switch automatically.
   * It only can be one of the string ('light', 'dark' and 'auto').
   */
  theme?: string;

  /**
   * A string of text to be placed in the Dashboard UI.
   */
  note?: string;

  /**
  * Size of the Dashboard in pixels or percentages.
  */
  size?: DashboardSize;

  /**
   * Show or hide progress details in the status bar.
   */
  hideProgressDetails?: boolean;

  /**
   * Disable the thumbnail generator completely.
   */
  disableThumbnailGenerator?: boolean;

  /**
   * Whether to wait for all thumbnails to be ready before starting the upload.
   */
  waitForThumbnailsBeforeUpload?: boolean;

  /**
   * Show the list of added files with a preview and file information.
   */
  showSelectedFiles?: boolean;

  /**
   * When only one file is selected, its preview and meta information will be centered and enlarged.
   */
  singleFileFullScreen?: boolean;

  /**
   * Configure the type of selections allowed when browsing your file system via the file manager selection window.
   * It only can be one of the string ('files', 'folders' and 'both').
   */
  fileManagerSelectionType?: string;
}

export interface UppyCallbacks {
  /**
   * List of successfully uploaded files
   */
  uploadedFiles?: Array<{
    name: string;
    size: number;
    type: string;
    response: ResponseInfo;
  }>;

  failedFiles?: Array<{
    name: string;
    error: string;
  }>;
}


type Props = UppyCore & UppyDashboard & UppyCallbacks & DashComponentProps;


export default Props;