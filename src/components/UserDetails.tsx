import React, { useState } from "react";
import type { Role } from "@/helpers/types/role";
import type { User } from "@/helpers/types/user";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateAndUpdate from "./CreateAndUpdate";
import { deleteUser } from "@/helpers/userApi";

interface PaginatedUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

interface UserDetailsProps {
  role: Role;
  paginatedData: PaginatedUsersResponse;
  onPageChange?: (page: number) => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  role,
  paginatedData,
  onPageChange,
}) => {
  const { users, total, page, limit } = paginatedData;

  const safeTotal = total || users?.length || 0;
  const safeLimit = limit || 5;
  const safePage = page || 1;
  const totalPages = Math.ceil(safeTotal / safeLimit);

  // State to track which user is being edited
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const storedRole = localStorage.getItem("roleId")?.trim();
  const roleId = Number(storedRole);
  const canEditDeleteCreate = roleId === 2;
  console.log(
    "RoleId:",
    roleId,
    "Can edit/delete/create:",
    canEditDeleteCreate
  );

  // Function to refresh the page
  const refreshPage = () => {
    window.location.reload();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && onPageChange) {
      onPageChange(newPage);
    }
  };
  

  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
      return range;
    }

    rangeWithDots.push(1);
    let start = Math.max(2, safePage - delta);
    let end = Math.min(totalPages - 1, safePage + delta);

    if (end - start + 1 < 2 * delta + 1) {
      if (start === 2) end = Math.min(totalPages - 1, start + 2 * delta);
      else if (end === totalPages - 1) start = Math.max(2, end - 2 * delta);
    }

    if (start > 2) rangeWithDots.push("...");
    for (let i = start; i <= end; i++) rangeWithDots.push(i);
    if (end < totalPages - 1) rangeWithDots.push("...");
    rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  if (!users || users.length === 0) {
    return (
      <div className="mt-6">
        <Alert variant="destructive">
          <AlertTitle>No Users Found</AlertTitle>
          <AlertDescription>
            There is no data present for the role{" "}
            <strong>{role.roleName}</strong>.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mt-6 px-4 sm:px-6 lg:px-8">
      {/* Summary and Create Button */}
      <div className="mb-4 text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="mb-5">
          Showing {Math.min((safePage - 1) * safeLimit + 1, safeTotal)} to{" "}
          {Math.min(safePage * safeLimit, safeTotal)} of {safeTotal} users for
          role <strong>{role.roleName}</strong>
        </div>
        {canEditDeleteCreate && (
          <CreateAndUpdate
            onUserUpdated={() => {
              setUserToEdit(null);
              refreshPage();
            }}
          />
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.emailId}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.currentPosition}</TableCell>
                <TableCell>{user.role?.roleName || "N/A"}</TableCell>
                <TableCell>{user.department?.deptName || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserToEdit(user)}
                      disabled={!canEditDeleteCreate}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setUserToDelete(user)}
                      disabled={!canEditDeleteCreate}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {(totalPages > 1 || safeTotal > safeLimit) && (
        <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(safePage - 1)}
                  className={
                    safePage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                >
                  Prev
                </PaginationPrevious>
              </PaginationItem>

              {getPageNumbers().map((pageNum, idx) => (
                <PaginationItem key={`${pageNum}-${idx}`}>
                  {pageNum === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum as number)}
                      isActive={pageNum === safePage}
                      className={`cursor-pointer px-3 py-1 rounded-md ${
                        pageNum === safePage
                          ? "bg-indigo-500 text-white font-semibold"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(safePage + 1)}
                  className={
                    safePage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Edit User Dialog */}
      {userToEdit && (
        <CreateAndUpdate
          userToEdit={userToEdit}
          onUserUpdated={() => {
            setUserToEdit(null);
            refreshPage(); // Refresh page after update
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <Dialog
          open={!!userToDelete}
          onOpenChange={() => setUserToDelete(null)}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <strong>{userToDelete.name}</strong>? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!userToDelete) return;
                  try {
                    await deleteUser?.(userToDelete.regNo);
                    setUserToDelete(null);
                    refreshPage(); // Refresh page after delete
                  } catch (err) {
                    console.error("Failed to delete user:", err);
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserDetails;
