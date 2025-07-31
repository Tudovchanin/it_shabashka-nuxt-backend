
import { authenticate, getUserIdFromPayload} from "~/server/utils/auth";
import { getUserById } from "~/server/services/auth";
import { createProject } from "~/server/services/projects";
import type { ProjectCreateInput, validateProjectInput } from "~/server/services/projects";



export default defineEventHandler(async (e)=> {
  let accessToken = authenticate(e);


  try {
    const payload = verifyAccessToken(accessToken);
    const userId:string = getUserIdFromPayload (payload);

    const user = await getUserById(userId);
    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Пользователь не найден",
      });
    }

    const body:ProjectCreateInput = await readBody(e);
    if(!body.name) {}
    if(!body.client) {
    }

    if(!body.price) {

    }

    if(!body.userId) {

    }
    await createProject(body);
   
  } catch {

  }
})