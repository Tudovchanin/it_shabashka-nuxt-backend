import prisma from "~/lib/prisma";
import type { Project } from "@prisma/client";
export type ProjectCreateInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;






export async function createProject(obj: ProjectCreateInput): Promise<Project> {
  const project = await prisma.project.create({
    data: obj,
  });

  return project;
}



export function validateProjectInput(body: ProjectCreateInput) {
  if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
    throw createError({ statusCode: 400, message: "Поле 'name' обязательно и должно быть непустой строкой" });
  }
  if (!body.client || typeof body.client !== 'string' || body.client.trim() === '') {
    throw createError({ statusCode: 400, message: "Поле 'client' обязательно и должно быть непустой строкой" });
  }
  if (body.price === undefined || body.price === null || typeof body.price !== 'number') {
    throw createError({ statusCode: 400, message: "Поле 'price' обязательно и должно быть числом" });
  }
}