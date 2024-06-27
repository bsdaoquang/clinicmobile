export interface ProfileModel {
  address: string;
  amount: number;
  avatar: Avatar;
  bangtotnghiep: Bangtotnghiep;
  cccd: Cccd;
  createdAt: number;
  cv: Cv;
  displayName: string;
  driver: Driver;
  email: string;
  emergenciycontact: Emergenciycontact;
  freeCount: number;
  isLocked: boolean;
  isVerifing: boolean;
  phoneNumber: string;
  practicingcertificate: Practicingcertificate;
  referentCode: string;
  status: string;
  tokens: string[];
  verify: boolean;
}

export interface Avatar {
  downloadUrl: string;
  filePath: string;
  verify: boolean;
}

export interface Bangtotnghiep {
  downloadUrl: string;
  filePath: string;
  verify: boolean;
}

export interface Cccd {
  back: Back;
  front: Front;
  verify: boolean;
}

export interface Back {
  downloadUrl: string;
  filePath: string;
}

export interface Front {
  downloadUrl: string;
  filePath: string;
}

export interface Cv {
  downloadUrl: string;
  filePath: string;
  verify: boolean;
}

export interface Driver {
  back: Back2;
  front: Front2;
  verify: boolean;
}

export interface Back2 {
  downloadUrl: string;
  filePath: string;
}

export interface Front2 {
  downloadUrl: string;
  filePath: string;
}

export interface Emergenciycontact {
  address: string;
  name: string;
  phone: string;
}

export interface Practicingcertificate {
  downloadUrl: string;
  filePath: string;
  verify: boolean;
}
