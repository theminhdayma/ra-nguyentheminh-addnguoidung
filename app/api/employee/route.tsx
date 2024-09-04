import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

interface Employee {
  id: number;
  employeeName: string;
  dateOfBirth: string;
  image: string;
  email: string;
}

export async function GET() {
  const pathName = path.join(process.cwd(), "database", "employees.json");
  const data = JSON.parse(fs.readFileSync(pathName, "utf-8"));
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const pathName = path.join(process.cwd(), "database", "employees.json");
    const data = JSON.parse(fs.readFileSync(pathName, "utf-8"));
    // const data = data.employees;
    
    const apiData = await req.json();
    const isEmailExists = data.some(
      (employee: Employee) => employee.email === apiData.email
    );

    if (isEmailExists) {
      return NextResponse.json({ error: "Email đã tồn tại." }, { status: 400 });
    }

    const newEmployee = { ...apiData, id: Math.floor(Math.random() * 1000000) };
    data.push(newEmployee);
    fs.writeFileSync(pathName, JSON.stringify(data), "utf-8");
    return NextResponse.json(newEmployee);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi thêm nhân viên" });
  }
}
