import { useQuery } from "@tanstack/react-query";

import AxiosInstance from "../helpers/axios";
import { businessTagKeys } from "../helpers/queryKeyFactories";


// business.tags.pending.js
const getBusinessTags = async (business_id) => { return await AxiosInstance.get(`/business-tags/${business_id}`) }
export const useBusinessTagsbyBusinessQuery = (business_id) => useQuery({ queryKey: businessTagKeys.relatedToBusiness(business_id), queryFn: () => getBusinessTags(business_id) });