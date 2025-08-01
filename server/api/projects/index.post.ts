
import { authenticate, getUserIdFromPayload} from "~/server/utils/auth";
import { getUserById } from "~/server/services/auth";
import { createProject } from "~/server/services/projects";
import {  validateProjectInput } from "~/server/services/projects";
import { verifyAccessToken } from '~/server/utils/jwt';


import type { Project as PrismaProject } from '@prisma/client';


import type { ProjectCreateFrontend } from "~/stores/projects.store";
import type { ProjectCreateBackend } from "~/server/services/projects";



export default defineEventHandler(async (e)=> {
  const accessToken = authenticate(e);


  try {
    const payload= verifyAccessToken(accessToken);
    const userId:string = getUserIdFromPayload(payload);

    const user = await getUserById(userId);
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Пользователь не найден",
      });
    }

    const body:ProjectCreateFrontend = await readBody(e);

    validateProjectInput(body)
    const projectData:ProjectCreateBackend = {
      ...body,
      userId,
     deadline: body.deadline ? new Date(body.deadline) : null,
    };
    const project:PrismaProject = await createProject(projectData);

    return project;
   
  } catch(error:any) {
     
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Внутренняя ошибка сервера',
    });
  }
  
})