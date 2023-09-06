export type CreateUserParams = {
  username: string;
  password: string;
  role?: number;
  ewonIds?: string[];
};
export type UpdateUserParams = {
  username: string;
  password: string;
  role?: number;
  ewonIds?: string[];
};
