const config = {
    projectName: 'taro3-table',
    date: '2021-3-12',
    designWidth: 750,
    deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [],
    defineConstants: {},
    copy: {
        patterns: [],
        options: {}
    },
    framework: 'react',
    mini: {
        postcss: {
            pxtransform: {
                enable: true,
                config: {}
            },
            url: {
                enable: true,
                config: {
                    limit: 1024 // 设定转换尺寸上限
                }
            },
            cssModules: {
                enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
                config: {
                    namingPattern: 'module', // 转换模式，取值为 global/module
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        }
    },
    h5: {
        esnextModules: ['taro-ui'],
        publicPath: '/',
        miniCssExtractPluginOption: {
          filename: 'css/[name].[hash].css',
          chunkFilename: 'css/[name].[chunkhash].css',
        },
        postcss: {
          autoprefixer: {
            enable: true,
            config: {},
          },
          cssModules: {
            enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
            config: {
              namingPattern: 'module', // 转换模式，取值为 global/module
              generateScopedName: '[name]__[local]___[hash:base64:5]',
            },
          },
        },
        lessLoaderOption: {
          lessOptions: {
            javascriptEnabled: true, //是否启用less （已经弃用）
          },
        },
      },
};

module.exports = function (merge) {
    if (process.env.NODE_ENV === 'development') {
        return merge({}, config, require('./dev'));
    }
    return merge({}, config, require('./prod'));
};
