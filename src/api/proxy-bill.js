import { fetcher } from "@/utils/fetcher";

/**
 * 查询总账户账单
 */
export const getBillList = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/check_bill_select",
    headers: {
      ...data,
      checkType: "0"
    },
  });
};

/**
 * 查询代理账单
 */
export const getProxyBillList = (data) => {
  return fetcher({
    method: "POST",
    url: "api-bsc-usdt/check_bill_select",
    headers: {
      ...data,
      checkType: "1"
    },
  });
};

/**
 * 创建账单
 */
export const createBill = (data) =>{
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/check_bill_create",
        headers: {
          ...data,
        },
    });
}

/**
 * 修改账单
 */
export const editBill = (data) =>{
    return fetcher({
        method: "POST",
        url: "api-bsc-usdt/check_bill_update",
        headers: {
          ...data,
        },
    });
}

/**
 * 删除账单
 */
export const deleteBill = (data) =>{
  return fetcher({
      method: "POST",
      url: "api-bsc-usdt/check_bill_delete",
      headers: {
        ...data,
      },
  });
}


