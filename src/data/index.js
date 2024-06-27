import { SearchFormItemEnum } from '../enum'
export const formItemMap = {
    [SearchFormItemEnum.USER_ADDRESS]: {
        // name: SearchFormItemEnum.USER_ADDRESS,
        name: "address",
        label: '用户地址',
    },
    [SearchFormItemEnum.TITLE]: {
        // name: SearchFormItemEnum.USER_ADDRESS,
        name: "title",
        label: '标题',
    },
    [SearchFormItemEnum.ID]: {
        // name: SearchFormItemEnum.ID,
        name: "id",
        label: '用户ID',
    },
    [SearchFormItemEnum.NID]: {
        // name: SearchFormItemEnum.ID,
        name: "id",
        label: 'ID',
    },
    [SearchFormItemEnum.PROXY]: {
        // name: SearchFormItemEnum.PROXY,
        name: "agency",
        label: '代理',
    },
    [SearchFormItemEnum.PROXY_ACCOUNT]: {
        name: SearchFormItemEnum.PROXY_ACCOUNT,
        label: '代理账号',
    },
    [SearchFormItemEnum.CLIENT_DOMAIN]: {
        name: SearchFormItemEnum.CLIENT_DOMAIN,
        label: '客户域名',
    },
    [SearchFormItemEnum.DOMAIN]: {
        name: "domainUrl",
        label: '域名',
    },
    [SearchFormItemEnum.ACCOUNT_NO]: {
        name: "checkId",
        label: '账单编号',
    },
    [SearchFormItemEnum.AUTH_STATUS]: {
        // name: SearchFormItemEnum.AUTH_STATUS,
        name: "authorizationSystem",
        label: '授权状态',
        options: [
            {
                value: '1',
                label: '未授权',
            },
            {
                value: '0',
                label: '已授权',
            },
        ],
    },
    [SearchFormItemEnum.USER_TYPE]: {
        // name: SearchFormItemEnum.AUTH_STATUS,
        name: "mineType",
        label: '用户类型',
        options: [
            {
                value: '1',
                label: '高级',
            },
            {
                value: '0',
                label: '普通',
            },
        ],
    },
    [SearchFormItemEnum.SORT_BY]: {
        // name: SearchFormItemEnum.SORT_BY,
        name: "capitalType",
        label: '排序方式',
        options: [
            {
                value: 0,
                label: '不排序',
            },
            {
                value: 1,
                label: '按资金倒序排序',
            },
        ],
    },
    [SearchFormItemEnum.MINING_TYPE]: {
        name: 'collectionType',
        label: '挖矿类型',
        options: [
            {
                value: "0",
                label: '流动性挖矿',
            },
            {
                value: "1",
                label: '质押挖矿',
            },
        ],
    },
    [SearchFormItemEnum.COLLECT_STATUS]: {
        name: 'collectionStatus',
        label: '归集状态',
        options: [
            {
                value: "1",
                label: '未归集',
            },
            {
                value: "0",
                label: '已归集',
            },
        ],
    },
    [SearchFormItemEnum.CHAIN_TYPE]: {
        name: SearchFormItemEnum.CHAIN_TYPE,
        label: '链类型',
        options: [
            {
                value: '链类型1',
                label: '链类型1',
            },
        ],
    },
    [SearchFormItemEnum.STATUS]: {
        name: SearchFormItemEnum.STATUS,
        label: '状态',
        options: [
            {
                value: '0',
                label: '进行中',
            },
            {
                value: '1',
                label: '已归集',
            },
        ],
    },
    [SearchFormItemEnum.ASSETS_TYPE]: {
        name: SearchFormItemEnum.ASSETS_TYPE,
        label: '资产类型',
        options: [
            {
                value: '资产类型1',
                label: '资产类型1',
            },
        ],
    },
    [SearchFormItemEnum.CASH_FLOW_TYPE]: {
        name: 'type',
        label: '收支类型',
        options: [
            {
                value: 0,
                label: '收入',
            },
            {
                value: 1,
                label: '支出',
            },
        ],
    },
    [SearchFormItemEnum.DIVIDEND_TYPE]: {
        name: SearchFormItemEnum.DIVIDEND_TYPE,
        label: '派息类型',
        options: [
            {
                value: '派息类型1',
                label: '派息类型1',
            },
        ],
    },
    [SearchFormItemEnum.ASSETS_NAME]: {
        name: SearchFormItemEnum.ASSETS_NAME,
        label: '资产名称',
    },
    [SearchFormItemEnum.COIN_NAME]: {
        name: SearchFormItemEnum.COIN_NAME,
        label: '币种名称',
        options: [
            {
                value: '币种名称1',
                label: '币种名称1',
            },
        ],
    },
    [SearchFormItemEnum.WITHDRAW_STATUS]: {
        name: 'extractStatus',
        label: '审核状态', // 审核状态
        options: [
            {
                value: '0',
                label: '成功',
            },
            {
                value: '1',
                label: '审核中',
            },
            {
                value: '2',
                label: '失败',
            },
        ],
    },
    [SearchFormItemEnum.SETTLE_STATUS]: {
        name: SearchFormItemEnum.SETTLE_STATUS,
        label: '到账状态',
        options: [
            {
                value: '0',
                label: '已到账',
            },
            {
                value: '1',
                label: '未到账',
            },
        ],
    },
    [SearchFormItemEnum.DOMAIN_STATUS]: {
        name: "systemType",
        label: '域名状态',
        options: [
            {
                value: '0',
                label: '开启',
            },
            {
                value: '1',
                label: '关闭',
            },
        ],
    },
    [SearchFormItemEnum.DATE]: {
        name: SearchFormItemEnum.DATE,
        label: '日期'
    },
};