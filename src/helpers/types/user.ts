// types/user.ts

export interface User {
  id: number;
  regNo: string;
  name: string;
  roleId: number;
  deptId: number;
  phoneNumber: string;
  emailId: string;
  address: string;
  joinedDate: string;
  currentPosition?: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;

    role?: {
    id: number;
    roleName: string;
    created_at: string;
    updated_at: string;
  };
  department?: {
    id: number;
    deptName: string;
    created_at: string;
    updated_at: string;
  };
}

//  API response interfaces
export interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface SingleUserResponse {
  data: User;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  name?: string;
}

export interface CreateUserResponse {
  message: string;
  data: User;
}

export interface DeleteUserResponse {
  message: string;
  data: User;
}

export interface UpdateUserResponse {
  message: string;
  data: User;
}
