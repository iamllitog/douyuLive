一，命令功能
启动（设置串码,rtmp地址,播放序列章节）
关闭

二，设置功能
设置播放序列（章-节）
设置水印文字（绝对布局 + 颜色 + 大小）

三，主流成、
1.初始化百度云盘（casper.js）
	需要全局（-g）安装PhantomJS,casperjs
2.读取上次章节播放
3.读取上次序列
4.下载当前序列视频
loop begin
5.下载下一序列视频
6.将串码和rtmp地址给ffmpeg
7.播放视频
loop end

四，参考文档
http://www.360doc.com/content/15/1227/23/597197_523577418.shtml

五，难点
1.切换流时的合并流问题（filter concat）

六，构建步骤
1.监听master分支变化 或 定时监听任务
2.合并配置文件
3.打包docker
4.测试
5.上传到dockerhub
6.发布运行