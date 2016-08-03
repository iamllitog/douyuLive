FROM registry.cn-hangzhou.aliyuncs.com/iamllitog/douyu_liv_env:1.0.2
MAINTAINER litong <2212986228@qq.com>

WORKDIR     /
ADD 	./software /var/software

RUN apt-get -yqq update
RUN apt-get install make gcc libfontconfig1 -y
RUN cd /var/software/python && ./configure
RUN cd /var/software/python && make
RUN cd /var/software/python && make install
RUN apt-get purge -yqq make gcc && \
	  apt-get autoremove -y && \
        apt-get clean -y && \
        rm -rf /var/lib/apt/lists