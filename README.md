# Web page Content Extractor API (wce-api)
---

REST API over the Web page Content Extractor (wce) [node module](https://www.npmjs.com/package/wce).

Currently works with the following extractors:

1. [readability.com's Parser API](https://www.npmjs.com/package/readability-api)
2. [read-art](https://www.npmjs.com/package/read-art)
3. [node-readablity](https://github.com/arrix/node-readability)
4. [node-unfluff](https://github.com/ageitgey/node-unfluff)
5. [wce-proxy](https://github.com/mxr576/webpage-content-extractor#wce-proxy)

For detailed information, please check the [Webpage Content Extractor](https://github.com/mxr576/webpage-content-extractor) module's Github page.

### Usage example

```sh
git clone https://github.com/mxr576/webpage-content-extractor-api.git wce-api
node wce-api/index.js
```

### Docker usage example

Build the image on your local machine:

```sh
git clone https://github.com/mxr576/webpage-content-extractor-api.git wce-api
cd wce-api/docker
docker build -t mxr576/wce-api .
```

or pull the pre-built image from Dockerhub

```sh
docker pull mxr576/wce-api
```

then start a new container:

```sh
docker run -id -p 8001:8001 --name wce-api -t mxr576/wce-api
```

### About the settings

The extractor listen on the 8001 port, by default. You can test it via [http://127.0.0.1:8001/?url=http://cnn.com](http://127.0.0.1:8001/?url=http://cnn.com).

The default extractor is read-art. You can change this in the **config/default.json** file or you can override it with environment specific settings, for example in **conf/development.json** . As you can see, you can specify multiple extractor in the config file. The order of the extractors is important, because the first one will be the primary extractor and the second one will be its fallback, when the first can not extract the content of an URL.

If you would like to use the readablity.com's Parser, then you have to set up your access token in the config file beforehand. You can clain your Parser key [here](https://www.readability.com/developers/).

### Licence
[Apache Licence 2.0](https://tldrlegal.com/license/apache-license-2.0-%28apache-2.0%29)
