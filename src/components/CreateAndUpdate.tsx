import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRoles } from "@/helpers/roleApi";
import { getDepartments } from "@/helpers/departmentApi";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { Role } from "@/helpers/types/role";
import type { Department } from "@/helpers/types/department";
import type { User } from "@/helpers/types/user";
import { createUser, updateUser } from "@/helpers/userApi";
import { Eye, EyeOff } from "lucide-react";

interface CreateAndUpdateProps {
  userToEdit?: User | null;
  onUserUpdated?: () => void;
  selectedRoleId?: number;
}

interface UserPayload {
  name: string;
  emailId: string;
  phoneNumber: string;
  currentPosition: string;
  address: string;
  roleId: number;
  deptId: number;
  status: string;
  joinedDate?: string;
  password: string;
}

function CreateAndUpdate({ userToEdit, onUserUpdated, selectedRoleId }: CreateAndUpdateProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const initialForm = {
    name: "",
    roleId: selectedRoleId?.toString() ?? "", // Convert to string and handle undefined
    deptId: "",
    phoneNumber: "",
    emailId: "",
    password: "",
    address: "",
    joinedDate: "",
    currentPosition: "",
    status: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const isEditing = !!userToEdit;

  // Open dialog when userToEdit changes
  useEffect(() => {
    if (userToEdit) {
      setOpen(true);
      setFormData({
        name: userToEdit.name || "",
        roleId: userToEdit.roleId?.toString() || "",
        deptId: userToEdit.deptId?.toString() || "",
        phoneNumber: userToEdit.phoneNumber || "",
        emailId: userToEdit.emailId || "",
        password: "", // Don't populate password for security
        address: userToEdit.address || "",
        joinedDate: userToEdit.joinedDate || "",
        currentPosition: userToEdit.currentPosition || "",
        status: userToEdit.status || "",
      });
    }
  }, [userToEdit]);

  useEffect(() => {
    const fetchRolesAndDepartments = async () => {
      try {
        const fetchedRoles = await getRoles();
        const fetchedDepartments = await getDepartments();
        setRoles(fetchedRoles);
        setDepartments(fetchedDepartments);
      } catch (err) {
        console.error("Failed to fetch roles/departments:", err);
      }
    };
    fetchRolesAndDepartments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In your handleSubmit function - Cleaner conditional approach:
      const payload: Partial<UserPayload> = {
        name: formData.name,
        emailId: formData.emailId,
        phoneNumber: formData.phoneNumber,
        currentPosition: formData.currentPosition,
        address: formData.address,
        roleId: Number(formData.roleId),
        deptId: Number(formData.deptId),
        status: formData.status,
        joinedDate: formData.joinedDate,
      };

      // Only include password if user typed it
      if (formData.password && formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      // Remove any undefined fields
      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof typeof payload] === undefined) {
          delete payload[key as keyof typeof payload];
        }
      });

      if (isEditing && userToEdit?.regNo) {
        const update = await updateUser(userToEdit.regNo, payload);
        console.log(update);
        setAlert({ type: "success", message: "User updated successfully!" });
      } else {
        const create = await createUser(payload);
        console.log(create);
        setAlert({ type: "success", message: "User created successfully!" });
      }

      setOpen(false);
      setFormData(initialForm);
      if (onUserUpdated) onUserUpdated();
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      console.error(`Failed to ${isEditing ? "update" : "create"} user:`, err);
      setAlert({
        type: "error",
        message: `Failed to ${
          isEditing ? "update" : "create"
        } user. Try again.`,
      });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDialogOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setFormData(initialForm);
    }
  };

  return (
    <div className="mb-3">
      {/* Alert */}
      {alert && (
        <Alert
          variant={alert.type === "success" ? "default" : "destructive"}
          className="mb-4"
        >
          <AlertTitle>
            {alert.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        {!isEditing && (
          <DialogTrigger asChild>
            <Button>+ Create</Button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Update User" : "Create User"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the form fields and click save to modify the user."
                  : "Fill out the form and click save to create a new user."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Role */}
              <div className="grid gap-2">
                <Label htmlFor="roleId">Role</Label>
                <select
                  id="roleId"
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  className="border rounded p-2"
                  required
                  disabled={!!selectedRoleId} 
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div className="grid gap-2">
                <Label htmlFor="deptId">Department</Label>
                <select
                  id="deptId"
                  name="deptId"
                  value={formData.deptId}
                  onChange={handleChange}
                  className="border rounded p-2"
                  required
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.deptName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="emailId">Email</Label>
                <Input
                  type="email"
                  id="emailId"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">
                  Password {isEditing && "(leave blank to keep current)"}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEditing}
                    placeholder={
                      isEditing ? "Leave blank to keep current password" : ""
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Address */}
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Joined Date */}
              <div className="grid gap-2">
                <Label htmlFor="joinedDate">Joined Date</Label>
                <Input
                  type="date"
                  id="joinedDate"
                  name="joinedDate"
                  value={formData.joinedDate}
                  onChange={handleChange}
                />
              </div>

              {/* Current Position */}
              <div className="grid gap-2">
                <Label htmlFor="currentPosition">Current Position</Label>
                <Input
                  id="currentPosition"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleChange}
                />
              </div>

              {/* Status */}
              <div className="grid gap-2 col-span-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="border rounded p-2"
                  required
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {isEditing ? "Update User" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateAndUpdate;