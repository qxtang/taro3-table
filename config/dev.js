const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

// 监听 style.less 编译为 css
const LESSC = path.resolve(__dirname, '../node_modules/.bin/lessc');
const INPUT = path.resolve(__dirname, '../src/components/Table/style.less');
const OUTPUT = path.resolve(__dirname, '../src/components/Table/style.css');

console.log('😁 正在监听 style.less 修改');
fs.watchFile(INPUT, { interval: 1000 }, (curr, prev) => {
    console.log('💨 开始编译 style.less');
    exec(`${LESSC} ${INPUT} ${OUTPUT} -x`, (err) => {
        if (err) {
            console.log('💢 编译 style.less 出错');
            return;
        }
        console.log('✅ 编译 style.less 成功');
    });
});

module.exports = {
    env: {
        NODE_ENV: '"development"'
    },
    defineConstants: {},
    mini: {},
    h5: {
        output: {
            filename: 'js/[name].[hash:8].js',
            chunkFilename: 'js/[name].[chunkhash:8].js',
        },
    }
};
