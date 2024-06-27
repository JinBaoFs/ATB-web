import { fetcher } from "../utils/fetcher";

/**
 * 资产管理列表查询
 */
export const getAssetManagerList = (data) => {
    return fetcher({
      method: "POST",
      url: "api-bsc-usdt/property_admin",
      headers: {
        ...data,
      },
    });
  };

/**
 * 资产管理编辑
 */
export const assetUpdate = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/property_update",
    headers: {
      ...data,
    },
  });
};



/**
 * 资产管理导出
 */
export const exportAssetList = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/property_download",
    headers: {
      ...data,
    },
    responseType: 'blob'
  });
};