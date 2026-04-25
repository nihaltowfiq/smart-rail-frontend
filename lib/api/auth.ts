import { api } from "./client";

export const signup = async (data: any) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

export const signin = async (data: any) => {
  const res = await api.post("/auth/signin", data);
  return res.data;
};
