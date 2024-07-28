import {AddressModel} from './AddressModel';

export interface LocationAddressModel {
  title: string;
  id: string;
  language: string;
  resultType: string;
  address: AddressModel;
  highlights: Highlights;
}

export interface Highlights {
  title: Title[];
  address: Address2;
}

export interface Title {
  start: number;
  end: number;
}

export interface Address2 {
  label: Label[];
  city: City[];
  district: District[];
  street: Street[];
}

export interface Label {
  start: number;
  end: number;
}

export interface City {
  start: number;
  end: number;
}

export interface District {
  start: number;
  end: number;
}

export interface Street {
  start: number;
  end: number;
}
