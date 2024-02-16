import { useQuery } from "@tanstack/react-query";

import AxiosInstance from "../helpers/axios";
import { userKeys } from "../helpers/queryKeyFactories";
// import useNotification from "./useNotification";

const getUserDetails = async () => { return await AxiosInstance.get('/users/user') }
export const useUserQuery = () => useQuery({ queryKey: userKeys.all, queryFn: () => getUserDetails() })