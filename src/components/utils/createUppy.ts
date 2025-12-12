import Uppy from '@uppy/core';
import XHRUpload from "@uppy/xhr-upload";
import { UppyCore } from "../types/Uploader";


const createUppy = (props: UppyCore) => {
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
    debug: false,
  });

  uppy.setMeta({ uploadId });

  uppy.use(XHRUpload, {
    endpoint,
    fieldName: 'file',
  });

  return uppy;
};

export default createUppy;