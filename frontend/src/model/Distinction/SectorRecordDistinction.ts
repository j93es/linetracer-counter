import { SectorRecordType } from "model/SectorRecord";
export interface SectorRecordDistinctionType
  extends Omit<
    SectorRecordType,
    | "_id"
    | "hostId"
    | "remainingContestTime"
    | "sectorState"
    | "driveRecordList"
  > {
  contestSector: string;
  order: number;
}

export default class SectorRecordDistinction {
  contestSector: string;
  order: number;

  constructor(data: SectorRecordDistinctionType) {
    this.contestSector = data.contestSector;
    this.order = data.order;
  }
}

export const sectorRecordTamplate: SectorRecordDistinctionType =
  new SectorRecordDistinction({
    contestSector: "",
    order: 0,
  });
