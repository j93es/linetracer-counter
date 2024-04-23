import { ParticipantType } from "../model/index/Participant";
export interface ParticipantService {
  getParticipantIndex(): Array<{ id: string; title: string }>;
  getParticipant(id: string): ParticipantType;
  setParticipant(srcData: Partial<ParticipantType>): ParticipantType;
  resetParticipant(id: string): ParticipantType;
}

import { PersonalInfoType } from "../model/Participant/PersonalInfo";
export interface PersonalInfoService {
  getPersonalInfoTemplate(): PersonalInfoType;
  filterPersonalInfo(data: any): void;
  publishPersonalInfo(data: Partial<PersonalInfoType>): PersonalInfoType;
}

import { RobotType } from "../model/Participant/Robot";
export interface RobotService {
  getRobotTemplate(): RobotType;
  filterRobot(data: any): void;
  publishRobot(data: Partial<RobotType>): RobotType;
}

import { ContestStatusType } from "../model/Participant/ContestStatus";
export interface ContestStatusService {
  getContestStatusTemplate(): ContestStatusType;
  filterContestStatus(data: any): void;
  publishContestStatus(data: Partial<ContestStatusType>): ContestStatusType;
}
