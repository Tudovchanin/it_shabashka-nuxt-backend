
import prisma from '~/lib/prisma';
import type { User } from '@prisma/client'
import bcrypt from "bcrypt";

type CreateUserParams = {
  email: string
  hashedPassword: string
  name?: string
  avatar?: string
}


export async function getUserByEmail(email: string):Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
  })
  return user;
}

export async function createUser({ email, hashedPassword, name, avatar }: CreateUserParams):Promise<User> {
  const user = await prisma.user.create({
    data: {
      email,
      password:hashedPassword,
      name,
      avatar,
    },
  });

  return user;
}


export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}