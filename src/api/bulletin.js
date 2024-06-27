import { fetcher } from "@/utils/fetcher";

/**
 * 所有公告列表
 */
export const getBulletinList = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/get_bulletins",
    headers: {
      ...data,
    },
  });
};

/**
 * 发布公告
 */
export const crateBulletin = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/create_bulletin",
    headers: {
      ...data,
    },
  });
};

/**
 * 编辑公告
 */
export const updateBulletins = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/update_bulletins",
    headers: {
      ...data,
    },
  });
};

/**
 * 删除公告
 */
export const removeBulletins = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/delete_bulletins",
    headers: {
      ...data,
    },
  });
};

/**
 * 删除公告
 */
export const getBulletin = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/select_bulletin",
    headers: {
      ...data,
    },
  });
};
