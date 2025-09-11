// helpers/userApi.ts
import api from "./api";
import type {
  User,
  PaginatedUsersResponse,
  SingleUserResponse,
  GetUsersParams,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from "./types/user";

// Fetch multiple users dynamically
export const getUsers = async (
  params: GetUsersParams = {}
): Promise<PaginatedUsersResponse> => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await api.get<PaginatedUsersResponse>("/users", { params });
  return res.data;
};

// Fetch single user by ID or regNo
export const getUserById = async (id: string): Promise<User> => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await api.get<SingleUserResponse>(`/users/${id}`);
  return res.data.data;
};

// Fetch users by roleId with pagination
export const getUserByRoleId = async (
  roleId: number,
  page = 1,
  limit = 10
): Promise<{ data: PaginatedUsersResponse }> => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Unauthorized");

  const res = await api.get(`/users/byRole/${roleId}?page=${page}&limit=${limit}`);

  // Transform to match expected structure
  const responseData = res.data.data;
  return {
    data: {
      users: responseData.data || responseData.users,
      total: responseData.total,
      page: responseData.page,
      limit: responseData.limit,
    },
  };
};

// Create user
export const createUser = async (
  data: Partial<Omit<User, "id" | "regNo" | "created_at" | "updated_at">>
): Promise<User> => {
  const res = await api.post<CreateUserResponse>("/users", data);
  return res.data.data;
};

// Update user
export const updateUser = async (
  regNo: string,
  data: Partial<Omit<User, "id" | "regNo" | "created_at" | "updated_at">>
): Promise<User> => {
  const res = await api.put<UpdateUserResponse>(`/users/${regNo}`, data);
  return res.data.data;
};

// Delete user
export const deleteUser = async (regNo: string): Promise<User> => {
  const res = await api.delete<DeleteUserResponse>(`/users/${regNo}`);
  return res.data.data;
};
