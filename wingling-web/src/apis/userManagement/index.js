import instance from "@/utils/request";

export const getUserList = () => {
    return instance.get("/api/user/getUsers");
}

export const deleteUser = (params) => {
    return instance.delete(`/api/user/delete/${params}`);
}

export const updateProfile = (userId, params) => {
    return instance.post(`/api/user/edit/${userId}`, params);
}

export const createUser = (params) => {
    return instance.post(`/api/user/create`, params);
}

export const getUser = (params) => {
    return instance.get(`/api/user/getUser/${params}`);
}