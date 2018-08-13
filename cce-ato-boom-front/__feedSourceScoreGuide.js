'use strict';
const co = require('co');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const elasticsearch = require('elasticsearch');

const FeedSource = require('./models/FeedSource');
const Project = require('./models/Project');

 const config = {
     mongo: 'mongodb://192.168.100.83:27017/boom',
     es: '192.168.100.83:9200'
 };

//const config = {
//   mongo: 'mongodb://boom:boom@dds-bp13d9353a884c541.mongodb.rds.aliyuncs.com:3717/boom',
//   es: '10.31.130.75:9200'
//};

co(function *() {

    mongoose.connect(config.mongo);
    let es = new elasticsearch.Client({
        host: config.es
    });

    let feedNames = ['杜绍斐', '1DayStand', 'KnowYourself', '24HOURS', '36氪', '36氪研究', 'AppSo', 'AuntieBig', 'autocarweekly', 'BESTforAD', 'BtoZMovie', 'Camelia山茶花', 'CandyBook', 'Feekr旅行', 'GameLook', 'HYPEBEAST', 'ipo观察', 'i黑马', 'Miss', 'PC6手游网', 'POCO世界手机摄影社区', 'Thomas看看世界', 'TinyMonster', 'TopMarketing', 'TOPMEN男装网', 'TOPWOMEN女装网', 'TripAdvisor猫途鹰', 'Twippo法国时尚', 'UI头条', 'Vista看天下', 'Voicer', 'WeLens', 'Wind资讯', 'YOHOGIRL', '艾问人物', '巴洛克原创设计', '半月谈', '包先生', '北大新媒体', '别瞎玩', '伯乐电影观察', '财经连环话', '财经天下周刊', '插画师', '差评', '蝉创意', '车聚网', '车云', '车辙', '创意C站', '创意铺子', '大家', '大象公会', '呆獭打折', '动漫宅说', '独立鱼电影', '反派影评', '冯仑风马牛', '凤凰网', '高冷门诊部', '古典书城', '古田路9号', '广告常识', '广告行销', '闺蜜网Kimiss', '海豹和小章鱼', '胡渣少女', '虎嗅网', '互联网观察', '互联网热点', '互联网思维', '华尔街见闻', '黄小厨', '混沌大学', '极客公园', '极客中国', '集思录', '几何民宿', '假杂志', '界面', '借宿', '金融读书会', '金融混业观察', '菁城子', '静Design', '开始吧', '阑夕', '老道消息', '黎贝卡的异想世界', '李叫兽', '鲤鱼电影手册', '利器', '利维坦', '良仓', '零一特工队', '六神磊磊读金庸', '罗辑思维', '旅行家杂志', '旅游约吗', '馒头商学院', '梅花网', '美豆爱厨房', '美丽也是技术活', '美食工场', '美食工坊', '美芽', '迷影网Cinephilia', '名车志Daily', '摩尔芯闻', '魔镜Beautylab', '木木老贼', '幕星社', '你丫才美工', '偶见', '排气管', '澎湃新闻', '平面设计', '柒伽社', '气球馆', '汽车圈by中国青年报', '汽车商业评论', '汽车洋葱圈', '求是设计会', '全球摄影人档案', '人民攻摄', '人民日报', '人人都是产品经理', '日本旅游攻略', '日食记', '如是娱乐法', '少数派', '设计与创意', '深焦DeepFocus', '深夜发媸', '钛媒体', '腾讯动漫官方', '田螺姑娘hhhaze', '同道大叔', '图虫网', '外婆的灶台', '网易投', '网易阴阳师手游', '文案与美术', '纹身大咖', '沃顿商业', '吾皇万睡', '吾造创意设计工作室', '小墨与阿猴', '新片场', '新周刊', '休克文案', '徐老师视频', '言安堂', '央视新闻', '一点儿也不宅', '一人食', '英雄小助手', '营销创意官', '游戏百晓生', '游戏观察', '游戏研究社', '于小戈', '月出风暴', '赞那度旅行人生', '造洋饭书', '这个漫画有妖气', '知乎日报', '知日', '智谷趋势', '智能帮', '中国企业家杂志', '妆你妹'];

    let feeds = yield FeedSource.find({ name: { $in: feedNames } });

    console.log(`Update weight for ${ feeds.length } feed source.`);


    for (let i=0; i< feeds.length; i++) {
        let feed = feeds[i];
        let weight = feed.weight || {};
        let score = weight.score || 0;
        let subscribed = weight.subscribed || 0;

        weight.guide_recommend = 1;
        weight.score = 100 + subscribed * 10;

        yield FeedSource.update({ _id: feed._id }, { $set: { weight: weight } });
        yield es.update({
            index: 'boom',
            type: 'feedsource',
            id: feed._id.toString(),
            body: {
                doc: {
                    weight: weight
                },
                "doc_as_upsert" : true
            }
        });
        console.log(`Complete update ${ feed.name } score to ${ weight.score }.`);
    }


    mongoose.connection.close();
});