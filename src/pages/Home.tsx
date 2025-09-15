import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, getUserByRoleId } from "@/helpers/userApi";
import { getRoles } from "@/helpers/roleApi";
import type { User } from "@/helpers/types/user";
import type { Role } from "@/helpers/types/role";
import type { PaginatedUsersResponse } from "@/helpers/types/user";

import NavBar from "@/components/NavBar";
import UserDetails from "@/components/UserDetails";
import Footer from "@/components/Footer";

const HomePage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleBaseCounts, setRoleBaseCounts] = useState<Record<number, number>>(
    {}
  );
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

        setRoleBaseCounts((prev) => ({
          ...prev,
          [roleId]: response.data.users.length,
        }));

        console.log("roleBaseCounts", roleBaseCounts);

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

      <div className="flex flex-wrap justify-center gap-8 mt-12 px-4">
        {roles?.map((role) => {
          const isSelected = selectedRole?.id === role.id;
          const userCount = roleBaseCounts[role.id] ?? 0;

          return (
            <div
              key={role.id}
              onClick={() => handleRoleClick(role)}
              className={`group cursor-pointer relative overflow-hidden rounded-2xl p-8 w-64 min-h-[200px] flex flex-col items-center justify-center
        transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-2
        ${
          isSelected
            ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl shadow-indigo-500/25 scale-105 -translate-y-2"
            : "bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-white hover:shadow-2xl shadow-lg"
        }`}
            >
              {/* Animated background elements */}
              <div
                className={`absolute inset-0 opacity-10 transition-opacity duration-300
          ${isSelected ? "opacity-20" : "group-hover:opacity-5"}
        `}
              >
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-current"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-current"></div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Role icon placeholder */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300
          ${
            isSelected
              ? "bg-white/20 backdrop-blur-sm"
              : "bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200"
          }
        `}
              >
                <svg
                  className={`w-8 h-8 transition-colors duration-300 ${
                    isSelected ? "text-white" : "text-indigo-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              {/* Role name */}
              <h3
                className={`text-xl font-bold mb-3 text-center transition-colors duration-300 tracking-wide
          ${
            isSelected
              ? "text-white"
              : "text-gray-800 group-hover:text-indigo-700"
          }
        `}
              >
                {role.roleName.toUpperCase()}
              </h3>

              {/* Role ID */}
              <div
                className={`text-sm font-medium mb-2 px-3 py-1 rounded-full transition-all duration-300
          ${
            isSelected
              ? "bg-white/20 text-white backdrop-blur-sm"
              : "bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-700"
          }
        `}
              >
                {isSelected ? `Selected • ID: ${role.id}` : `ID: ${role.id}`}
              </div>

              {/* User count */}
              <div className="flex items-center gap-2 mt-auto">
                <svg
                  className={`w-4 h-4 transition-colors duration-300 ${
                    isSelected
                      ? "text-white/80"
                      : "text-gray-400 group-hover:text-indigo-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9.5a2.121 2.121 0 00-3-3L7.5 4.5 14 11l1.5-1.5 1.5-1.5z"
                  />
                </svg>
                <span
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    isSelected
                      ? "text-white/90"
                      : "text-gray-500 group-hover:text-indigo-600"
                  }`}
                >
                  {userCount === 0
                    ? "No users"
                    : `${userCount} user${userCount === 1 ? "" : "s"}`}
                </span>
              </div>

              {/* Hover glow effect */}
              <div
                className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none
          ${isSelected ? "opacity-0" : "opacity-0 group-hover:opacity-100"}
          bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5`}
              ></div>
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

      <Footer />
    </>
  );
};

export default HomePage;
