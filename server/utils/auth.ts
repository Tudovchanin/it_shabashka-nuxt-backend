
import type { H3Event } from 'h3';
import type { JwtPayload } from 'jsonwebtoken';


export function authenticate(e: H3Event) {
  console.log(e);
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

  let accessToken = authorization.slice(7);

  return accessToken;
}



export function getUserIdFromPayload (payload:string | JwtPayload) {
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
  return userId;
}