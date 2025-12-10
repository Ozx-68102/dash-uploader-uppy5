# dash-uploader-uppy5
A modern [Dash](https://dash.plotly.com) file uploader component powered by [Uppy 5](https://uppy.io/).

> **Work In Progress**: This project is currently in early development stage.

## Features

- **Modern UI**: Built with [Uppy 5](https://uppy.io/), providing a sleek and user-friendly interface.
- **Large File Support**: Handles large file uploads efficiently via Flask streaming (`Werkzeug`).
- **Customizable**: Configurable file restrictions (size, type, count) directly from Python.

## Usage

```python
import dash_uploader_uppy5 as du
import dash
from dash import html

app = dash.Dash(__name__)

# Configure the upload folder
du.configurator(app, folder='uploads')

app.layout = html.Div([
    html.H1('Dash Application'),
    du.Upload(
        id='uploader',
        max_file_size=1024, # Megabyte, 1GB
        allowed_file_types=['.csv']
    )
])

if __name__ == '__main__':
    app.run(debug=True)
```

## Credits & Inspiration

This project is a spiritual successor to the excellent [dash-uploader](https://github.com/fohrloop/dash-uploader) (now archived).
We adopted some parts of its proven Python wrapper patterns and configuration logic but replaced the underlying 
`flow.js` / `Resumable.js` with the more modern and active [Uppy 5](https://uppy.io/).  
  
Special thanks to the original authors for all their groundwork on Dash integration.

## License
MIT