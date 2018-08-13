const _ = require('lodash');

function getPagination(page, pageSize, count) {
    let offset = (page - 1) * pageSize;
    let maxPage = _.toInteger((count - 1)/pageSize) + 1;
    let hasNext = page < maxPage;
    let hasPrev = page > 1;
    let nextPage = hasNext ? (page + 1) : null;
    let prevPage = hasPrev ? (page - 1) : null;
    return {
        page,
        pageSize,
        count,
        offset,
        maxPage,
        hasPrev,
        hasNext,
        prevPage,
        nextPage
    };
}

module.exports = {
    getPagination
}