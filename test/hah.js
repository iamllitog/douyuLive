const helper = require('../helper');
const playFileList = require('../config/playFileList');

var chapter = {"title":"youyoubaishu","cntitle":"幽游白书","starttime":87,"duration":1218,"section":"002.rmvb","chapter":"youyoubaishu"};
if(!chapter){
	//如果没有，设置playFileList中的第一个为播放文件
	chapter = playFileList[0];
	chapter.chapter = playFileList[0].title;
	chapter.section = playFileList[0].section[0];
}

let nextChapter = helper.getNextChapter(chapter.chapter,chapter.section);
console.log(nextChapter);