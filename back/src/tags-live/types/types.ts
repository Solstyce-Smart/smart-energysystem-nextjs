import { Installation } from '../../entity/Installations.entity';

export class CreateTagLiveParams {
  _id?: string;
  id: number;
  name: string;
  lastSynchroDate: Date;
  dateReq: Date;
  value: number;
  quality: string;
  alarmHint: string;
  ewonTagId: number;
  installation: Installation;

  toJSON() {
    const { installation, ...rest } = this;
    return rest;
  }
}
export class UpdateTagLiveParams {
  _id?: string;
  id: number;
  name: string;
  lastSynchroDate: Date;
  dateReq: Date;
  value: number;
  quality: string;
  alarmHint: string;
  ewonTagId: number;
  installation: Installation;

  toJSON() {
    const { installation, ...rest } = this;
    return rest;
  }
}
