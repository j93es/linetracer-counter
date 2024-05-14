import { ParticipantType } from "model/Participant";

export interface ParticipantDistinctionType
  extends Omit<
    ParticipantType,
    "_id" | "hostId" | "speech" | "robot" | "sectorRecordList"
  > {
  name: string;
  association: string;
}

export default class ParticipantDistinction {
  name: string;
  association: string;

  constructor(data: ParticipantDistinctionType) {
    this.name = data.name;
    this.association = data.association;
  }
}

export const participantTamplate: ParticipantDistinctionType =
  new ParticipantDistinction({
    name: "",
    association: "",
  });
