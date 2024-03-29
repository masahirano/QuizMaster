FROM node:14.4.0-alpine3.12 AS node
FROM ruby:2.7.1-alpine

ENV LANG C.UTF-8

# ----- Install dependency librarlies and rubygems for the project -----

ENV ROOT_PATH /app

RUN mkdir $ROOT_PATH
WORKDIR $ROOT_PATH
ADD Gemfile $ROOT_PATH/Gemfile
ADD Gemfile.lock $ROOT_PATH/Gemfile.lock

RUN apk update && \
    apk upgrade && \
    # They're supposed to be deleted for production images at last of this RUN command
    # with `apk del .build-dependencies`
    apk add --update --no-cache --virtual=.build-dependencies \
      build-base \
      libgcc \
      curl-dev \
      linux-headers \
      libxml2-dev \
      libxslt-dev \
      postgresql-dev \
      ruby-dev \
      yaml-dev \
      zlib-dev && \
    apk add --update --no-cache \
      bash \
      git \
      openssh \
      postgresql \
      ruby-json \
      tzdata \
      libstdc++ \
      yaml && \
    gem install bundler --version 2.1.4

ADD . $ROOT_PATH

# ----- Install node -----

COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node /usr/local/bin/node /usr/local/bin/
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm && \
    ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx && \
    ln -s /usr/local/bin/node /usr/local/bin/nodejs

RUN npm --prefix client install
