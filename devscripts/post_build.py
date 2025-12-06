import shutil
import os

from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
package_root = project_root / "dash_uploader_uppy5"
build_dir = package_root / "build"

build_dir.mkdir(exist_ok=True)
(build_dir / "__init__.py").touch(exist_ok=True)

generated_files = [
    "_imports_.py",
    "DashUploaderUppy5.py",
    "metadata.json",
    "package-info.json",
    "proptypes.js",
    "dash_uploader_uppy5.js",
    "dash_uploader_uppy5.js.LICENSE.txt"
]

print(f"Moving generated files to {build_dir}...")

for file in generated_files:
    src = package_root / file
    dst = build_dir / file

    if src.exists():
        if dst.exists():
            os.remove(dst)
        shutil.move(src, dst)
        print(f"  Moved {file}")
    else:
        print(f"  Warning: Expected file {file} not found in root.")
