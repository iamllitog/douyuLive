/**
 * 下载助手
 */
const _ = require('lodash');
const exec = require('child_process').exec;
const ArgumentError = require('./error/ArgumentError');
const myLog = require('./myLog');
const download = require('download');
const unzip = require('unzip');
const del = require('del');
const fs = require('fs');
const baseConfig = require('./config/baseConfig');

//得到下载文件信息
function __getDownloadFileInfo(chapter,section) {
	return new Promise((reslove,reject) => {
	  	let ls = exec(`casperjs ./casperSH/downloadFile.js ${chapter} ${section} ${baseConfig.cookie_BDUSS} ${baseConfig.cookie_STOKEN}`,(error,stdout,stderr) => {
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
				myLog.error(e);
				reject(e);
				return;
			}
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
		return __getDownloadFileInfo(chapter,section)
		.then((downloadInfo) =>{
			//下载
			return download(downloadInfo.url,{
				headers : downloadInfo.headers
			}).then(data => {
				fs.writeFileSync(`${__dirname}/data/${section}.zip`, data);
			});
		}).then(() => {
			console.log('下载完成');
			//解压到data根目录
			return new Promise((reslove,reject) => {
				let flag = true;
				let stream = null
				fs.createReadStream(`${__dirname}/data/${section}.zip`)
					.pipe(unzip.Parse())
					.on('entry', function (entry) {
						let filePath = entry.path;
				    		let type = entry.type; // 'Directory' or 'File' 
				    		if (filePath.indexOf(`${chapter}/${section}/${section}`) > 0 && type === 'File') {
				      			stream = entry.pipe(fs.createWriteStream(`${__dirname}/data/${section}`));
				      			stream.on('finish', function () {
				      				reslove();
				      			});
				      			stream.on('error', function (err) {
				      				if(err)	reject(err);
				      			});
				   	 	} else {
				      			entry.autodrain();
				    		}
				  	});
			});
		}).then(() =>{
			//删除源文件
			return del([`${__dirname}/data/${section}.zip`]);
		});
	}
};