import path from 'path';
import type {Configuration} from 'webpack';
import packageJson from './package.json';

const dashLibraryName: string = packageJson.name.replace(/-/g, '_');

const config = (_env: Record<string, any> = {}, argv: Record<string, any> = {}): Configuration => {
  const mode: any = argv.mode || 'production';
  const entry: string[] = [path.join(__dirname, 'src/index.ts')];

  const output = {
    path: path.join(__dirname, dashLibraryName, 'build'),
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
                insert: 'head',
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
};


export default config;
