import DashComponentProps from './DashComponent';

// Many API descriptions comes from here:
// https://uppy.io/docs/uppy/
// and here:
// https://uppy.io/docs/dashboard/


export interface DashboardSize {
  /**
   * Width of the Dashboard in pixels.
   */
  width?: number | string;

  /**
   * Height of the Dashboard in pixels.
   */
  height?: number | string;
}

export interface UploaderBody extends Record<string, unknown> {
  filename: string;
  status?: string;
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
   */
  theme?: 'light' | 'dark' | 'auto';

  /**
   * A string of text to be placed in the Dashboard UI.
   */
  note?: string;

  /**
  * Size of the Dashboard in pixels.
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
   */
  fileManagerSelectionType?: 'files' | 'folders' | 'both';
}


type Props = UppyCore & UppyDashboard & DashComponentProps;


export default Props;