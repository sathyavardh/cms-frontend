import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, getUserByRoleId } from "@/helpers/userApi";
import { getRoles } from "@/helpers/roleApi";
import type { User } from "@/helpers/types/user";
import type { Role } from "@/helpers/types/role";
import type { PaginatedUsersResponse } from "@/helpers/types/user";

import NavBar from "@/components/NavBar";
import UserDetails from "@/components/UserDetails";

const HomePage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [usersByRole, setUsersByRole] = useState<PaginatedUsersResponse>({
    users: [],
    total: 0,
    page: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(false);

  // Ref to track the last API call to prevent duplicates
  const lastFetchRef = useRef<{
    roleId: number;
    page: number;
    limit: number;
  } | null>(null);

  // Memoized function to prevent unnecessary re-renders
  const fetchUsersByRole = useCallback(
    async (roleId: number, page = 1, limit = 5) => {
      // Check if we're already fetching the same data
      const currentFetch = { roleId, page, limit };
      if (
        lastFetchRef.current &&
        lastFetchRef.current.roleId === roleId &&
        lastFetchRef.current.page === page &&
        lastFetchRef.current.limit === limit
      ) {
        return; // Skip if same request is already in progress or completed
      }

      setLoading(true);
      lastFetchRef.current = currentFetch;

      try {
        const response = await getUserByRoleId(roleId, page, limit);

        console.log("Fetched users for role:", roleId, "page:", page, response);
        setUsersByRole(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsersByRole({
          users: [],
          total: 0,
          page: 1,
          limit: 5,
        });
      } finally {
        // CRITICAL FIX: Always set loading to false
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const fetchUser = async () => {
      const regNo = localStorage.getItem("regNo");
      if (!regNo) return;

      try {
        const userData = await getUserById(regNo);
        setCurrentUser(userData);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();
        setRoles(rolesData);

        if (roleId) {
          const role =
            roleId !== undefined
              ? rolesData.find((r) => r.id === Number(roleId))
              : rolesData[0];
          if (role) {
            setSelectedRole(role);
            // Fetch users immediately when role is found from URL
            await fetchUsersByRole(role.id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    };

    fetchUser();
    fetchRoles();
  }, [roleId, fetchUsersByRole]);

  // Separate effect for selectedRole changes (when not from URL)
  useEffect(() => {
    if (selectedRole && !roleId) {
      // Only fetch if this role selection is not from URL parameter
      fetchUsersByRole(selectedRole.id);
    }
  }, [selectedRole, roleId, fetchUsersByRole]);

  const handleRoleClick = (role: Role) => {
    // Reset the last fetch ref when manually selecting a role
    lastFetchRef.current = null;
    setSelectedRole(role);
    navigate(`/home/${role.id}`);
  };

  const handlePageChange = (newPage: number) => {
    if (selectedRole) {
      fetchUsersByRole(selectedRole.id, newPage, usersByRole.limit);
    }
  };

  return (
    <>
      <NavBar userName={currentUser?.name} />

      <div className="flex flex-wrap justify-center gap-6 mt-10">
        {roles?.map((role) => {
          const isSelected = selectedRole?.id === role.id;

          return (
            <div
              key={role.id}
              onClick={() => handleRoleClick(role)}
              className={`cursor-pointer shadow-md rounded-xl p-6 w-48 flex flex-col items-center transition-shadow duration-300
              ${
                isSelected
                  ? "bg-indigo-500 text-white shadow-xl"
                  : "bg-white hover:shadow-xl"
              }`}
            >
              <h3 className="text-lg font-semibold mb-2">
                {role.roleName.toUpperCase()}
              </h3>
              <p className="text-sm">
                {isSelected ? `Selected ID: ${role.id}` : `ID: ${role.id}`}
              </p>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center mt-8">
          <div className="text-lg">Loading users...</div>
        </div>
      )}

      {selectedRole && !loading && (
        <UserDetails
          role={selectedRole}
          paginatedData={usersByRole}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default HomePage;
