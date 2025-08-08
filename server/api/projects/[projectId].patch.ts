import { authenticate, getUserIdFromPayload } from "~/server/utils/auth";
import { getUserById } from "~/server/services/auth";
import { verifyAccessToken } from "~/server/utils/jwt";

import { updateProject } from "~/server/services/projects";

import type { UpdateProjectFrontend } from "~/stores/projects.store";
import type { UpdateProjectBackend } from "~/server/services/projects";


export default defineEventHandler(async (e) => {
  const accessToken = authenticate(e);

  try {
    const payload = verifyAccessToken(accessToken);
    const userId: string = getUserIdFromPayload(payload);

    const user = await getUserById(userId);
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Пользователь не найден",
      });
    }

    const body: UpdateProjectFrontend = await readBody(e);
    console.log(body, 'BACKEND BODY');
    let dataUpdate: UpdateProjectBackend;

    if ('deadline' in body) {
      dataUpdate = {
        ...body,
        deadline: body.deadline ? new Date(body.deadline) : null,
      };
    } else {
      dataUpdate = { ...body as UpdateProjectBackend };
    }
    

     const project =  await updateProject(dataUpdate);
     return project;

    
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Внутренняя ошибка сервера",
    });
  }
});
