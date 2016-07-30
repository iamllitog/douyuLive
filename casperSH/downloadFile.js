
var casper = require('casper').create();

var chapter = casper.cli.args[0];
var section = casper.cli.args[1];
var BDUSS_cookie = casper.cli.args[2];
var STOKEN_cookie = casper.cli.args[3];

phantom.addCookie({
    name: 'BDUSS',
    value: BDUSS_cookie,
    domain: '.baidu.com',
    path: '/',
    secure: false,
    httponly: true,
    expires: Date.now() + (1000 * 60 * 60 * 24 * 30 * 10)
});

phantom.addCookie({
    name: 'STOKEN',
    value: STOKEN_cookie,
    domain: '.pan.baidu.com',
    path: '/',
    secure: false,
    httponly: true,
    expires: Date.now() + (1000 * 60 * 60 * 24 * 30 * 10)
});



var hasDownloadFlag = false;
var headers = null;


casper.start('http://pan.baidu.com/disk/home#list/path=%2FdouyuLive');

//打开章
casper.viewport(1024, 10000).thenEvaluate(function(chapter){
  var elements = document.querySelectorAll('div.list-view-container .list-view dd.list-view-item');
  
  for (var i = elements.length - 1; i >= 0; i--) {
  	var filenameTag = elements[i].querySelector('a.filename');
  	if(filenameTag.getAttribute('title') === chapter){
  		$(filenameTag).click();
  		return;
  	}
  }
},{
    chapter: chapter
});
//下载节
casper.wait(10000,function(){
	this.evaluate(function(section){
		var elements = document.querySelectorAll('div.list-view-container .list-view dd.list-view-item');
		
	  for (var i = elements.length - 1; i >= 0; i--) {
	  	var filenameTag = elements[i].querySelector('a.filename');
	  	if(filenameTag.getAttribute('title') === section){
	  		var clickBt = elements[i].querySelector('.operate .icon-download-blue[title=下载]');

	  		$(clickBt).click();
	  		break;
	  	}
	  }
	},{
		section : section
	});
	
});

casper.then(function () {
  casper.on('resource.requested', function (request) {
    if(hasDownloadFlag) return;
     if ((request.url.indexOf("www.baidupcs.com/rest/2.0/pcs/file") !== -1)  || (request.url.indexOf("yqall02.baidupcs.com/file") !== -1)) {
        headers = request.headers;
     }
 });
   
  casper.on('resource.received', function (resource) {
    if(hasDownloadFlag) return;
     if (((resource.url.indexOf("www.baidupcs.com/rest/2.0/pcs/file") !== -1)  || (resource.url.indexOf("yqall02.baidupcs.com/file") !== -1)) && resource.status == 200) {
        hasDownloadFlag = true;
        var downloadInfo = {};
        downloadInfo.headers = headers;
        downloadInfo.url = resource.url;
        this.echo(JSON.stringify(downloadInfo));
        casper.exit();
     }
 });
});

//等待一分钟下载链接
casper.wait(60000);

casper.run();