import { ParticipantType } from "../../model/index/Participant";

export interface ParticipantRepository {
  isExistParticipant(_id: any): Promise<Boolean>;
  createParticipant(data: ParticipantType): Promise<any>;
  readParticipant(id: string): Promise<any>;
  readParticipantWithPopulate(_id: any, selectField: object): Promise<any>;
  updateParticipant(_id: any, data: Partial<ParticipantType>): Promise<any>;
  deleteParticipant(_id: any): Promise<any>;
  appendParticipantRecordList(_id: any, participantRecordId: any): Promise<any>;
  popParticipantRecordList(_id: any, participantRecordId: any): Promise<any>;
}
