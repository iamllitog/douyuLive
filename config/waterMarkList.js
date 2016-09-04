/**
 * 水印
 * @type {Array}
 */

const path = require('path');
const moment = require('moment');
var fontPath = path.join(__dirname,'../font/FZZhunYuan-M02.ttf');


module.exports = function(chapterConf){
	var arr = [];
	if(chapterConf.cntitle){
		arr.push({
			filter: 'drawtext',
			options: {
			    fontfile:fontPath,
			    fontcolor:'white',
			    text:chapterConf.cntitle,
			    y:10
			},
			inputs : ['output'],
			outputs : ['output']
		});
	}
	if(chapterConf.section){
		arr.push({
			filter: 'drawtext',
			options: {
			    fontfile:fontPath,
			    fontcolor:'white',
			    text:chapterConf.section,
			    x : 'main_w - text_w',
			    y : 'main_h - text_h*4'
			},
			inputs : ['output'],
			outputs : ['output']
		});
	}
	if(chapterConf.duration){
		let hour = moment(new Date(chapterConf.duration*1000)).utc().format('HH');
		let min = moment(new Date(chapterConf.duration*1000)).utc().format('mm');
		let sec = moment(new Date(chapterConf.duration*1000)).utc().format('ss');
		arr.push({
			filter: 'drawtext',
			options: {
			    fontfile:fontPath,
			    fontcolor:'white',
			    text : `%{pts\\\\\:hms}/${hour}\\\\\:${min}\\\\\:${sec}`,
			    x : 'main_w - text_w',
			    y : 'main_h - text_h*2'
			},
			inputs : ['output'],
			outputs : ['output']
		});
	}
	//去掉最后一个output
	delete arr[arr.length -1].outputs;

	return arr;

};