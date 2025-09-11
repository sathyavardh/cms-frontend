export interface Role {
  id: number;
  roleName: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}


export interface PaginatedRolesResponse {
    data: {
        roles: Role[];
        total?: number;
        page?: number;
        limit?: number;
    };
    message: string;
}

export interface SingleRoleResponse {
  data: Role;
}

export interface CreateRoleResponse {
  message: string;
  data: Role;
}

export interface UpdateRoleResponse {
  message: string;
  data: Role;
}

export interface DeleteRoleResponse {
  message: string;
  data: Role;
}

export interface GetRolesParams {
  page?: number;
  limit?: number;
  name?: string;
}
