import { ContestType } from "@model/Contest";

import { UserParticipantType } from "@model/service/user/Participant";
import { UserSectorRecordType } from "@model/service/user//SectorRecord";

export interface UserContestType
  extends Omit<
    ContestType,
    | "_id"
    | "id"
    | "contestTimerStartTime"
    | "isContestTimerRunning"
    | "driveStartTime"
    | "isDriveTimerRunning"
    | "latestDriveRecordTime"
  > {
  queryId: string;
  title: string;

  curContestingSection?: string;
  curParticipant?: UserParticipantType;
  nextParticipant?: UserParticipantType;
  curSectorRecord?: UserSectorRecordType;

  participantList: UserParticipantType[];
}

export default class UserContest implements UserContestType {
  queryId: string;
  title: string;

  curContestingSection?: string;
  curParticipant?: UserParticipantType;
  nextParticipant?: UserParticipantType;
  curSectorRecord?: UserSectorRecordType;

  participantList: UserParticipantType[];

  constructor(data: UserContestType) {
    this.queryId = data.queryId;
    this.title = data.title;

    this.curContestingSection = data.curContestingSection;
    this.curParticipant = data.curParticipant;
    this.nextParticipant = data.nextParticipant;
    this.curSectorRecord = data.curSectorRecord;

    this.participantList = data.participantList;
  }
}

export const userContestTamplate: UserContestType = new UserContest({
  queryId: "",
  title: "",

  curContestingSection: "",
  curParticipant: {} as UserParticipantType,
  nextParticipant: {} as UserParticipantType,
  curSectorRecord: {} as UserSectorRecordType,

  participantList: [],
});
