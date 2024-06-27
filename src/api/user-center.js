import { fetcher } from "@/utils/fetcher";
export const getAgencyInfo = (data) => {
    return fetcher({
      method: "POST",
      url: "api-bsc-usdt/agency_info",
      headers: {
        ...data,
      },
    });
  };