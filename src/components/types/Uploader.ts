import DashComponentProps from './DashComponent';

// Many API descriptions comes from here:
// https://uppy.io/docs/uppy/
// and here:
// https://uppy.io/docs/dashboard/


interface DashboardSize {
  /**
   * Width of the Dashboard. Use a number for pixels (e.g. 500),
   * or a CSS length string (e.g. "100%", "75px", "50vw", "10rem").
   */
  width?: number | string;

  /**
   * Height of the Dashboard. Use a number for pixels (e.g. 300),
   * or a CSS length string (e.g. "75px", "50vh", "10rem").
   */
  height?: number | string;
}

interface LocaleStrings {
  /**
   * Drop/paste hint when `fileManagerSelectionType` is `"files"`.
   * May include the `%{browseFiles}` placeholder, or plain text without placeholders.
   */
  dropPasteFiles?: string;

  /**
   * Drop/paste hint when `fileManagerSelectionType` is `"folders"`.
   * May include the `%{browseFolders}` placeholder, or plain text without placeholders.
   */
  dropPasteFolders?: string;

  /**
   * Drop/paste hint when `fileManagerSelectionType` is `"both"`.
   * May include `%{browseFiles}` and/or `%{browseFolders}` placeholders, or plain text.
   */
  dropPasteBoth?: string;

  /**
   * Label for the "browse files" control. Used when resolving `%{browseFiles}` placeholders.
   */
  browseFiles?: string;

  /**
   * Label for the "browse folders" control. Used when resolving `%{browseFolders}` placeholders.
   */
  browseFolders?: string;
}

interface ResponseInfo {
  /**
   * Sanitized filename saved on the server.
   */
  filename: string;

  /**
   * HTTP status code returned by the upload server.
   */
  status: number;
}

/**
 * Status returned after a trigger prop (e.g. `uploadTrigger`, `clearTrigger`) is processed.
 *
 * This is a "receipt" for the trigger action itself, NOT the final outcome of the underlying operation.
 * - `status: "success"` means the component received the trigger and executed the corresponding action
 *   (e.g. called `uppy.upload()`, `uppy.clear()`, etc.).
 * - It does NOT indicate whether files were successfully uploaded, cleared, retried, or cancelled.
 *   Those results are reported via `uploadedFiles` / `failedFiles` (from the `complete` event).
 *
 * The `attempt` field echoes the trigger value so each trigger produces a distinct update,
 * ensuring Dash callbacks always fire even if `status` stays the same.
 */
export interface TriggerStatus {
  /**
   * One of `"success"` or `"error"`.
   * `"success"` means the trigger was accepted and the action was initiated.
   */
  status: string;

  /**
   * Error details when `status` is `"error"`, otherwise `null`.
   * Only set when the trigger itself could not be processed (e.g. invalid state).
   */
  errorMessage: string | null;

  /**
   * The trigger value that caused this status.
   * This ensures each trigger produces a distinct object,
   * forcing Dash to update the prop even when the status is the same.
   */
  attempt?: number;
}

export interface UppyCore {
  /**
   * URL of the HTTP server
   */
  uploadUrl: string;

  /**
   * If `true`, uploads start as soon as files are added.
   * Incompatible with `uploadTrigger` when `auto_proceed=True` (returns error via `uploadStatus`).
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
   * Size of the Dashboard. Accepts "width" and "height" keys.
   * Each value may be a number (pixels) or a CSS length string.
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

  /**
   * Custom prop that simply determine able or disable "done" button.
   */
  disableDoneButton?: boolean;

  /**
   * Partial Dashboard locale strings. Only the keys you provide override Uppy defaults;
   * omitted keys keep the built-in English text.
   */
  localeString?: LocaleStrings;

  /**
   * Show or hide the upload button. Use when providing a custom upload button with `uploadTrigger`.
   * Only effective when `auto_proceed=False`.
   */
  hideUploadButton?: boolean;

  /**
   * Hide the retry button in the status bar and on each individual file.
   * Typically paired with a custom retry button using `retryTrigger` (`retryAll()`).
   * Hiding the button does not make `retryTrigger` work when `auto_clear_on_complete=True` (rejected at runtime).
   */
  hideRetryButton?: boolean;

  /**
   * Hide the cancel button in status bar and on each individual file.
   * Typically paired with a custom cancel button using `cancelTrigger` (`cancelAll()`).
   */
  hideCancelButton?: boolean;

  /**
   * Disable the status bar completely.
   */
  disableStatusBar?: boolean;

  /**
   * Automatically clear all files when an upload batch completes (Uppy `complete` event).
   * Useful for minimal drop-zone setups. `uploadedFiles` / `failedFiles` are reported before the UI resets.
   * Cannot be used with Dashboard retry or `retryTrigger`.
   */
  autoClearOnComplete?: boolean;

  /**
   * **[EXPERIMENTAL]** Hide the drag-over upward arrow hint animation (the blue dashed box with ↑ icon).
   * This is not an official Uppy prop and may break in future Uppy versions.
   */
  hideDragOverHint?: boolean;
}

export interface UppyCallbacks {
  /**
   * List of successfully uploaded files
   */
  uploadedFiles?: Array<{
    name: string;
    size: number;
    type: string;
    upload_id: string;
    response: ResponseInfo;
  }>;

  /**
   * List of upload failed files
   */
  failedFiles?: Array<{
    name: string;
    error: string;
  }>;

  /**
   * True when starting upload, False when completed (regardless of success or failure)
   */
  isUploading?: boolean;
}

export interface Triggers {
  /**
   * Increment or change this value from a Dash callback to clear all files in the uploader.
   */
  clearTrigger?: number;

  /**
   * Status returned after `clearTrigger` is processed.
   * See `TriggerStatus` for semantics.
   */
  clearStatus?: TriggerStatus;

  /**
   * Increment or change this value from a Dash callback to manually trigger upload.
   * Only works when `auto_proceed=False`. When `auto_proceed=True`, returns error via `uploadStatus`.
   */
  uploadTrigger?: number;

  /**
   * Status returned after `uploadTrigger` is processed.
   * See `TriggerStatus` for semantics.
   */
  uploadStatus?: TriggerStatus;

  /**
   * Increment or change this value from a Dash callback to cancel all uploads.
   * Typically paired with `hide_cancel_button` when using a custom cancel button.
   */
  cancelTrigger?: number;

  /**
   * Status returned after `cancelTrigger` is processed.
   * See `TriggerStatus` for semantics.
   */
  cancelStatus?: TriggerStatus;

  /**
   * Increment or change this value from a Dash callback to retry all failed uploads.
   * Typically paired with `hide_retry_button` when using a custom retry button.
   * Only retries failed files (`retryAll()`).
   * Cannot be used when `auto_clear_on_complete=True`; returns error via `retryStatus`.
   */
  retryTrigger?: number;

  /**
   * Status returned after `retryTrigger` is processed.
   * See `TriggerStatus` for semantics.
   */
  retryStatus?: TriggerStatus;
}


type Props = UppyCore & UppyDashboard & UppyCallbacks & DashComponentProps & Triggers;


export default Props;