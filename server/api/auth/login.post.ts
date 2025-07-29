
import { getUserByEmail, saveRefreshToken, comparePassword } from "~/server/services/auth";
import { createAccessToken, createRefreshToken } from "~/server/utils/jwt";


export default defineEventHandler(async (e) => {
  const body = await readBody(e);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({ statusCode: 400, message: "Email и пароль обязательны" });
  }

  try {

    const userExists = await getUserByEmail(email);
    if (!userExists) {
      throw createError({ statusCode: 400, message: "Войдите в систему, используя правильные учетные данные!" });
    }
    const passwordCompare = await comparePassword(password, userExists.password);

    if (!passwordCompare) {
      throw createError({ statusCode: 400, message: "Войдите в систему, используя правильные учетные данные!" });
    }
    const accessToken = createAccessToken({ id: userExists.id, email: userExists.email });
    const refreshToken = createRefreshToken({ id: userExists.id });


    saveRefreshToken(refreshToken, userExists.id);
    setCookie(e, "refreshToken", refreshToken, { maxAge: 60 * 60 * 24 * 7, httpOnly: true });

    return {
      user: {
        id: userExists.id,
        email: userExists.email,
        name: userExists.name,
        avatar: userExists.avatar,
      },
      accessToken,
    };

  } catch (error) {

  }


})