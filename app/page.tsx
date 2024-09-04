"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert2";

interface Employee {
  id: number;
  employeeName: string;
  dateOfBirth: string;
  image: string;
  email: string;
}

export default function EmployeeManagement() {
  const [listEmployee, setListEmployee] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    employeeName: "",
    dateOfBirth: "",
    image: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (editingId !== null) {
      fetchEmployee(editingId);
    } else {
      resetForm();
    }
  }, [editingId]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/api/employee");
      setListEmployee(response.data);
    } catch (error) {
      setError("Không tìm thấy dữ liệu");
      console.error(error);
    }
  };

  const fetchEmployee = async (id: number) => {
    try {
      const response = await axios.get(`/api/employee/${id}`);
      if (response.data.data) {
        setFormData(response.data.data);
        setIsEditing(true);
      } else {
        setError(response.data.message || "Không tìm thấy nhân viên");
      }
    } catch (error) {
      setError("Có lỗi xảy ra khi lấy thông tin nhân viên.");
    }
  };

  const resetForm = () => {
    setFormData({
      employeeName: "",
      dateOfBirth: "",
      image: "",
      email: "",
    });
    setIsEditing(false);
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleDelete = async (id: number) => {
    swal
      .fire({
        title: "Bạn có chắc chắn?",
        text: "Bạn sẽ không thể khôi phục dữ liệu này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(`/api/employee/${id}`);
            if (response.data.message === "xóa thành công") {
              setListEmployee(listEmployee.filter((employee) => employee.id !== id));
              swal.fire("Đã xóa!", "Nhân viên của bạn đã bị xóa.", "success");
            } else {
              swal.fire("Có lỗi!", "Không thể xóa nhân viên.", "error");
            }
          } catch (error) {
            swal.fire("Có lỗi!", "Không thể xóa nhân viên.", "error");
          }
        }
      });
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateData = () => {
    const { employeeName, dateOfBirth, image, email } = formData;
    const currentDate = new Date();
    const birthDate = new Date(dateOfBirth);

    if (!employeeName || !dateOfBirth || !image || !email) {
      return "Vui lòng nhập đầy đủ thông tin.";
    }

    if (birthDate > currentDate) {
      return "Năm sinh không được lớn hơn thời gian hiện tại.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = validateData();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
  
    try {
      if (isEditing) {
        const response = await axios.put(`/api/employee/${editingId}`, formData);
        if (response.data.message === "cập nhập thành công") {
          swal.fire("Cập nhật thành công!", "Nhân viên đã được cập nhật.", "success");
        } else {
          swal.fire("Có lỗi!", response.data.message || "Có lỗi xảy ra khi cập nhật nhân viên.", "error");
        }
      } else {
        const response = await axios.post("/api/employee", formData);
        if (response.data.error) {
          setError(response.data.error);
          swal.fire("Có lỗi!", response.data.error, "error");
          return;
        }
        swal.fire("Thêm thành công!", "Nhân viên đã được thêm vào danh sách.", "success");
      }
  
      resetForm();
      setEditingId(null);
      fetchEmployees();
    } catch (error) {
      swal.fire("Có lỗi!", "Có lỗi xảy ra khi thêm hoặc cập nhật nhân viên.", "error");
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý nhân viên</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="relative">
            <div className="overflow-x-auto mt-4">
              {error && <div className="text-red-500">{error}</div>}
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">STT</th>
                    <th className="py-2 px-4 border-b">Tên nhân viên</th>
                    <th className="py-2 px-4 border-b">Ngày sinh</th>
                    <th className="py-2 px-4 border-b">Hình ảnh</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Chức năng</th>
                  </tr>
                </thead>
                <tbody>
                  {listEmployee.map((employee, index) => (
                    <tr key={employee.id}>
                      <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                      <td className="py-2 px-4 border-b">{employee.employeeName}</td>
                      <td className="py-2 px-4 border-b text-center">{employee.dateOfBirth}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <img
                          className="w-[50px] h-[50px] rounded-full"
                          src={employee.image}
                          alt={employee.employeeName}
                        />
                      </td>
                      <td className="py-2 px-4 border-b">{employee.email}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() => handleEdit(employee.id)}
                        >
                          Sửa
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <form className="w-[500px] bg-white p-4 rounded shadow-md" onSubmit={handleSubmit}>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="mb-4">
              <label className="block text-gray-700">Tên nhân viên</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Ngày sinh</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Hình ảnh</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {isEditing ? "Cập nhật" : "Thêm"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}