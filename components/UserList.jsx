"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus, UserMinus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/userlist");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users");
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setIsLoading(true)
      try {
        await axios.delete(`/api/delete-user/${id}`);
        setUsers(users.filter((user) => user.id !== id));
        toast.success("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditRole = async (id, currentAdmin) => {
    const newAdminStatus = !currentAdmin; // Đảo ngược giá trị admin (true -> false, false -> true)
    const newRole = newAdminStatus ? "admin" : "user";

    if(window.confirm(`Are you sure you want to change the user's role to ${newRole}?`)) {
        setIsLoading(true)
        try{
        await axios.put(`/api/change-user-role/${id}`,{ admin: newAdminStatus }); // Sửa ở đây
        setUsers(users.map((user) => {
            if (user.id === id) {
              return { ...user, admin: newAdminStatus }; // Cập nhật lại giá trị admin
            }
            return user;
          }));
          toast.success(`User role updated to ${newRole}`);
        }catch(error){
            console.error("Error changing user role:", error);
            toast.error("Error changing user role");
        }finally{
          setIsLoading(false);
        }
    }
  };

  const getRoleDisplay = (admin) => {
    return admin ? "Admin" : "User";
  };

  return (
    <div>
      <Toaster position="top-right" />
      <Card className="w-full  bg-white shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardHeader className="bg-[#535C91] p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            User List
          </h2>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Role</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.name}</td>
                    <td className="py-2 px-4 border-b">
                      {getRoleDisplay(user.admin)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <Button
                          variant={"outline"}
                          onClick={() =>
                            handleEditRole(user.id, user.admin)
                          }
                          disabled={isLoading}
                        >
                          {user.admin ? (
                            <UserMinus size={16} />
                          ) : (
                            <UserPlus size={16} />
                          )}
                        </Button>
                        <Button
                          variant={"destructive"}
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isLoading}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserList;
