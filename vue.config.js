module.exports = {
    publicPath: "./",
    devServer: {
        // 后端请求转发，此配置仅开发环境有效，生产环境请参考生产环境部署文档配置nginx转发
        proxy: {
            '/wx': {
                target: 'http://localhost:8088/'
            }
        },
        port: 8001,
        inline: false //实时编译
    },
    configureWebpack: {
        devServer: {
            disableHostCheck: true
        },
        externals: {
            vue: "Vue",
            "vue-router": "Router",
            "element-ui": "ELEMENT",
            "tinymce": "tinymce"
        }
    },
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
    },
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: '微信管理系统',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        index1: {
            // page 的入口
            entry: 'src/main1.js',
            // 模板来源
            template: 'public/index1.html',
            // 在 dist/index.html 的输出
            filename: 'index1.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: '微信管理系统1',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index1']
        }
    },
    outputDir: undefined,
    assetsDir: undefined,
    runtimeCompiler: undefined,
    productionSourceMap: false,
    parallel: undefined,
    css: undefined
}