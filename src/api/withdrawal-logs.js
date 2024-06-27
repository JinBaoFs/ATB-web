import { fetcher } from "@/utils/fetcher";

/**
 * 提现记录列表查询
 */
export const getExtractList = (data) => {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/extract_log",
        headers: {
            ...data,
        },
    });
};

/**
 * 提现审核
 */
export const extractAudits = (data) => {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/extract_dispose",
        headers: {
            ...data,
        },
    });
};

/**
 * 修改提现审核
 */

export const editExtractAudits = (data) => {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/compile_extract",
        headers: {
            ...data,
        },
    });
};

/**
 * 归集记录 
 */

export const getCollList = (data)=> {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/collection_list",
        headers: {
            ...data,
        },
    });
}


/**
 * 获取拦截归集记录
 */

export const getInterceptCollList = (data)=> {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/collection_blocker",
        headers: {
            ...data,
        },
    });
}

/**
 * 修改归集记录
 */

export const editCollList = (data)=> {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/collection_compile",
        headers: {
            ...data,
        },
    });
}

/**
 * 提现记录导出
 */

export const exportExtractList = (data)=> {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/extract_download",
        headers: {
            ...data,
        },
        responseType: 'blob'
    });
}