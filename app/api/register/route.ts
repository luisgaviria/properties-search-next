import { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

interface reqBody {
  email: string;
  phoneNumber?: string;
  username: string;
  password: string;
}

export async function POST(req: Request, res: NextResponse) {
  const body: reqBody = await req.json();

  const hashed_password = await bcrypt.hash(body.password, 12);

  let data = {};
  if (body.phoneNumber) {
    data = {
      phoneNumber: body.phoneNumber,
      email: body.email,
      username: body.username,
      password: hashed_password,
    };
  } else {
    data = {
      email: body.email,
      username: body.username,
      password: hashed_password,
    };
  }

  await prisma.user.create({
    data: data as any,
  });

  return NextResponse.json({
    message: "Succesfully created User",
  });
}
