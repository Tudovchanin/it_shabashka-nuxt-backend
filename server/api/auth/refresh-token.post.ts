import { verifyRefreshToken, createAccessToken, createRefreshToken } from '~/server/utils/jwt';
import { getRefreshToken, getUserById, saveRefreshToken } from '~/server/services/auth';

export default defineEventHandler(async (e)=> {

  console.log('Request cookies:', e.node.req.headers.cookie);
  const refreshToken = getCookie(e, 'refreshToken');

  if (!refreshToken) {
    throw createError({ statusCode: 401, message: 'Отсутствует refresh token' });
  }
  try {

    const payload = verifyRefreshToken(refreshToken);
    console.log(payload, 'payload');


    if (typeof payload === 'string') {
      throw createError({ statusCode: 401, message: 'Неверный формат токена' });
    }

    const userId = payload.id || payload.sub;

    console.log(userId, 'id user');
    
    if (!userId) {
      throw createError({ statusCode: 401, message: 'В токене не найден userId' });
    }

    const tokenRecord = await getRefreshToken(userId);
    console.log(tokenRecord, 'token record');
    

    if(!tokenRecord || tokenRecord.token !== refreshToken)  {
      console.log('Refresh token недействителен');
      
      throw createError({ statusCode: 401, message: 'Refresh token недействителен' });
    }
    if(tokenRecord. expiresAt < new Date()) {
      throw createError({ statusCode: 401, message: 'Refresh token истёк' });
    }

    const user =  await getUserById(userId);
    if (!user) {
      throw createError({ statusCode: 404, message: 'Пользователь не найден' });
    }

    const newAccessToken = createAccessToken({ id: user.id, email: user.email });
    const newRefreshToken = createRefreshToken({ id: user.id });

    await saveRefreshToken(newRefreshToken, userId);

    setCookie(e, 'refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7
    });
    const { password, ...userSafe } = user;

  return {
    accessToken: newAccessToken,
    user: userSafe,
  };
  } catch (error) {
    throw createError({ statusCode: 401, message: 'Неверный refresh token' });
  }
})