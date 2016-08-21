/**
 * 直播助手
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

module.exports = {
	/**
	 * 开始直播并返回直播信息
	 * @return {Promise}         直播信息
	 */
	startLiveAndGetInfo : function () {
		return new Promise((reslove,reject) => {
		  	let ls = exec(`casperjs ./casperSH/startlive.js ${baseConfig.cookie_ACFAUTH}`,{
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
					logger.error(e);
					reject(e);
					return;
				}

				if(downloadInfo.rtmpUrl && downloadInfo.rtmpCode)	reslove(downloadInfo);
		  	});
		});
	}
};