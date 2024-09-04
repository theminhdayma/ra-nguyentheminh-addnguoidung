import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { M_PLUS_1 } from "next/font/google";
type ParamType = {
  params: {
    id: string;
  };
};

interface Employee {
  id: number;
  employeeName: string;
  dateOfBirth: string;
  image: string;
  email: string;
}

// Lấy thông tin chi tiết của nhân viên theo id
export async function GET(req: Request, { params }: ParamType) {
  try {
    const pathName = path.join(process.cwd(), "database", "employees.json");
    const employees: Employee[] = JSON.parse(fs.readFileSync(pathName, "utf8"));
    const findIndex = employees.findIndex(
      (employee) => employee.id === +params.id
    );
    if (findIndex > -1) {
      return NextResponse.json({
        message: "Tìm thành công",
        data: employees[findIndex],
      });
    } else {
      return NextResponse.json({ message: "Không tìm thấy nhân viên" });
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function PUT(req: Request, { params }: ParamType) {
  try {
    const pathName = path.join(process.cwd(), "database", "employees.json");
    const employees: Employee[] = JSON.parse(fs.readFileSync(pathName, "utf8"));
    const findIndex = employees.findIndex(
      (employee) => employee.id === +params.id
    );
    const dataAPI = await req.json();
    if (findIndex > -1) {
      employees[findIndex] = { ...dataAPI, id: +params.id };
      fs.writeFileSync(pathName, JSON.stringify(employees), "utf8");
      return NextResponse.json({
        message: "cập nhập thành công",
        data: { ...dataAPI, id: +params.id },
      });
    } else {
      return NextResponse.json({ message: "Không tìm thấy nhân viên" });
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}

//xóa thông tin sản phẩm theo id
export async function DELETE(req:Request,{params}:ParamType){
    try {
        const pathName=path.join(process.cwd(),"database","employees.json");
        const employees:Employee[]=JSON.parse(fs.readFileSync(pathName,'utf8'));
        const findIndex=employees.findIndex(employee=>employee.id===+params.id);
        if(findIndex>-1){
            employees.splice(findIndex,1);
            fs.writeFileSync(pathName,JSON.stringify(employees),'utf8');
            return NextResponse.json({message:"xóa thành công",data:employees});
        }
        else{
            return NextResponse.json({message:"Không tìm thấy nhân viên"})
        }
    } catch (error) {
        return NextResponse.json(error);
    }   
}