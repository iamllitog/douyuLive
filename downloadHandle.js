/**
 * 下载助手
 */
const _ = require('lodash');
const exec = require('child_process').exec;
const ArgumentError = require('./error/ArgumentError');
const logger = require('./logger');
const download = require('download');
const unzip = require('unzip');
const del = require('del');
const fs = require('fs');
const baseConfig = require('./config/baseConfig');

//得到下载文件信息
function __getDownloadFileInfo(chapter,section) {
	if (!fs.existsSync('data')) {
		fs.mkdirSync('data')
	}
	return new Promise((reslove,reject) => {
		logger.info(`开始读取下载信息: ${chapter} ${section} `);
	  	let ls = exec(`casperjs ./casperSH/downloadFile.js ${chapter} ${section} ${baseConfig.cookie_BDUSS} ${baseConfig.cookie_STOKEN}`,{
	  		timeout : 1000 * 60 * 3
	  	},(error,stdout,stderr) => {
	  		if (error ) {
				reject(error);
				return;
			}
			if(stderr){
				reject(new Error(`stderr:${stderr}`));
			}
			let downloadInfo = null;
			try{
				downloadInfo = JSON.parse(stdout);
			}catch(e){
				logger.error(`下载失败信息:${stdout}`);
				logger.error(e);
				reject(e);
				return;
			}
			logger.info(`读取下载信息成功: ${chapter} ${section} `);
			let headersObj = {};
			let headersArr = downloadInfo.headers;
			for (let index in headersArr) {
				let name = headersArr[index].name;
				let value = headersArr[index].value;
				headersObj[name] = value;
			}
			downloadInfo.headers = headersObj;

			if(downloadInfo.url && downloadInfo.headers)	reslove(downloadInfo);
	  	});
	})
}

module.exports = {
	/**
	 * 根据章节下载文,仅支持图片和文件夹下载
	 * @param  {String} chapter 章
	 * @param  {String} section 节
	 * @return {Promise}         返回对应文件是否下载成功
	 */
	downloadByCS : function (chapter,section) {
		logger.info(`开始下载:${section}.zip`);
		return __getDownloadFileInfo(chapter,section)
		.then((downloadInfo) =>{
			//下载
			return download(downloadInfo.url,{
				headers : downloadInfo.headers,
				timeout : 1000*60*20,
				retries : 2
			}).then(data => {
				logger.info(`写入:${__dirname}/data/${section}.zip`);
				fs.writeFileSync(`${__dirname}/data/${section}.zip`, data);
			});
		}).then(() => {
			logger.info(`下载完成:${section}.zip`);
			if(!fs.existsSync(`${__dirname}/data/tmp/`))
				fs.mkdirSync(`${__dirname}/data/tmp/`);
			//解压到data根目录
			return new Promise((reslove,reject) => {
				let flag = true;
				fs.createReadStream(`${__dirname}/data/${section}.zip`)
					.pipe(unzip.Extract({ path:`${__dirname}/data/tmp` }))
  					.on('finish', function () {
  						logger.info(`解压完成`);
  						reslove();
  					})
  					.on('error', function (err) {
  						reject(err);
  					});
			});
		}).then(() =>{
			fs.renameSync(`${__dirname}/data/tmp/douyuLive/${chapter}/${section}`, `${__dirname}/data/${section}`);
			//删除源文件
			return del([`${__dirname}/data/tmp/`,`${__dirname}/data/${section}.zip`]);
		});
	}
};