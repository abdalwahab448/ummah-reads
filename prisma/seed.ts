import { PrismaClient } from "@prisma/client";

import { hashPassword } from "../src/lib/password";
import { FIXED_PRIMARY_ACCOUNTS } from "../src/lib/fixed-auth";

const prisma = new PrismaClient();

async function main() {
  await prisma.book.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  await prisma.center.deleteMany();

  for (const account of FIXED_PRIMARY_ACCOUNTS) {
    await prisma.user.create({
      data: {
        name: account.name,
        email: account.email,
        role: account.role,
        track: account.track,
        passwordHash: hashPassword(account.password),
        isApproved: account.isApproved,
        centerId: account.centerId
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
