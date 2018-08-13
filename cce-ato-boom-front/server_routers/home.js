'use strict';
const router = require('koa-router')();
const Slider = require('../models/Slider');

router.get('/api/slider/list', function *() {
    let version = this.query.version;
    let sliders = yield Slider.find({ version: version });
    this.body = sliders;
});

module.exports = router;