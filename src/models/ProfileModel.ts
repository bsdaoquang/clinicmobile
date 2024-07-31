export interface ProfileModel {
  __v: number;
  _id: string;
  address: string;
  amount: number;
  createdAt: string;
  displayName: string;
  email: string;
  emergencyContact: EmergencyContact;
  expTime: number;
  fcmtokens: string[];
  isApproved: boolean;
  isAutoApprove: boolean;
  isOnline: boolean;
  isVerified: boolean;
  phoneNumber: string;
  photoUrl: string;
  position: Position;
  referentCode: string;
  special: string;
  status: string;
  title: string;
  type: string;
  updatedAt: string;
  workAddress: string;
}

export interface EmergencyContact {
  address: string;
  name: string;
  phone: string;
}

export interface Position {
  lat: number;
  long: number;
}
