'use strict';
const Editor135Downloader = require('./downloader/Editor135Downloader');
const config = require('config');
const MongoConnection = require('./common/MongoConnection');

async function a() {
    await MongoConnection.connect(config.get("mongo.styleDB"), 'style');
    const a = new Editor135Downloader();
    a.generatorRequestUrls();
    await a.request();
}

a();