export type User = {
  name: string;
  phone: string;
  token: string;
};

const KEY = "smartrail_user";

export const saveUser = (user: User) => {
  localStorage.setItem(KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};

export const clearUser = () => {
  localStorage.removeItem(KEY);
};
