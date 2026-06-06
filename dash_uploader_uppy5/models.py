from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, field_serializer, ValidationInfo


class SizeConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    width: int | None = Field(default=None, description="in Pixels")
    height: int | None = Field(default=None, description="in Pixels")


class UploadConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(default="uppy5-uploader")
    upload_url: str = Field(alias="uploadUrl")
    allow_multiple_upload_batches: bool = Field(default=True, alias="allowMultipleUploadBatches")
    allowed_file_types: list[str] | None = Field(default=None, alias="allowedFileTypes")
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
    size: SizeConfig | None = Field(default=None)
    hide_progress_details: bool = Field(default=False, alias="hideProgressDetails")
    disable_thumbnail_generator: bool = Field(default=True, alias="disableThumbnailGenerator")
    wait_for_thumbnails_before_upload: bool = Field(default=False, alias="waitForThumbnailsBeforeUpload")
    show_selected_files: bool = Field(default=True, alias="showSelectedFiles")
    single_file_full_screen: bool = Field(default=False, alias="singleFileFullScreen")
    file_manager_selection_type: Literal["files", "folders", "both"] = Field(
        default="files", alias="fileManagerSelectionType"
    )

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
    def parse_size(cls, v: dict | None) -> SizeConfig | None:
        return v if v is None else SizeConfig(**v)

    @field_serializer("size", when_used="json")
    def serialize_size(self, v: SizeConfig | None) -> dict[str, int] | None:
        return v.model_dump() if v is not None else None
