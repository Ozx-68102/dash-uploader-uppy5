from typing import Literal
from uuid import uuid4

import dash_uploader_uppy5.settings as settings
from dash_uploader_uppy5.build.DashUploaderUppy5 import DashUploaderUppy5
from dash_uploader_uppy5.models import UploadConfig


def update_upload_uri(pathname_prefix: str, upload_api: str) -> str:
    if pathname_prefix == "/":
        return upload_api

    return "/".join([pathname_prefix.rstrip("/"), upload_api.lstrip("/")])


def Upload(
        id: str = "uppy5-uploader",
        *,
        allow_multiple_upload_batches: bool = True,
        allowed_file_types: list[str] | None = None,
        disable_done_button: bool = False,
        auto_proceed: bool = False,
        max_file_size: int | None = 1024,
        min_file_size: int | None = None,
        max_total_file_size: int | None = None,
        max_number_of_files: int | None = 1,
        min_number_of_files: int | None = None,
        upload_id: str | None = None,
        disabled: bool = False,
        theme: Literal["auto", "light", "dark"] = "auto",
        note: str | None = None,
        size: dict[str, int | str] | None = None,
        hide_progress_details: bool = False,
        disable_thumbnail_generator: bool = True,
        wait_for_thumbnails_before_upload: bool = False,
        show_selected_files: bool = True,
        single_file_full_screen: bool = False,
        file_manager_selection_type: Literal["files", "folders", "both"] = "files",
) -> DashUploaderUppy5:
    """
    A dash-uploader-uppy5 component.

    Parameters
    ----------
    id : str
        The id of this component. Defaults to "uppy5-uploader".
    allow_multiple_upload_batches : bool
        Whether to allow several upload batches. Defaults to True.
    allowed_file_types : list[str] or None
        Wildcards ["image/*"], or exact mime types ["image/jpeg"], or file extensions [".jpg"].
        Defaults to None.
    disable_done_button: bool
        If True, it will not show a "done" button when the upload is done. Defaults to False.
    auto_proceed : bool
        If True, it will upload as soon as files are added. Defaults to False.
    max_file_size : int or None
        Maximum file size in Megabytes for each individual file. Defaults to 1024.
    min_file_size : int or None
        Minimum file size in Megabytes for each individual file. Defaults to None.
    max_total_file_size : int or None
        Maximum file size in Megabytes for all the files that can be selected for upload.
        Defaults to None.
    max_number_of_files : int or None
        Total number of files that can be selected. Defaults to 1.
    min_number_of_files : int or None
        Minimum number of files that must be selected before the upload. Defaults to None.
    upload_id : str or None
        Custom upload session identifier (defaults to UUID if None). Used for subfolder
        creation when `use_upload_id=True` in `du.configurator()`.
        Defaults to None.
    disabled: bool
        Enabling this option makes the Dashboard grayed-out and non-interactive. Defaults to False.
    theme: Literal["auto", "light", "dark"]
        Light or dark theme for the Dashboard. Defaults to "auto".
        When it is set to `auto`, it will respect the user’s system settings and switch automatically.
    note: str or None
        A string of text to be placed in the Dashboard UI. Defaults to None.
    size: dict[str, int | str] or None
        Size of the Dashboard. It only accepts "width" and "height". Defaults to None.
        Each value may be an int (pixels) or a CSS length string (e.g. "100%", "75px", "50vw", "10rem").
        Examples: {"width": 500, "height": 300}, {"width": "100%", "height": "75px"}
    hide_progress_details: bool
        Show or hide progress details in the status bar. Defaults to False.
    disable_thumbnail_generator: bool
        Disable the thumbnail generator completely. Defaults to True.
    wait_for_thumbnails_before_upload: bool
        Whether to wait for all thumbnails to be ready before starting the upload. Defaults to False.
    show_selected_files: bool
        Show the list of added files with a preview and file information. Defaults to True.
    single_file_full_screen: bool
        When only one file is selected, its preview and meta information will be centered and enlarged. Defaults to False.
    file_manager_selection_type: Literal["files", "folders", "both"],
        Configure the type of selections allowed when browsing your file system via the file manager selection window. Defaults to "files".

    Returns
    -------
    DashUploaderUppy5
        Initialize this Dash component for app.layout.
    """
    upload_id = upload_id if upload_id else str(uuid4())
    upload_url = update_upload_uri(pathname_prefix=settings.requests_pathname_prefix, upload_api=settings.upload_api)

    config = UploadConfig(
        id=id,
        uploadUrl=upload_url,
        allowMultipleUploadBatches=allow_multiple_upload_batches,
        allowedFileTypes=allowed_file_types,
        disableDoneButton=disable_done_button,
        autoProceed=auto_proceed,
        maxFileSize=max_file_size,
        minFileSize=min_file_size,
        maxTotalFileSize=max_total_file_size,
        maxNumberOfFiles=max_number_of_files,
        minNumberOfFiles=min_number_of_files,
        uploadId=upload_id,
        disabled=disabled,
        theme=theme,  # type: ignore
        note=note,
        size=size,  # type: ignore
        hideProgressDetails=hide_progress_details,
        disableThumbnailGenerator=disable_thumbnail_generator,
        waitForThumbnailsBeforeUpload=wait_for_thumbnails_before_upload,
        showSelectedFiles=show_selected_files,
        singleFileFullScreen=single_file_full_screen,
        fileManagerSelectionType=file_manager_selection_type  # type: ignore
    )

    return DashUploaderUppy5(**config.model_dump(by_alias=True))
