=import { getUserByEmail, createUser, hashPassword } from "~/server/services/auth";


export default defineEventHandler(async (e) => {
  try {
    const body = await readBody(e);
    const { email, password, name, avatar } = body;

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: "Email и пароль обязательны" });
    }

    const user = await getUserByEmail(email);
    if (user) {
      throw createError({ statusCode: 409, statusMessage: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await hashPassword(password);


    const userReg = await createUser({ email, hashedPassword, name, avatar });

    if (userReg) {
      return {
        id: userReg.id,
        email: userReg.email,
        name: userReg.name,
        avatar: userReg.avatar,
      };
    } else {
      throw createError({ statusCode: 500, statusMessage: "Не удалось создать пользователя" });
    }

  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      'statusMessage' in error
    ) {
      throw error;
    }

    if (error instanceof Error) {
      throw createError({ statusCode: 500, statusMessage: error.message });
    }

    throw createError({ statusCode: 500, statusMessage: (error as Error).message || 'Внутренняя ошибка сервера' });
  }
});
