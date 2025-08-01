import prisma from "~/lib/prisma";
import type { Project as PrismaProject } from '@prisma/client';



import type { ProjectCreateFrontend } from "~/stores/projects.store";

export type ProjectCreateBackend = Pick<PrismaProject,
'userId' |
'name' |
'client' |
'link' |
'price' |
'status' |
'description' |
'client_email' |
'client_phone' |
'deadline'
>;


export async function getProjectsByUserId(userId: string) {
  const projects = await prisma.project.findMany({
    where: { userId },
    include : {
      comments: true
    }
  });
  return projects;
}





export async function createProject(obj: ProjectCreateBackend): Promise<PrismaProject> {
  const project = await prisma.project.create({
    data: obj,
  });

  return project;
}



export function validateProjectInput(body: ProjectCreateFrontend) {
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