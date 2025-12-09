import DashComponentProps from './DashComponent';

export type Props = {
  // Many API descriptions comes from here:
  // https://uppy.io/docs/uppy/

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

} & DashComponentProps;