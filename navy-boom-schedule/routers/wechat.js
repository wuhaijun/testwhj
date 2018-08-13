'use strict';

const router = require('koa-router')();
const parse = require('co-body');
const config = require('config');
const _ = require('lodash');
const rp = require('request-promise');
const Account = require('../models/Account');
const Company = require('../models/Company');
const Brand = require('../models/Brand');
const WechatAccount = require('../models/WechatAccount');
const Point = require('../models/Point');
const PointArticle = require('../models/PointArticle');
const AccountUtils = require('../common/AccountUtils');
const isAgent = AccountUtils.isAgent;
const isSupplier = AccountUtils.isSupplier;

router.get('/wechat/mplist', function * () {
    let mpList = yield rp({
        url: config.get('editor_api') + '/accounts/mpList',
        method: 'POST',
        json: {
            mp_list: this.session.account.bindWechatMpList
        }
    });
    if (mpList.errcode) {
        this.body = { status: true, results: [] };
    } else {
        this.body = { status: true, results: mpList };
    }
});

router.get('/', function *() {
    let accountId = this.session.account._id;
    let account = yield Account.findOne({ _id: accountId });

    let errmsg;
    if (!account) {
        errmsg = '很抱歉,您没有权限访问。';
    }

    let roles = account.roles;
    if (!roles || !roles instanceof Array || roles.length == 0) {
        errmsg = '很抱歉,您没有权限访问。';
    }

    let wechatAccountIds = _.uniq(roles.map(it => it.wechatAccounts).reduce((v1, v2) => v1.concat(v2), []));
    if (wechatAccountIds.length == 0) {
        errmsg = '很抱歉,您没有可以查看的公众号。';
    }
    if(errmsg) {
        this.body = `<script type="text/javascript">alert("${errmsg}");location.href="http://www.brainboom.cn";</script>`;
        return;
    }
    this.redirect('/' + wechatAccountIds[0]);

});

router.get('/wechat/list', function *() {
    let accountId = this.session.account._id;
    let account = yield Account.findOne({ _id: accountId });

    let emptyResult = { status: true, results: [] };
    if (!account) {
        this.body = emptyResult;
        return;
    }

    let roles = account.roles;
    if (!roles || !roles instanceof Array || roles.length == 0) {
        this.body = emptyResult;
        return;
    }

    let wechatAccountIds = _.uniq(roles.map(it => it.wechatAccounts).reduce((v1, v2) => v1.concat(v2), []));
    if (wechatAccountIds.length == 0) {
        this.body = emptyResult;
        return;
    }

    let wechatAccounts = yield WechatAccount.find({ _id: { $in: wechatAccountIds } });
    let brands = yield Brand.find({ wechatAccounts: { $in: wechatAccountIds } });
    let companies = yield Company.find({ brands: { $in: brands.map(it => it._id) } });

    let results = companies.map(company => {
        return {
            _id: company._id,
            name: company.name,
            brands: company.brands.map(brandId => {
                let brand = brands.find(brand => brand._id.toString() == brandId);
                if (brand) {
                    return {
                        _id: brand._id,
                        name: brand.name,
                        wechatAccounts: brand.wechatAccounts.map(wechatAccountId => wechatAccounts.find(it => it._id == wechatAccountId))
                    }
                } else {
                    return {  };
                }
            })
        }
    });

    this.body = { status: true, account: account, results: results };
});

router.get('/wechat/get/', function * () {
    let wechatId = this.query.wechatId;
    let wechat = yield WechatAccount.findOne({ _id: wechatId });
    this.body = { status: true, result: wechat }
});

router.get('/point/get/', function * () {
    let pointId = this.query.pointId;
    let point = yield Point.findOne({ _id: pointId });
    this.body = { status: true, result: point }
});

router.get('/point/list', function *() {
    let accountId = this.session.account._id;
    let year = this.query.year;
    let month = this.query.month;
    let wechatId = this.query.wechatId;

    let query = { wechatId: wechatId, publishYear: year, publishMonth: month };
    let account = yield Account.findOne({ _id: accountId });
    if (isSupplier(account, wechatId) && !isAgent(account, wechatId)) {
        query['supplier'] = accountId;
    } else if (!isAgent(account, wechatId)) {
        this.body = { status: true, results: {  } };
        return;
    }

    let points = yield Point.find(query).sort({ location: 1 });
    if (points.length == 0) {
        this.body = { status: true, results: {  } };
        return;
    }

    let suppliers = yield Account.find({ _id: { $in: _.uniq(points.map(p => p.supplier)) }});
    let agents = yield Account.find({ _id: { $in: _.uniq(points.map(p => p.agent)) }});
    let pointArticles = yield PointArticle.find({ wechatId: wechatId, pointId: { $in: _.uniq(points.map(p => p._id)) } });
    let ps = [];
    points.forEach(p => {
        let supplier = suppliers.find(s => s._id == p.supplier);
        let agent = agents.find(s => s._id == p.agent);
        let hasArticle = pointArticles.find(s =>s.pointId == p._id ) ? true : false;

        p = p.toObject();
        p.supplier = supplier;
        p.agent = agent;
        p.hasArticle = hasArticle;

        ps.push(p);
    });

    let psm = _.groupBy(ps, 'publishDay');
    this.body = { status: true, results: psm };
});

router.get('/point/unArticle/list', function *() {
    let accountId = this.session.account._id;
    let publishDate = this.query.date;
    let wechatId = this.query.wechatId;

    let query = { wechatId: wechatId, publishDate: publishDate };
    let account = yield Account.findOne({ _id: accountId });
    if (isSupplier(account, wechatId) && !isAgent(account, wechatId)) {
        query['supplier'] = accountId;
    } else if (!isAgent(account, wechatId)) {
        this.body = { status: true, results: {  } };
        return;
    }

    let points = yield Point.find(query);
    let pointIds = points.map(it => it._id);

    let pointArticles = yield PointArticle.find({ wechatId, pointId: { $in: pointIds } });
    let pointIds2 = pointArticles.map(it => it.pointId);

    points = points.filter(it => pointIds2.indexOf(it._id.toString()) == -1);

    this.body = { status: true, results: points }

});

router.post('/point/add', function *() {
    let data = yield parse(this);
    let accountId = this.session.account._id;

    data.creator = accountId;
    data.agent = accountId;
    data.createdDate = new Date();

    let point = yield new Point(data).save();
    point = point.toObject();

    let supplier = yield Account.findOne({_id: point.supplier});
    point.supplier = supplier;

    this.body = { status: true, result: point };
});

router.post('/point/delete', function *() {
    let data = yield parse(this);
    let _id = data._id;
    yield Point.remove({ _id: _id });
    yield PointArticle.remove({ pointId: _id });

    this.body = { status: true };
});

router.get('/account/supplier/list', function* () {
    let wechatId = this.query.wechatId;
    let suppliers = yield Account.find({ roles: { $elemMatch: { name: 'supplier', wechatAccounts: wechatId } } }, { roles: 0 });

    this.body = { status: true, results: suppliers};
});

module.exports = router;
