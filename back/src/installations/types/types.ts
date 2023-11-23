export type CreateInstallationParams = {
  id: number;
  ewonId: string;
  name: string;
  nbIRVE: number;
  battery: boolean;
  abo: number;
  lastSynchroDate: string;
  tarifAchat: number;
  tarifRevente: number;
  address?: {
    address: string;
    postalCode: number;
    latitude: string;
    longitude: string;
  }[];
  tagsLive: any;
  user: any;
};

export type UpdateInstallationParams = {
  id: number;
  ewonId: string;
  name: string;
  nbIRVE: number;
  battery: boolean;
  tarifAchat: number;
  tarifRevente: number;
  abo: number;
  lastSynchroDate: string;
  address?: {
    address: string;
    postalCode: number;
    latitude: string;
    longitude: string;
  }[];
  tagsLive: any;
  user: any;
};
