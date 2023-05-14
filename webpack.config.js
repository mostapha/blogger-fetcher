import path from 'path'
import { fileURLToPath } from 'url'

// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const build_name = process.env.BUILD_NAME === 'modern' ? '' : '-legacy'

const isModernBuild = process.env.BUILD_NAME === 'modern'
const isProduction = process.env.NODE_ENV === 'production'

const modern_target = 'last 1 Chrome versions'
const legacy_target = '> 0.1% and since 2014 and not dead,iOS >= 10,android >=4.2'

const config = {
  entry: {
    ['bundle' + build_name]: './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  target: ['web', 'es5'],
  optimization: {
    minimize: false,
    mangleExports: false,
    moduleIds: 'size'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                targets: isModernBuild ? modern_target : legacy_target,
                corejs: '3.27.2',
                debug: true,
              }
            ]
          ]
        },
        resolve: {
          fullySpecified: false,
        }
      }
    ],
  },
  plugins: [
    // new BundleAnalyzerPlugin()
  ]
}

export default () => {
  if (isProduction) {
    config.mode = 'production'
  } else {
    config.mode = 'development'
  }
  return config
}
