import Uppy from '@uppy/core';
import XHRUpload from "@uppy/xhr-upload";
import { Props } from "../types/Uploader";


const createUppy = (props: Props) => {
  const {
    uploadUrl: endpoint,
    autoProceed,
    allowMultipleUploadBatches,
    maxFileSize,
    minFileSize,
    maxTotalFileSize,
    maxNumberOfFiles,
    minNumberOfFiles,
    allowedFileTypes,
    uploadId
  } = props;

  const uppy = new Uppy({
    autoProceed,
    allowMultipleUploadBatches,
    restrictions: {
      maxFileSize,
      minFileSize,
      maxTotalFileSize,
      maxNumberOfFiles,
      minNumberOfFiles,
      allowedFileTypes,
    },

    /**
     * Whether to send debugging and warning logs
     * [WARNING: Remember that for development only!!!]
     */
    debug: true,
  });

  uppy.setMeta({ uploadId });

  uppy.use(XHRUpload, {
    endpoint,
    fieldName: 'file',
  });

  return uppy;
};

export default createUppy;