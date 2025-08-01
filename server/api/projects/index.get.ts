


import { authenticate, getUserIdFromPayload} from "~/server/utils/auth";
import { getUserById } from "~/server/services/auth";
import { getProjectsByUserId } from "~/server/services/projects";
import { verifyAccessToken } from '~/server/utils/jwt';

import type { ProjectCreateFrontend } from "~/stores/projects.store";
import type { ProjectCreateBackend } from "~/server/services/projects";


export default defineEventHandler (async(e)=> {
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

    const project = await getProjectsByUserId(userId);

    return project;
   
  } catch(error:any) {
     
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Внутренняя ошибка сервера',
    });
  }

})




// const userWithPostsAndComments = await prisma.user.findUnique({
//   where: { email },
//   include: {
//     posts: true,
//     comments: true
//   }
// })