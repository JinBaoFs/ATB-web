import { fetcher } from "@/utils/fetcher";

/**
 * 代理列表
 */
export const getProxyList = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/agency_list",
    headers: {
      ...data,
      // rows: 50,
    },
  });
};

/**
 * 代理列表下拉
 */
export const getProxyListOptions = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/agency_list_check",
    headers: {
      ...data,
    },
  });
};

/**
 * 创建账号
 */
export const createAccount = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/user_password",
    headers: {
      ...data,
    },
  });
};

/**
 * 删除账号
 */
export const deleteAccount = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/user_password",
    headers: {
      ...data,
    },
  });
};


/**
 * 更新域名地址
 */
export const update_domainUrl = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/update_domainUrl",
    headers: {
      ...data,
    },
  });
};


/**
 * 重置密码
 */
export const resetPassword = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/update_nextPassword",
    headers: {
      ...data,
    },
  });
};


