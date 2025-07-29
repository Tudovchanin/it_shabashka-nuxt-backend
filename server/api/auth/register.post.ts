
import { getUserByEmail, createUser, hashPassword, saveRefreshToken } from "~/server/services/auth";
import { createAccessToken, createRefreshToken } from "~/server/utils/jwt";

export default defineEventHandler(async (e) => {
  
  const body = await readBody(e);
  const { email, password, name, avatar } = body;

  if (!email || !password || !name) {
    throw createError({ statusCode: 400, message: "Заполните все поля формы" });
  }

  if (password.length < 8) {
    throw createError({
      statusCode: 400,
      message: 'Пароль должен быть длиной не менее 8 символов'
    })}
  try {
   

    const userExists = await getUserByEmail(email);
    if (userExists) {
      throw createError({ statusCode: 409, message: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await hashPassword(password);
    const userReg = await createUser({ email, hashedPassword, name, avatar });

    if (userReg) {

        // Создаём access token и refresh token
    const accessToken = createAccessToken({ id: userReg.id, email: userReg.email });
    const refreshToken = createRefreshToken({ id: userReg.id });

      saveRefreshToken(refreshToken, userReg.id);
      setCookie(e, "refreshToken", refreshToken, { maxAge: 60 * 60 * 24 * 7, httpOnly: true });

      return {
        user: {
          id: userReg.id,
          email: userReg.email,
          name: userReg.name,
          avatar: userReg.avatar,
        },
        accessToken,
      };
    } else {
      throw createError({ statusCode: 500, message: "Не удалось создать пользователя" });
    }

  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      'message' in error
    ) {
      throw error;
    }

    if (error instanceof Error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    throw createError({ statusCode: 500, message: (error as Error).message || 'Внутренняя ошибка сервера' });
  }
});
