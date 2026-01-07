export interface CreateUserDTO {
  name: string;
  email: string;
  age?: number;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  age?: number;
}
