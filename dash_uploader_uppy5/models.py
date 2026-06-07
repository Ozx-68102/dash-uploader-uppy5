from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, field_serializer, ValidationInfo


class SizeConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    width: int | str = Field(default="100%")
    height: int | str = Field(default="100%")


class LocaleStringConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    drop_paste_files: str | None = Field(default=None, alias="dropPasteFiles")
    drop_paste_folders: str | None = Field(default=None, alias="dropPasteFolders")
    drop_paste_both: str | None = Field(default=None, alias="dropPasteBoth")
    browse_files: str | None = Field(default=None, alias="browseFiles")
    browse_folders: str | None = Field(default=None, alias="browseFolders")


class UploadConfig(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)

    id: str = Field(default="uppy5-uploader")
    upload_url: str = Field(alias="uploadUrl")
    allow_multiple_upload_batches: bool = Field(default=True, alias="allowMultipleUploadBatches")
    allowed_file_types: list[str] | None = Field(default=None, alias="allowedFileTypes")
    disable_done_button: bool = Field(default=False, alias="disableDoneButton")
    disable_status_bar: bool = Field(default=False, alias="disableStatusBar")
    auto_proceed: bool = Field(default=False, alias="autoProceed")
    max_file_size: int | None = Field(default=1024 ** 3, alias="maxFileSize", description="in Bytes")
    min_file_size: int | None = Field(default=None, alias="minFileSize", description="in Bytes")
    max_total_file_size: int | None = Field(default=None, alias="maxTotalFileSize", description="in Bytes")
    max_number_of_files: int | None = Field(default=1, alias="maxNumberOfFiles")
    min_number_of_files: int | None = Field(default=None, alias="minNumberOfFiles")
    upload_id: str | None = Field(default=None, alias="uploadId")
    disabled: bool = Field(default=False)
    theme: Literal["auto", "light", "dark"] = Field(default="auto")
    note: str | None = Field(default=None)
    size: SizeConfig = Field(default_factory=SizeConfig)
    hide_progress_details: bool = Field(default=False, alias="hideProgressDetails")
    disable_thumbnail_generator: bool = Field(default=True, alias="disableThumbnailGenerator")
    wait_for_thumbnails_before_upload: bool = Field(default=False, alias="waitForThumbnailsBeforeUpload")
    show_selected_files: bool = Field(default=True, alias="showSelectedFiles")
    single_file_full_screen: bool = Field(default=False, alias="singleFileFullScreen")
    locale_string: LocaleStringConfig | None = Field(default=None, alias="localeString")
    file_manager_selection_type: Literal["files", "folders", "both"] = Field(
        default="files", alias="fileManagerSelectionType"
    )
    hide_upload_button: bool = Field(default=False, alias="hideUploadButton")
    hide_retry_button: bool = Field(default=False, alias="hideRetryButton")
    hide_cancel_button: bool = Field(default=False, alias="hideCancelButton")

    @field_validator("max_file_size", "min_file_size", "max_total_file_size", mode="before")
    @classmethod
    def convert_mb_to_bytes(cls, v: int | None) -> int | None:
        return v * 1024 ** 2 if v is not None else None

    @field_validator("max_number_of_files", "min_number_of_files")
    @classmethod
    def validate_file_count(cls, v: int | None, info: ValidationInfo) -> int | None:
        field_name = info.field_name
        if v is not None and v < 0:
            raise ValueError(f"{field_name} cannot be negative.")

        return v

    @field_validator("max_number_of_files")
    @classmethod
    def validate_max_files(cls, v: int | None, info: ValidationInfo) -> int | None:
        min_files: int | None = info.data.get("min_number_of_files")
        if v is not None and min_files is not None and v < min_files:
            raise ValueError("`max_number_of_files` must be greater than or equal to `min_number_of_files`.")

        return v

    @field_validator("size", mode="before")
    @classmethod
    def parse_size(cls, v: dict | None) -> SizeConfig:
        return SizeConfig(**v) if v is not None else SizeConfig()

    @field_validator("locale_string", mode="before")
    @classmethod
    def parse_locale_string(cls, v: dict | None) -> LocaleStringConfig | None:
        return LocaleStringConfig(**v) if v is not None else None

    @field_serializer("size", when_used="json")
    def serialize_size(self, v: SizeConfig) -> dict[str, int | str]:
        return v.model_dump()

    @field_serializer("locale_string", when_used="json")
    def serialize_locale_string(self, v: LocaleStringConfig | None) -> dict[str, str] | None:
        return v.model_dump(by_alias=True, exclude_none=True) if v is not None else None
