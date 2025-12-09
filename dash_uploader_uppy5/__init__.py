import os as _os
import sys as _sys
import json

import dash as _dash

# noinspection PyUnresolvedReferences
from .build._imports_ import *  # noqa: F403,F401
from .build._imports_ import __all__ as build_all

# Defines all exposed APIs of this package.
__all__ = [
    "configure_upload",
] + build_all

if not hasattr(_dash, "development"):
    print(
        "Dash was not successfully imported. "
        "Make sure you don't have a file "
        'named \n"dash.py" in your current directory.',
        file=_sys.stderr,
    )
    _sys.exit(1)

_basepath = _os.path.dirname(__file__)
_filepath = _os.path.abspath(_os.path.join(_basepath, "build", "package-info.json"))
with open(_filepath) as f:
    package = json.load(f)

package_name = package["name"].replace(" ", "_").replace("-", "_")
__version__ = package["version"]

_current_path = _os.path.dirname(_os.path.abspath(__file__))

_this_module = _sys.modules[__name__]
_js_dist = [
    {"relative_package_path": "build/dash_uploader_uppy5.js", "namespace": package_name},
    {"relative_package_path": "build/dash_uploader_uppy5.js.map", "namespace": package_name, "dynamic": True},
]

_css_dist = []

for _component in build_all:
    setattr(locals()[_component], "_js_dist", _js_dist)
    setattr(locals()[_component], "_css_dist", _css_dist)