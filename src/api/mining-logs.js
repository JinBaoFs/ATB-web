import { fetcher } from "../utils/fetcher";

/**
 * 挖矿记录列表查询
 */
export const getMiningLogs = (data) => {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/get_mines",
        headers: {
            ...data,
        },
    });
};

/**
 * 编辑利率
 */
export const updateRate = (data) => {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/compile_mine",
        headers: {
            ...data,
        },
    });
};

/**
 * 编辑利率
 */
export const dividend = (data) => {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/distribute_mine",
        headers: {
            ...data,
        },
    });
};

/**
 * 挖矿归集状态更新
 */

export const miningStatusUpdate = (data) => {
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/request_extract_status",
        headers: {
            ...data,
        },
    });
};