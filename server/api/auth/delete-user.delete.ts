
import { verifyAccessToken } from '~/server/utils/jwt';
import { deleteUser } from '~/server/services/auth';


export default defineEventHandler(async (e) => {
  const authorization = getRequestHeader(e, 'authorization');
  if (!authorization) {
    throw createError({ statusCode: 401,message: 'Требуется авторизация' });
  }
  if (!authorization.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Неверный формат авторизации' });
  }

  const accessToken = authorization.slice(7);

  try {
    
    const payload = verifyAccessToken(accessToken);
    if (typeof payload === 'string') {
      throw createError({ statusCode: 401, message: 'Неверный токен' });
    }
    const userId = payload.id || payload.sub;
    if (!userId) {
      throw createError({ statusCode: 401, message: 'В токене не найден userId' });
    }

     const userDelete = await deleteUser(userId);
     return userDelete;

  } catch (error) {
    throw createError({ statusCode: 401, message: 'Неверный или просроченный токен' });
  }

})