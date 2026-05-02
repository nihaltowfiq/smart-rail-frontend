export type BR<T> = {
  error: string[];
  message: string;
  success: boolean;
  data: T;
};
