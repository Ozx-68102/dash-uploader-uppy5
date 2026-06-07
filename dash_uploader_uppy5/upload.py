from inspect import Parameter, Signature
from typing import Literal
from uuid import uuid4

from pydantic_core import PydanticUndefined

import dash_uploader_uppy5.settings as settings
from dash_uploader_uppy5.build.DashUploaderUppy5 import DashUploaderUppy5
from dash_uploader_uppy5.models import UploadConfig
from dash_uploader_uppy5.utils import update_upload_uri

_UNSET = object()

# Public API fields (upload_url is generated internally by Upload())
_UPLOAD_API_FIELDS = [
    "id",
    "allow_multiple_upload_batches",
    "allowed_file_types",
    "disable_done_button",
    "disable_status_bar",
    "auto_proceed",
    "max_file_size",
    "min_file_size",
    "max_total_file_size",
    "max_number_of_files",
    "min_number_of_files",
    "upload_id",
    "disabled",
    "theme",
    "note",
    "size",
    "hide_progress_details",
    "disable_thumbnail_generator",
    "wait_for_thumbnails_before_upload",
    "show_selected_files",
    "single_file_full_screen",
    "locale_string",
    "file_manager_selection_type",
    "hide_upload_button",
    "hide_retry_button",
    "hide_cancel_button",
    "auto_clear_on_complete",
    "hide_drag_over_hint",
]

# Fields that require MB-to-bytes conversion (model stores bytes, API uses MB)
_SIZE_FIELDS_MB = {"max_file_size", "min_file_size", "max_total_file_size"}


def _get_public_default(field_name: str, field_info):
    if field_name in _SIZE_FIELDS_MB:
        # These fields are stored as bytes in the model, but shown as MB in the public API
        if field_info.default is not PydanticUndefined:
            return field_info.default // (1024 * 1024) if field_info.default else None
        return None
    if field_name == "size":
        # SizeConfig default serialized to dict for the signature
        if field_info.default_factory is not None:
            return field_info.default_factory().model_dump()
        return None
    if field_info.default is not PydanticUndefined:
        return field_info.default
    if field_info.default_factory is not None:
        return field_info.default_factory()
    return _UNSET


def _build_upload_signature() -> Signature:
    # Dynamically build Upload() signature from UploadConfig.model_fields
    params = []
    for i, name in enumerate(_UPLOAD_API_FIELDS):
        f = UploadConfig.model_fields[name]
        # First param (id) is positional-or-keyword; the rest are keyword-only
        kind = Parameter.POSITIONAL_OR_KEYWORD if i == 0 else Parameter.KEYWORD_ONLY
        params.append(
            Parameter(
                name,
                kind,
                default=_get_public_default(name, f),
                annotation=f.annotation,
            )
        )
    return Signature(params)


def Upload(
        id: str | object = _UNSET,
        *,
        allow_multiple_upload_batches: bool | object = _UNSET,
        allowed_file_types: list[str] | None | object = _UNSET,
        disable_done_button: bool | object = _UNSET,
        disable_status_bar: bool | object = _UNSET,
        auto_proceed: bool | object = _UNSET,
        max_file_size: int | None | object = _UNSET,
        min_file_size: int | None | object = _UNSET,
        max_total_file_size: int | None | object = _UNSET,
        max_number_of_files: int | None | object = _UNSET,
        min_number_of_files: int | None | object = _UNSET,
        upload_id: str | None | object = _UNSET,
        disabled: bool | object = _UNSET,
        theme: Literal["auto", "light", "dark"] | object = _UNSET,
        note: str | None | object = _UNSET,
        size: dict[str, int | str] | None | object = _UNSET,
        hide_progress_details: bool | object = _UNSET,
        disable_thumbnail_generator: bool | object = _UNSET,
        wait_for_thumbnails_before_upload: bool | object = _UNSET,
        show_selected_files: bool | object = _UNSET,
        single_file_full_screen: bool | object = _UNSET,
        locale_string: dict[str, str] | None | object = _UNSET,
        file_manager_selection_type: Literal["files", "folders", "both"] | object = _UNSET,
        hide_upload_button: bool | object = _UNSET,
        hide_retry_button: bool | object = _UNSET,
        hide_cancel_button: bool | object = _UNSET,
        auto_clear_on_complete: bool | object = _UNSET,
        hide_drag_over_hint: bool | object = _UNSET,
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
    disable_status_bar: bool
        Disable the status bar completely. Defaults to False.
    auto_proceed : bool
        If True, uploads start as soon as files are added. Defaults to False.
        Cannot be used with ``uploadTrigger`` (returns error via ``uploadStatus``).
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
        creation when ``use_upload_id=True`` in ``du.configurator()``.
        Defaults to None.
    disabled: bool
        Enabling this option makes the Dashboard grayed-out and non-interactive. Defaults to False.
    theme: Literal["auto", "light", "dark"]
        Light or dark theme for the Dashboard. Defaults to "auto".
        When it is set to ``auto``, it will respect the user’s system settings and switch automatically.
    note: str or None
        A string of text to be placed in the Dashboard UI. Defaults to None.
    size: dict[str, int | str] or None
        Size of the Dashboard. It only accepts "width" and "height".
        Defaults to {"width": "100%", "height": "100%"} so the uploader fills its parent container
        instead of Uppy's built-in 650×500px.
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
    locale_string: dict[str, str] or None
        Partial Dashboard locale strings to override Uppy defaults. Defaults to None.
        Only the keys you provide are replaced; omitted keys keep Uppy defaults.
        Keys use camelCase as in Uppy (e.g. "dropPasteFiles", "browseFiles").
        Placeholders such as %{browseFiles} are supported but not required.
        Examples: {"dropPasteFiles": "Drop your files here"}
    file_manager_selection_type: Literal["files", "folders", "both"],
        Configure the type of selections allowed when browsing your file system via the file manager selection window. Defaults to "files".
    hide_upload_button: bool
        Show or hide the upload button. Typically paired with a custom upload button using
        ``uploadTrigger``. Only effective when ``auto_proceed=False``. Defaults to False.
    hide_retry_button: bool
        Hide the retry button in the status bar and on each individual file.
        Typically paired with a custom retry button using ``retryTrigger`` (``retryAll()`` API).
        Hiding the button does not make ``retryTrigger`` work when ``auto_clear_on_complete=True``
        (that combination is rejected at runtime). Defaults to False.
    hide_cancel_button: bool
        Hide the cancel button in the status bar and on each individual file.
        Typically paired with a custom cancel button using ``cancelTrigger`` (``cancelAll()`` API).
        Defaults to False.
    auto_clear_on_complete: bool
        Automatically clear all files when an upload batch completes (Uppy ``complete`` event).
        ``uploadedFiles`` / ``failedFiles`` are reported to Dash before the UI resets.
        Cannot be used with Dashboard retry or ``retryTrigger`` (failed files are cleared).
        Defaults to False.
    hide_drag_over_hint: bool
        **[EXPERIMENTAL]** Hide the drag-over upward arrow animation hint.
        Not an official Uppy feature; implementation may change.

    Returns
    -------
    DashUploaderUppy5
        Initialize this Dash component for app.layout.
    """
    # Collect only parameters the user explicitly passed (exclude _UNSET)
    overrides = {
        "id": id,
        "allow_multiple_upload_batches": allow_multiple_upload_batches,
        "allowed_file_types": allowed_file_types,
        "disable_done_button": disable_done_button,
        "disable_status_bar": disable_status_bar,
        "auto_proceed": auto_proceed,
        "max_file_size": max_file_size,
        "min_file_size": min_file_size,
        "max_total_file_size": max_total_file_size,
        "max_number_of_files": max_number_of_files,
        "min_number_of_files": min_number_of_files,
        "upload_id": upload_id,
        "disabled": disabled,
        "theme": theme,
        "note": note,
        "size": size,
        "hide_progress_details": hide_progress_details,
        "disable_thumbnail_generator": disable_thumbnail_generator,
        "wait_for_thumbnails_before_upload": wait_for_thumbnails_before_upload,
        "show_selected_files": show_selected_files,
        "single_file_full_screen": single_file_full_screen,
        "locale_string": locale_string,
        "file_manager_selection_type": file_manager_selection_type,
        "hide_upload_button": hide_upload_button,
        "hide_retry_button": hide_retry_button,
        "hide_cancel_button": hide_cancel_button,
        "auto_clear_on_complete": auto_clear_on_complete,
        "hide_drag_over_hint": hide_drag_over_hint,
    }
    overrides = {k: v for k, v in overrides.items() if v is not _UNSET}

    # upload_id: business logic (None -> uuid4), not a model default
    upload_id = overrides.pop("upload_id", None) or str(uuid4())

    # upload_url: generated at runtime from settings
    upload_url = update_upload_uri(
        pathname_prefix=settings.requests_pathname_prefix, upload_api=settings.upload_api
    )

    config = UploadConfig(uploadUrl=upload_url, uploadId=upload_id, **overrides)
    return DashUploaderUppy5(**config.model_dump(by_alias=True))


# Attach the dynamically generated signature so IDEs and help() show Pydantic defaults
Upload.__signature__ = _build_upload_signature()
