import prisma from "./prisma";
import Prisma from "@prisma/client";

export async function createSubject(subject: Prisma.Subject) {
  return await prisma.subject.create({
    data: subject,
  });
}
