FROM alpine:3.13
LABEL description="nginx  based on Alpine 3.13" \
      maintainer="daxuxu"
RUN  sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
     && apk update \
     && apk add nginx
RUN mkdir -p /home/ruoyi/projects/ruoyi-ui
RUN  mkdir -p /run/nginx/ && mkdir -p /etc/nginx/ssl/
COPY docker/test/conf/nginx.conf /etc/nginx/
COPY docker/test/ssl /etc/nginx/ssl/
COPY dist/ /home/ruoyi/projects/ruoyi-ui/
CMD nginx -g "daemon off;"
#
