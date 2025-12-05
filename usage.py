import dash_uploader_uppy5
import dash

app = dash.Dash()

app.layout = dash_uploader_uppy5.DashUploaderUppy5(id='component')


if __name__ == '__main__':
    app.run(debug=True)
