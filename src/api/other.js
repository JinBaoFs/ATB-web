import { fetcher } from "../utils/fetcher";

/**
 * 资金明细列表查询
 */
export const getFundDetailsList = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/get_capitall_log",
    headers: {
      ...data,
    },
  });
};


/**
 * 导出资金米西
 */
export const exportFundDetailsList = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/get_capitall_log_download",
    headers: {
      ...data,
    },
    responseType: 'blob'
  });
};


/**
 * 登录
 */
export const userLogin = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/login",
    headers: {
      ...data,
    },
  });
};

/**
 * 登录日志
 */
export const userLoginLog = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/login_log",
    headers: {
      ...data,
    },
  });
};

/**
 * 池子信息汇总
 */
export const collect_number = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/collect_number",
    headers: {
      ...data,
    },
  });
};

/**
 * 授权记录列表
 */
export const authLog_list = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/authLog_list",
    headers: {
      ...data,
    },
  });
};

/**
 * 查询访问记录
 */
export const access_record_list = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/access_record_list",
    headers: {
      ...data,
    },
  });
};

/**
 * 首页
 */
export const getHomeData = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/home",
    headers: {...data},
  });
};

/**
 * 获取派息记录
 */
export const getInterList = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/distribute_list",
    headers: {
      ...data
    },
  });
};
