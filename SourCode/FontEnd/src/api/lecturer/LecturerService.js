import axiosInstance from '~/config/AxiosConfig';
import { BACKEND_ENDPOINT } from '~/utils/Constants';

export function getListLecturerInfo(userId, filterRequest = {}, rows, dto = false, sortField = 'id', sortOrder = -1) {
    return axiosInstance
        .post(`${BACKEND_ENDPOINT}/lecturer/getList`, filterRequest, {
            params: { userId, rows, dto, sortField, sortOrder },
        })
        .then((res) => res.data)
        .catch((error) => console.log(error));
}
