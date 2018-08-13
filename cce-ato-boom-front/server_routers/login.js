'use strict';
const router = require('koa-router')();

router.get('/', function *() {
    var sess = this.session;
    if (sess) {
        this.redirect('/home');
    }
});

router.get('/debug', function *() {
    this.body = 'ok';
});

router.get('/login', function *() {
    this.redirect('/');
});

router.get('/index', function *() {
    yield this.render('index');
});

module.exports = router;