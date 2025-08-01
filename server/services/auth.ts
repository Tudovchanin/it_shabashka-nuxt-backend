import prisma from "~/lib/prisma";
import type { User } from "@prisma/client";
import bcrypt from "bcrypt";

type CreateUserParams = {
  email: string;
  hashedPassword: string;
  name: string;
  avatar: string;
};


export type UserUpdateInput = {
  name?: string;
  email?: string;
  avatar?: string;
  password?: string;
}


export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
}
export async function getUserById(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}
export async function createUser({
  email,
  hashedPassword,
  name,
  avatar,
}: CreateUserParams): Promise<User> {
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      avatar,
    },
  });

  return user;
}
export async function deleteUser(
  userId: string
): Promise<{
  email: string;
  name: string;
  avatar: string;
  id: string;
  password: string;
}> {
  const deleteUser = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return deleteUser;
}

export async function updateUser(
  userId: string,
  dataUpdate: UserUpdateInput
): Promise<{
  id: string;
  email: string;
  name: string;
  avatar: string;
  password: string;
}> {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataUpdate,
  });

  return updatedUser;
}


export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}
export async function comparePassword(
  password: string,
  userPassword: string
): Promise<boolean> {
  const passwordCompare = await bcrypt.compare(password, userPassword);
  return passwordCompare;
}




export async function saveRefreshToken(
  refreshToken: string,
  userId: string
): Promise<void> {
  await prisma.refreshToken.upsert({
    where: { userId },
    update: {
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    create: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
}





export async function getRefreshToken(userId: string) {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { userId },
  });
  return tokenRecord;
}
export async function deleteRefreshToken(
  refreshToken: string,
  userId: string
): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: {
      token: refreshToken,
      userId,
    },
  });
}
