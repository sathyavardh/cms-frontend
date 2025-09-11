import api from "./api";
import type { Role, PaginatedRolesResponse, GetRolesParams } from "./types/role";

// Fetch all roles
export const getRoles = async (params: GetRolesParams = {}): Promise<Role[]> => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        throw new Error("Unauthorized");
    }

    const res = await api.get<PaginatedRolesResponse>("/roles", { params });
    return res.data.data.roles;
};
