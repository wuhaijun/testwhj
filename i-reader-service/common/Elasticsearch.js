'use strict';

const ESClientFactory = require('./ESClientFactory');

function Elasticsearch(indexName, type) {
    this.indexName = indexName;
    this.type = type;

    this.client = ESClientFactory.get();

    this.bulk = [];
}

Elasticsearch.prototype.deleteIndex = function() {
    return this.indexExists(this.indexName).then(exists => {
        if (exists) {
            return this.client.indices.delete({
                index: this.indexName
            });
        } else {
            return Promise.reject(new Error(`${this.indexName} not exists.`));
        }
    });
};

Elasticsearch.prototype.initIndex = function() {
    return this.indexExists(this.indexName).then(exists => {
        if (!exists) {
            return this.client.indices.create({
                index: this.indexName
            });
        } else {
            return Promise.reject(new Error(`can not init multi ${this.indexName}.`));
        }
    });
};

Elasticsearch.prototype.indexExists = function() {
    return this.client.indices.exists({
        index: this.indexName
    });
};

Elasticsearch.prototype.initMapping = function(mapping) {
    return this.indexExists(this.indexName).then(exists => {
        if (exists) {
            return this.client.indices.putMapping({
                index: this.indexName,
                type: this.type,
                body: {
                    properties: mapping
                }
            });
        } else {
            return Promise.reject(new Error(`${this.indexName} not exists.`));
        }
    });
};

Elasticsearch.prototype.addDocument = function(document) {
    return this.indexExists(this.indexName).then(exists => {
        if (exists) {
            return this.client.index({
                index: this.indexName,
                type: this.type,
                id: document.id,
                body: document,
                refresh: true
            });
        } else {
            return Promise.reject(new Error(`${this.indexName} not exists.`));
        }
    });
};

Elasticsearch.prototype.count = function() {
    return this.client.count({
        index: this.indexName,
        type: this.type
    });
};

Elasticsearch.prototype.searchAll = function() {
    return this.search({
        match_all:{}
    });
};

Elasticsearch.prototype.search = function(query, size=10, sort) {
    return this.client.search({
        index: this.indexName,
        type: this.type,
        size: size,
        body: {
            query: query,
            sort: sort
        }
    });
};

Elasticsearch.prototype.group = function(query, aggs) {
    let body = {};
    if (query) body.query = query;
    if (aggs) body.aggs = aggs;

    return this.client.search({
        index: this.indexName,
        type: this.type,
        body: body
    });
};

Elasticsearch.prototype.execute = function() {
    let promise = this.client.bulk({
        body : this.bulk
    });
    this.bulk = [];

    return promise;
};

Elasticsearch.prototype.batch = function(document) {
    this.bulk.push({index: {_index: this.indexName, _type: this.type, _id: document.id}});
    this.bulk.push(document);
};

module.exports = Elasticsearch;

