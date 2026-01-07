export interface CreateAddressDTO {
  street: string;
  city: string;
  zipCode: string;
  country: string;
  userId: number;
}

export interface UpdateAddressDTO {
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
}