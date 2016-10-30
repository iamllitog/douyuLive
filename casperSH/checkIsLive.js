//开始直播 并返回直播码 直播地址

var casper = require('casper').create();

var AUTH_cookie = casper.cli.args[0];

phantom.addCookie({
    name: 'acf_auth',
    value: AUTH_cookie,
    domain: 'www.douyu.com',
    path: '/',
    secure: false,
    httponly: true,
    expires: Date.now() + (1000 * 60 * 60 * 24 * 30 * 10)
});

casper.start('http://www.douyu.com/room/my?1471449002783');

casper.then(function(){
	var jsonStr = this.evaluate(function(section){
		var isLive = document.querySelectorAll('#js_start_show').length === 0;

		var jsonStr = JSON.stringify({
			isLive : isLive
		});

		return jsonStr;
	});
	this.echo(jsonStr);
	casper.exit();
});

casper.run();