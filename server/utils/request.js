'use strict'

const urlParse = require('url').parse;
const JSONbig = require('json-bigint');
const chalk = require('chalk');
const request = require('request');

module.exports = function (method, url, params, headers, callback) {
    headers.host = urlParse(url).host; // 不修改 host 会502
    const options = {
        url: url,
        headers: headers,
        gzip:true
    };
    if (method === 'post' && headers['content-type'] === 'application/json') {
        options.body = JSONbig.stringify(params);
    } else {
        options.form = params;
    }
    console.log(chalk.bgRed('[请求' + method.toUpperCase() +  ']'), chalk.red(url), chalk.red(JSONbig.stringify(params))); // eslint-disable-line no-console

    request[method](options, function (err, res, result) {
        if (err) {
            console.log(chalk.red('发送请求失败:'), err); // eslint-disable-line no-console
            callback(err);
            return;
        }
        try {
            result = JSONbig.stringify(JSONbig.parse(result),null,4);
            callback.call(res, null, JSONbig.parse(result));
        } catch (ex) {
            console.log(chalk.red('数据转JSON失败:'), ex); // eslint-disable-line no-console
            callback(ex);
        }
    });
}
