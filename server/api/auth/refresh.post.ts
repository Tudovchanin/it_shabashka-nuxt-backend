import prisma from '~/lib/prisma';
import { verifyRefreshToken, createAccessToken, createRefreshToken } from '~/server/utils/jwt';
import { getRefreshToken, getUserById, saveRefreshToken } from '~/server/services/auth';

export default defineEventHandler(async (e)=> {
  const refreshToken = getCookie(e, 'refreshToken');

  if (!refreshToken) {
    throw createError({ statusCode: 401, statusMessage: 'Отсутствует refresh token' });
  }
  try {
    const payload = verifyRefreshToken(refreshToken);

    if (typeof payload === 'string') {
      throw createError({ statusCode: 401, statusMessage: 'Неверный формат токена' });
    }

    const userId = payload.id || payload.sub;

    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: 'В токене не найден userId' });
    }

    const tokenRecord = await getRefreshToken(userId);

    if(!tokenRecord || tokenRecord.token !== refreshToken)  {
      throw createError({ statusCode: 401, statusMessage: 'Refresh token недействителен' });
    }
    if(tokenRecord. expiresAt < new Date()) {
      throw createError({ statusCode: 401, statusMessage: 'Refresh token истёк' });
    }

    const user =  await getUserById(userId);
    if (!user) {
      throw createError({ statusCode: 404, statusMessage: 'Пользователь не найден' });
    }

    const newAccessToken = createAccessToken({ id: user.id, email: user.email });
    const newRefreshToken = createRefreshToken({ id: user.id });

    await saveRefreshToken(newRefreshToken, userId);

    setCookie(e, 'refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7
    });
    return { accessToken: newAccessToken };
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный refresh token' });
  }
})