import Cookies from "js-cookie";
import { User } from "./types";

const KEY = "smartrail_user";

export const saveUser = (user: User) => {
  Cookies.set("auth_token", user, { expires: 30 });
  localStorage.setItem(KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};

export const clearUser = () => {
  Cookies.remove("auth_token");
  if (typeof window !== "undefined") {
    localStorage?.removeItem?.(KEY);
  }
};
