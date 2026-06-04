import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decodedToken = decodeToken(token);

  if (!decodedToken || !decodedToken.exp) {
    return true;
  }

  const currentTimeInSeconds = Date.now() / 1000;

  return decodedToken.exp < currentTimeInSeconds;
};

export const getUserFromToken = (token) => {
  const decodedToken = decodeToken(token);

  if (!decodedToken) {
    return null;
  }

  return {
    id: decodedToken.id,
    username: decodedToken.username,
    role: decodedToken.role,
    plan: decodedToken.plan
  };
};