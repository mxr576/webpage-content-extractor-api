FROM node:0.12

MAINTAINER  Dezső BICZÓ "mxr576@gmail.com"

RUN apt-get update && \
  apt-get install -y git supervisor && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/mxr576/webpage-content-extractor-api.git wce-api && \
  cd wce-api && \
  npm install

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY start.sh /start.sh

RUN chmod +x /start.sh

EXPOSE 8001

ENV GIT_BRANCH master
ENV NODE_ENV production
ENV NODE_LOG_LEVEL error

VOLUME ["/var/log/supervisor/"]

CMD ["/bin/bash", "-c", "/start.sh"]
