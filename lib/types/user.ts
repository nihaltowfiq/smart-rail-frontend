export type User = {
  user_id: number;
  phone: string;
  password: string;
  role: "user" | "admin";
  created_at: Date;
  name: string;
  token?: string;
};
