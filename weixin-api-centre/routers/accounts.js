const router = require('koa-router')();
const parse = require('co-body');
const MongoSources = require('../common/MongoSources');
const {ACCOUNTS: ACCOUNTS_ERR_CODES} = require('../common/ErrorCodes');
const _ = require('lodash');

router.get('/accounts/info', function * () {
    let mpId = this.query.mp;
    if(!mpId) {
        this.body = ACCOUNTS_ERR_CODES.MP_MISSED;
        return;
    }
    let db = MongoSources.getAccount();
    let mp = yield db.collection('wechat_mp').findOne({_id: mpId});
    if(!mp) {
        this.body = ACCOUNTS_ERR_CODES.MP_NOT_FOUND;
        return;
    }
    this.body = mpBuild(mp);
});

router.post('/accounts/info/batchget', function * () {
    let data = yield parse(this);
    let mpList = data['mp_list'];
    if(!mpList) {
        this.body = ACCOUNTS_ERR_CODES.MP_LIST_MISSED;
        return;
    }
    let db = MongoSources.getAccount();
    this.body = (yield db.collection('wechat_mp').find({_id: {$in: mpList}}).toArray()).map(mpBuild);
});

function mpBuild(mp) {
    let info = mp.authorizer_info;
    info._id = info.id = mp._id;
    info.functions = _.map(mp.authorization_info.func_info, f=> f['funcscope_category']['id']);
    return info;
}

module.exports = router;
