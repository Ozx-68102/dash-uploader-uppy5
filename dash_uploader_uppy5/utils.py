def update_upload_uri(pathname_prefix: str, upload_api: str) -> str:
    if pathname_prefix == "/":
        return upload_api

    return "/".join([pathname_prefix.rstrip("/"), upload_api.lstrip("/")])
