import api from "./api";
import type { Department } from "./types/department"; // make sure this exists

interface PaginatedDepartmentResponse {
    data: {
        departments: Department[];
    };
}

export const getDepartments = async (): Promise<Department[]> => {
    const res = await api.get<PaginatedDepartmentResponse>("/departments");
    return res.data.data.departments;
};
