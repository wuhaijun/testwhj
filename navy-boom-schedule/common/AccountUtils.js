/**
 * Created by Boyce on 17/11/3.
 */

const isSupplier = (account, wechatId) => {
    let wechatRoles = getWechatRoles(account, wechatId);
    let supplierRoles = wechatRoles.filter(it => it.name == 'supplier');
    return supplierRoles && supplierRoles.length != 0;
};

const isAgent = (account, wechatId) => {
    let wechatRoles = getWechatRoles(account, wechatId);
    let supplierRoles = wechatRoles.filter(it => it.name == 'agent');
    return supplierRoles && supplierRoles.length != 0;
};

let getWechatRoles = (account, wechatId) => {
    let roles = (account && account.roles) || [];
    let wechatRoles = roles.filter(it => it.wechatAccounts.indexOf(wechatId) != -1);
    return (wechatRoles && wechatRoles.length != 0) ? wechatRoles : [];
};

module.exports = { isSupplier, isAgent };