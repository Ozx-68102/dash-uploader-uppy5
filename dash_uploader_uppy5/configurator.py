import logging

import dash_uploader_uppy5.settings as settings
from dash_uploader_uppy5.upload import update_upload_uri
from dash_uploader_uppy5.uploadhandler import UploadHandler
from dash import Dash

logger = logging.getLogger("dash_uploader_uppy5")

def configurator(
        app: Dash,
        folder: str,
        use_upload_id: bool = True,
        upload_api: str | None = None,
        upload_handler: UploadHandler | None = None
) -> None:
    settings.UPLOAD_FOLDER = folder
    settings.app = app

    if upload_api is None:
        upload_api = settings.upload_api
    else:
        settings.upload_api = upload_api

    settings.requests_pathname_prefix = app.config.get("requests_pathname_prefix", "/")
    settings.routes_pathname_prefix = app.config.get("routes_pathname_prefix", "/")

    upload_api = update_upload_uri(pathname_prefix=settings.routes_pathname_prefix, upload_api=upload_api)
    upload_handler = UploadHandler if upload_handler is None else upload_handler

    handler_instance = upload_handler(folder=folder, use_upload_id=use_upload_id)

    app.server.add_url_rule(rule=upload_api, endpoint="dash_uploader_uppy5", view_func=handler_instance.upload, methods=['POST'])

