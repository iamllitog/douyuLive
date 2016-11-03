/**
 * 各类帮助工具
 */

const fs = require('fs');
const _ = require('lodash');
const ArgumentError = require('./error/ArgumentError');
const playFileList = require('./config/playFileList');
const logger = require('./logger');

var helper = {

	/**
	 * 得到要下载的文件名
	 * @param  {object} chapter 下载章节信息
	 * @return {String}         文件名
	 */
	getChapterFileName : function(chapter){
		let fileName = '';
		if (typeof(chapter.section) === 'string'){
			fileName = chapter.section;
		}else if (typeof(chapter.section) === 'object'){
			fileName = chapter.section.fileName;
		}

		return fileName;
	},
	/**
	 * 得到最后播放章节
	 * @return {JSON} 最后章节JSON,如无此文件或数据返回null
	 */
	getLastChapter : function () {
		let file = null;
		try{
			if(fs.existsSync('./config/lastChapter.json'))
				file = fs.readFileSync('./config/lastChapter.json');
			file = JSON.parse(file);
		}catch(e){
			logger.error(e);
		}
		
		return file;
	},
	/**
	 * 得到下一次播放章节
	 * @return {JSON} 最后章节JSON,如无此文件或数据返回null
	 */
	getNextChapter : function (title,section) {
		let playFileListConf = playFileList();
		let currentPlaylistIndex = 0;
		let nowPlayList = playFileListConf.find((value, index, arr) => {
			if(value.title === title){
				currentPlaylistIndex = index;
				return true;
			}
		});
		if(_.isEmpty(nowPlayList)){
			nowPlayList = playFileListConf[0];
		}

		let currentSection = 0;
		let flag = false;
		let nowSection = nowPlayList.section.find((value, index, arr) => {
			let mySection = '';

			if (typeof(value) === 'string'){
				mySection = value;
			}else if (typeof(value) === 'object'){
				mySection = value.fileName;
			}

			if(mySection === section)	{
				currentSection = index;
				flag = true;
			}
			if(flag && index === (currentSection+1))	return true;
		})

		if(typeof nowSection === 'undefined'){
			//换盘了
			if(typeof playFileListConf[currentPlaylistIndex+1] === 'undefined')	nowPlayList = playFileListConf[0];
			else									nowPlayList = playFileListConf[currentPlaylistIndex +1];

			nowSection = nowPlayList.section[0];
		}

		
		var chapter = nowPlayList;
		chapter.chapter = nowPlayList.title;
		chapter.section = nowSection;
		return chapter;
	},
	/**
	 * 设置最后章节文件
	 * @param  {Sring} chapter 章节文件字符串
	 */
	setLastChapter : function(chapter){
		if(_.isEmpty(chapter) || _.isEmpty(chapter.chapter)  || _.isEmpty(chapter.section))
			return new ArgumentError('参数不能为空');
		fs.writeFileSync('./config/lastChapter.json',JSON.stringify(chapter));
	}
};

module.exports = helper;