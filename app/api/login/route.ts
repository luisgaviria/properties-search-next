import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  await prisma.user.create({
    data: {
      email: "test@test.com",
      username: "Test",
      password: "123456789",
    },
  });
  return NextResponse.json({
    message: "Succesfully created User",
  });
}
