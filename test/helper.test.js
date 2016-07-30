const ArgumentError = require('../error/ArgumentError');
const helper = require('../helper');
const assert = require('chai').assert;
const del = require('del');

describe('helper', function() {
  describe('#getLastChapter()', function() {
    it('应该读不到文件', function() {
    	del.sync(['./config/lastChapter.json']);
     	var file = helper.getLastChapter();
     	assert.isNull(file);
    });
    it('应该读到文件', function() {
    	let par = {chapter:'haha',section:'gaga'};
     	helper.setLastChapter(par);
     	let chapter = helper.getLastChapter();
     	assert.deepEqual(par,chapter);
    });
  });

  describe('#setLastChapter()', function() {
  	afterEach(function() {
		del.sync(['./config/lastChapter.json']);
	});
    it('无该文件时应该成功设置章节', function() {
    	let par = {chapter:'haha',section:'gaga'};
     	helper.setLastChapter(par);
     	let chapter = helper.getLastChapter();
     	assert.deepEqual(par,chapter);
    });

    it('有该文件时应该成功设置章节', function() {
    	let par1 = {chapter:'haha',section:'gaga'};
    	let par2 = {chapter:'llaa',section:'wawa'};
     	helper.setLastChapter(par1);
     	helper.setLastChapter(par2);
     	let chapter = helper.getLastChapter();
     	assert.deepEqual(par2,chapter);
    });

    it('参数有问题时应该报错', function() {
    	let par1 = {chapter:'haha'};
    	try{
    		helper.setLastChapter(par1);	
    	}catch(e){
    		assert.instanceOf(e,ArgumentError);
    	}
    });
  });
});

