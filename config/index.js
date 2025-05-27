import { resolve } from "path";

const config = {
  projectName: "taro-bazi",
  date: "2023-4-3",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: [],
  alias: {
    "@": resolve(__dirname, "..", "src"),
    "@/config": resolve(__dirname, "..", "src/config"),
    "@/utils": resolve(__dirname, "..", "src/utils"),
    "@/assets": resolve(__dirname, "..", "src/assets"),
    "@/components": resolve(__dirname, "..", "src/components"),
    "@/pages": resolve(__dirname, "..", "src/pages"),
    "@/services": resolve(__dirname, "..", "src/services"),
  },
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: "react",
  compiler: "webpack5",
  cache: {
    enable: true, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    devServer: {
      hot: false,
    },
    router: {
      mode: 'browser', // 'hash，browser'
      customRoutes: {
        // "页面路径": "自定义路由"
        '/pages/index/index': ['/', '/index'],
        '/pages/record/index': '/record', // 可以通过数组为页面配置多个自定义路由
        '/pages/case/index': '/case', // 可以通过数组为页面配置多个自定义路由
        '/pages/sub/subHoroscope/index': '/subHoroscope',
      },
    },
  },
  rn: {
    appName: "taroDemo",
    postcss: {
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
      },
    },
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
