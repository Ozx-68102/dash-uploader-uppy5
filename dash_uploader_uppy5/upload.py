from uuid import uuid4

import dash_uploader_uppy5.settings as settings
from dash_uploader_uppy5.build.DashUploaderUppy5 import DashUploaderUppy5


def update_upload_uri(pathname_prefix: str, upload_api: str) -> str:
    if pathname_prefix == "/":
        return upload_api

    return "/".join([pathname_prefix.rstrip("/"), upload_api.lstrip("/")])


def Upload(
        id: str = "uppy5-uploader",
        allow_multiple_upload_batches: bool = True,
        allowed_file_types: list[str] | None = None,
        auto_proceed: bool = False,
        max_file_size: int | None = 1024,
        min_file_size: int | None = None,
        max_total_file_size: int | None = None,
        max_number_of_files: int | None = 1,
        min_number_of_files: int | None = None,
        upload_id: str | None = None,
) -> DashUploaderUppy5:
    """
    A dash-uploader-uppy5 component.

    :param id: The id of this component.
    :param allow_multiple_upload_batches: Whether to allow several upload batches.
    :param allowed_file_types: Wildcards ["image/*"], or exact mime types ["image/jpeg"],  or file extensions [".jpg"].
    :param auto_proceed: If True, it will upload as soon as files are added.
    :param max_file_size: Maximum file size in Megabytes for each individual file.
    :param min_file_size: Minimum file size in Megabytes for each individual file.
    :param max_total_file_size: Maximum file size in Megabytes for all the files  that can be selected
    for upload.
    :param max_number_of_files: Total number of files that can be selected.
    :param min_number_of_files: Minimum number of files that must be selected before the upload.
    :param upload_id: The unique identifier for the upload session. By default, it will be created with uuid.uuid4().

    :return: Initialize this Dash component for app.layout.
    """
    upload_id = upload_id if upload_id else str(uuid4())
    upload_url = update_upload_uri(pathname_prefix=settings.requests_pathname_prefix, upload_api=settings.upload_api)

    arguments = dict(
        uploadUrl=upload_url,
        autoProceed=auto_proceed,
        allowMultipleUploadBatches=allow_multiple_upload_batches,
        maxFileSize=max_file_size * 1024 * 1024 if max_file_size is not None else None,
        minFileSize=min_file_size * 1024 * 1024 if min_file_size is not None else None,
        maxTotalFileSize=max_total_file_size * 1024 * 1024 if max_total_file_size is not None else None,
        maxNumberOfFiles=max_number_of_files,
        minNumberOfFiles=min_number_of_files,
        allowedFileTypes=allowed_file_types,
        uploadId=upload_id,
        id=id,
    )

    return DashUploaderUppy5(**arguments)
