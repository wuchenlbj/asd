// 配置文件12.25 lbq
var path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}
const port = 9524
 const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const markdownRender = require('markdown-it')()

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production' ?
    '/' :
    '/'

module.exports = {
    publicPath: BASE_URL,
    outputDir: 'dist',
    assetsDir: 'static',
    // 如果你不需要使用eslint，把lintOnSave设为false即可
    lintOnSave: process.env.NODE_ENV !== 'production',
    // 设为false打包时不生成.map文件
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        }
    },
    configureWebpack: (config) => {
        // 删除console插件
        let plugins = [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true,
                        drop_debugger: true
                    },
                    output: {
                        // 去掉注释内容
                        comments: false
                    }
                },
                sourceMap: false,
                parallel: true
            })
        ]
        // 只有打包生产环境才需要将console删除
        if (process.env.VUE_APP_build_type == 'production') {
            config.plugins = [...config.plugins, ...plugins]
        }
    },
    // 允许对内部的 webpack 配置进行更细粒度的修改。
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('api', resolve('src/api'))
            .set('views', resolve('src/views'))
            .set('utils', resolve('src/utils'))
            .set('_c', resolve('src/components'))
            .set('assets', resolve('src/assets'))
            .set('styles', resolve('src/assets/css'))
            .set('common',resolve('src/components/Common'))
        // 打包文件带hash
        config.output.filename('[name].[hash].js').end()

        // config.module.rule('svg').uses.clear()
        // 配置svg图标
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
        config.module
            .rule('md')
            .test(/\.md$/)
            .use('vue-loader')
            .loader('vue-loader')
            .end()
            .use("vue-markdown-loader")
            .loader('vue-markdown-loader/lib/markdown-compiler')
            .options({
                raw: true,
                use: [
                    [require('markdown-it-anchor'), {
                        level: 2, // 添加超链接锚点的最小标题级别, 如: #标题 不会添加锚点
                        permalink: true, // 开启标题锚点功能
                        permalinkBefore: true // 在标题前创建锚点
                    }],
                    // 'markdown-it-container'的作用是自定义代码块
                    [require('markdown-it-container'), 'demo', {
                        validate: function(params) {
                            return params.trim().match(/^demo\s*(.*)$/)
                        },
                        // 自定义渲染方法,这里为核心代码
                        render: function(tokens, idx) {
                            var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
                            // nesting === 1表示标签开始
                            if (tokens[idx].nesting === 1) {
                                // 获取正则捕获组中的描述内容,即::: demo xxx中的xxx
                                var description = (m && m.length > 1) ? m[1] : ''
                                // 获得内容
                                var content = tokens[idx + 1].content
                                // 解析过滤解码生成html字符串
                                var html = convert(striptags.strip(content, ['script', 'style'])).replace(/(<[^>]*)=""(?=.*>)/g, '$1')
                                // 获取script中的内容
                                var script = striptags.fetch(content, 'script')
                                // 获取style中的内容
                                var style = striptags.fetch(content, 'style')
                                // 组合成prop参数,准备传入组件
                                var jsfiddle = { html: html, script: script, style: style }
                                // 是否有描述需要渲染
                                var descriptionHTML = description ?
                                    md.render(description) :
                                    ''
                                // 将jsfiddle对象转换为字符串,并将特殊字符转为转义序列
                                jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle))
                                // 起始标签,写入demo-block模板开头,并传入参数
                                return `<code-show class="demo-box" :jsfiddle="${jsfiddle}">
													<div class="source" slot="source">${html}</div>
													${descriptionHTML}
													<div class="highlight" slot="highlight">`
                            }
                            // 否则闭合标签
                            return '</div></code-show>\n'
                        }
                    }],
                    [require('markdown-it-container'), 'tip'],
                    [require('markdown-it-container'), 'warning']
                ],
                // 定义处理规则
                preprocess: function(MarkdownIt, source) {
                    // 对于markdown中的table,
                    MarkdownIt.renderer.rules.table_open = function() {
                        return '<table class="table">'
                    }
                    // 对于代码块去除v-pre,添加高亮样式
                    // MarkdownIt.renderer.rules.fence = wrap(MarkdownIt.renderer.rules.fence)
                    return source
                }
            })
            .end()
        // 分析优化插件
        if (process.env.NODE_ENV === 'production') {
            config.plugin('webpack-report')
                .use(BundleAnalyzerPlugin, [{
                    analyzerPort: 9598
                }])
        }
    }
}