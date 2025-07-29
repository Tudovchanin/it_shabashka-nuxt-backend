import { verifyAccessToken } from "~/server/utils/jwt";
import {
  hashPassword,
  getUserById,
  comparePassword,
  updateUser,
} from "~/server/services/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default defineEventHandler(async (e) => {
  {
    const authorization = getRequestHeader(e, "authorization");
    if (!authorization) {
      throw createError({
        statusCode: 401,
        message: "Требуется авторизация",
      });
    }

    if (!authorization.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        message: "Неверный формат авторизации",
      });
    }

    const accessToken = authorization.slice(7);

    try {
      const payload = verifyAccessToken(accessToken);
      if (typeof payload === "string") {
        throw createError({ statusCode: 401, message: "Неверный токен" });
      }
      const userId = payload.id || payload.sub;
      if (!userId) {
        throw createError({
          statusCode: 401,
          message: "В токене не найден userId",
        });
      }

      const user = await getUserById(userId);
      if (!user) {
        throw createError({
          statusCode: 401,
          message: "Пользователь не найден",
        });
      }

      const body = await readBody(e);
      const { name, email, currentPassword, newPassword, avatar } = body;

      const updateData: Record<string, any> = {};

      if (name !== undefined) {
        if (typeof name !== "string" || name.trim() === "") {
          throw createError({
            statusCode: 400,
            message: "Имя не может быть пустым",
          });
        }
        updateData.name = name.trim();

      } 
      // Проверяем email: если пришёл — он обязателен и не может быть пустым, и должен проходить базовую проверку формата
      if (email !== undefined) {
        if (typeof email !== "string" || email.trim() === "") {
          throw createError({
            statusCode: 400,
            message: "Email не может быть пустым",
          });
        }
        if (!emailRegex.test(email)) {
          throw createError({
            statusCode: 400,
            message: "Некорректный формат email",
          });
        }
        updateData.email = email.trim();
      }
      if (avatar !== undefined) updateData.avatar = avatar;




      if (newPassword !== undefined || currentPassword !== undefined) {

        if (!currentPassword || !newPassword) {
          throw createError({
            statusCode: 400,
            message:
              "Для изменения пароля необходимо указать текущий и новый пароль",
          });
        }
        if (newPassword.trim().length < 8) {
          throw createError({
            statusCode: 400,
            message:
              "Пароль не должен быть меньше 8 символов",
          });
        }




        const isPasswordValid = await comparePassword(
          currentPassword,
          user.password
        );

        if (!isPasswordValid) {
          throw createError({
            statusCode: 400,
            message: "Текущий пароль неверен",
          });
        }

        const hashedNewPassword = await hashPassword(newPassword);
        updateData.password = hashedNewPassword;
      }

      if (Object.keys(updateData).length === 0) {
        throw createError({ statusCode: 400, message: 'Нет данных для обновления' });
      }

      const updatedUser = await updateUser(userId, updateData);

      // Не возвращаем пароль клиенту
      const { password, ...userSafe } = updatedUser;
      return {
        message: newPassword ? 'Данные пользователя обновлены, пароль изменён' : 'Данные пользователя обновлены',
        user: userSafe,
      };

    } catch (error:any) {
      
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Внутренняя ошибка сервера',
      });
    }
  }
});
