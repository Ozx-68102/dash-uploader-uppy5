import path from 'path';
import type {Configuration} from 'webpack';
import packageJson from './package.json'

const dashLibraryName: string = packageJson.name.replace(/-/g, '_');

declare global {
  interface Window {
    _lastElementInsertedByStyleLoader: HTMLElement | null
  }
}

export default (_env: Record<string, any> = {}, argv: Record<string, any> = {}): Configuration => {
  const mode: any = argv.mode || 'production';
  const entry: string[] = [path.join(__dirname, 'src/ts/index.ts')];

  const output = {
    path: path.join(__dirname, dashLibraryName),
    filename: `${dashLibraryName}.js`,
    library: dashLibraryName,
    libraryTarget: 'umd',
    globalObject: 'this'
  };

  const externals = {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      umd: 'react',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
      root: 'ReactDOM',
    },
  };

  return {
    output,
    mode,
    entry,
    target: 'web',
    externals,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                insert: function insertAtTop(element: any) {
                  const parent: HTMLHeadElement | null = document.querySelector("head");
                  const lastInsertedElement: HTMLElement | null = window._lastElementInsertedByStyleLoader;

                  if (!lastInsertedElement) {
                    parent?.insertBefore(element, parent.firstChild);
                  } else if (lastInsertedElement.nextSibling) {
                    parent?.insertBefore(element, lastInsertedElement.nextSibling);
                  } else {
                    parent?.appendChild(element);
                  }

                  window._lastElementInsertedByStyleLoader = element;
                },
              },
            },
            {
              loader: 'css-loader',
            },
          ],
        },
      ]
    }
  }
}
