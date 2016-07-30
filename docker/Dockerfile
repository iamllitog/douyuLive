FROM ubuntu:14.04
MAINTAINER litong <2212986228@qq.com>
ADD 	./software /tmp/software
RUN tar -xvf  /tmp/software/node.tar -C /var
ENV	NODE_HOME	/var/node
ENV 	PATH			$NODE_HOME/bin:$PATH
RUN tar -jxvf /tmp/software/phantomjs.tar.bz2	-C /var
ENV	PHANTOMJS_HOME		/var/phantomjs
ENV 	PATH			$PHANTOMJS_HOME/bin:$PATH

RUN sed -i 's/http:\/\/archive.ubuntu.com\/ubuntu\//http:\/\/mirrors.sohu.com\/ubuntu\//g' /etc/apt/sources.list
RUN apt-get update -y
RUN apt-get install python-software-properties -y
RUN apt-get install software-properties-common -y
RUN add-apt-repository ppa:mc3man/trusty-media -y
RUN apt-get update -y
RUN apt-get dist-upgrade -y
RUN apt-get install ffmpeg -y
RUN npm install casperjs -g
RUN rm -rf /tmp/software

RUN node -v
RUN phantomjs -v