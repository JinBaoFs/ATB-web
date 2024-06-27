import { fetcher } from "../utils/fetcher";

/**
 * 登录
 */
export const userLogin = (data) => {
  return fetcher({
    method: "POST",
    url: "api/login",
    headers: {
      ...data,
    },
  });
};

/**
 * 修改推荐关系
 */
export const editRelation = (data) => {
  return fetcher({
    method: "POST",
    url: "api/access_record_list",
    headers: {
      ...data,
    },
  });
};

/**
 * 修改token状态
 */
export const updateTokenStatus = (data) => {
  return fetcher({
    method: "POST",
    url: "api/yield_control",
    headers: {
      ...data,
    },
  });
}

/**
 * 获取ATB币状态
 */
export const getTokenStatus = (data) => {
  return fetcher({
    method: "POST",
    url: "api/yield_control_status",
    headers: {
      ...data,
    },
  });
};



