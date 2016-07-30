/**
 * 入口文件
 */

const helper = require('./helper');
const playFileList = require('./config/playFileList')();
const downloadHandle = require('./downloadHandle');
const videoHandle = require('./videoHandle');
const del = require('del');
var starttime = new Date().getTime();

//1.读取上次章节播放
var chapter = helper.getLastChapter();
if(!chapter){
	//如果没有，设置playFileList中的第一个为播放文件
	chapter = playFileList[0];
	chapter.chapter = playFileList[0].title;
	chapter.section = playFileList[0].section[0];
	helper.setLastChapter(chapter);
}

function loopLogic(currentChapter) {
	return Promise.all([
		videoHandle.pushStream(currentChapter),
		new Promise((reslove,reject) => {
			let nextChapter = helper.getNextChapter(currentChapter.chapter,currentChapter.section);
			return downloadHandle.downloadByCS(nextChapter.chapter,nextChapter.section).then(() =>{
				helper.setLastChapter(nextChapter);
				reslove(nextChapter);
			});
		})
	]).then(([unuseful,nextChapter]) => {
		del([`${__dirname}/data/${chapter.section}`]);
		chapter = nextChapter;
		return loopLogic(nextChapter);
	});
}

//2.根据读取到的章节去百度云盘上去数据
downloadHandle.downloadByCS(chapter.chapter,chapter.section).then(function () {
	console.log('download finish');
}).then(() => {
	console.log('开始直播！！！');
	return loopLogic(chapter);
}).catch(function (err){
	console.log(err);
});