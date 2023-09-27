import { Installation } from '../../entity/Installations.entity';

export class CreateTagLiveParams {
  id: number;
  lastSynchroDate: Date;
  dateReq: Date;
  value: number;
  quality: string;
  alarmHint: string;
  ewonTagId: number;
  installation: Installation;
}
export class UpdateTagLiveParams {
  id: number;
  lastSynchroDate: Date;
  dateReq: Date;
  value: number;
  quality: string;
  alarmHint: string;
  ewonTagId: number;
  installation: Installation;
}
