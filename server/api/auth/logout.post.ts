


import { deleteRefreshToken } from "~/server/services/auth";
import { verifyRefreshToken } from "~/server/utils/jwt";

export default defineEventHandler(async (e) => {
  const refreshToken = getCookie(e, 'refreshToken');

  if (!refreshToken) {
    throw createError({ statusCode: 400, message: 'Refresh token отсутствует' });
  }
  
     
   try {
    const payload = verifyRefreshToken(refreshToken);

if (typeof payload === 'string') {

  throw createError({
    statusCode: 401,
    message: 'Неверный формат токена',
  });
}
    const userId = payload.id || payload.sub;
    await deleteRefreshToken(refreshToken, userId)

    setCookie(e, 'refreshToken', '', {
      httpOnly: true,
      maxAge: 0
    });

    return { message: 'Успешный выход из системы' };
    
   } catch (error) {
    throw createError({ statusCode: 401, message: 'Некорректный refresh token' });
   }

});
