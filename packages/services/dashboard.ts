import { GET } from "./api";
import { ENDPOINT } from "./endpoints";

export const getStats = async (period: string, startDate?: string, endDate?: string) => {
    return await GET(`${ENDPOINT.DASHBOARD}/stats`, { 
        period, 
        start_date: startDate, 
        end_date: endDate 
    });
};
