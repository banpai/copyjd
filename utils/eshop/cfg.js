/**
 * eweishop 配置文件
 */
let config = {
    'header' : {
        'content-type': 'application/x-www-form-urlencoded',
        'addons' : 'ewei_shop'
    },
};

let listsUri = {
    'login' : 'login',
    'sendCode' : 'login/sendCode',
    'replaceKey' : 'login/replaceKey',
    'slides' : 'slides',
    'categories' : 'categories',
    'carts' : 'carts',
    'products': 'products',
    'orders':'orders',
    'members':'members',
    'dispatchs':'dispatchs', 
    'addresses':'addresses',
    'wxappadvs' : 'wxappadvs',
    'topics' : 'topics',
    'commissions':'commissions',
    'qrimgs':'qrimgs'
};

// 对外提供使用。
module.exports.header = config.header;
module.exports.listsUri = listsUri;