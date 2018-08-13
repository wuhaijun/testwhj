'use strict';
const config = require('config');
const co = require('co');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongo_uri = config.get('mongo') || 'mongodb://localhost:27017/boom';
mongoose.connect(mongo_uri);
const ProjectViewLog = require('./models/ProjectViewLog');
const Project = require('./models/Project');

co(function *() {
    let logs = yield ProjectViewLog.find({ });
    for (let i = 0; i<logs.length; i++ ) {
        try {
            let log = logs[i];
            let pid = log.id.split('#')[1];
            let project = yield Project.findOne({ _id: pid });
            if (project) {
                log.pid = pid;
                log.ptype = project.type;
                log.pfeed = project.feed;

                yield ProjectViewLog.update({_id: log.id}, {$set: log });
                console.log(log);
            } else {
                yield ProjectViewLog.remove({ _id: log.id });
                console.warn('Not found project, id=' + pid);
            }
        } catch (e) {
            console.log(e);
        }
    }
    mongoose.connection.close();
});