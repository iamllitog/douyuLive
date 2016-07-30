var casper = require('casper').create();
var url = casper.cli.args[0];
casper.start(url);

casper.then(function() {
    this.echo(this.getTitle());
});

casper.run();