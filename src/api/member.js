import { fetcher } from "@/utils/fetcher";

/**
 * 会员列表
 */
export const getMemberList = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/get_users",
    headers: {
      ...data,
    },
  });
};


/**
 * 会员列表[一键更新所有/单个用户钱包余额]
 */
export const updateUserAmount = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/update_balance",
    headers: {
      ...data,
    },
  });
};


/**
 * 归集接口
 */
export const collect = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/one_click_collection",
    headers: {
      ...data,
    },
  });
};

/**
 * 修改客户 
 */

export const editCustomer = (data) => {
  return fetcher({
    method: 'POST',
    url: '/api-bsc-usdt/update_customer',
    headers: {
      ...data
    }
  })
}

/**
 * 添加到质押矿池
 */

export const addPool = (data) => {
  return fetcher({
    method: 'POST',
    url: '/api-bsc-usdt/add_pledge',
    headers: {
      ...data
    }
  })
}

/**
 * 删除质押矿池
 */

export const deletePool = (data) => {
  return fetcher({
    method: 'POST',
    url: '/api-bsc-usdt/delete_pledge',
    headers: {
      ...data
    }
  })
}



