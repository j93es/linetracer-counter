import Participant from "../../model/index/Participant";
import { ParticipantType } from "../../model/index/Participant";
import { ParticipantIdTitleType } from "../../model/ParticipantIdTitle";

import { ParticipantRepository } from "../../core/participant-repository";
import { ParticipantMongoRepo } from "../../repository/participant-mongo-repo";

import { ParticipantService } from "../../core/participant-service";
import { RobotMongoService } from "./robot-mongo-service";
import { ContestStatusMongoService } from "./contestStatus-mongo-service";
import { PersonalInfoMongoService } from "./personalInfo-mongo-service";

import { anyToString } from "../../util/index";

const participantRepo: ParticipantRepository = new ParticipantMongoRepo();
const PersonalInfoService: PersonalInfoMongoService =
  new PersonalInfoMongoService();
const contestStatusService: ContestStatusMongoService =
  new ContestStatusMongoService();
const robotService: RobotMongoService = new RobotMongoService();

export class ParticipantMongoService implements ParticipantService {
  private getParticipantTemplate(id?: string): ParticipantType {
    return new Participant({
      id: id ?? "",
      title: "",
      personalInfo: PersonalInfoService.getPersonalInfoTemplate(),
      robot: robotService.getRobotTemplate(),
      contestStatus: contestStatusService.getContestStatusTemplate(),
    } as ParticipantType);
  }

  filterParticipant(data: any): Partial<ParticipantType> {
    if (!data.id) {
      throw new Error("participant: id is required");
    }
    if (typeof data.id !== "string") {
      throw new Error(`participant: id must be string`);
    }
    if (data.title !== undefined && typeof data.title !== "string") {
      throw new Error(`participant: title must be string`);
    }
    if (data.contestLog !== undefined && !Array.isArray(data.contestLog)) {
      throw new Error("contestLog: contestLog must be array");
    }
    if (data.driveLog !== undefined && !Array.isArray(data.driveLog)) {
      throw new Error("participant: driveLog must be array");
    }

    PersonalInfoService.filterPersonalInfo(data.personalInfo);
    robotService.filterRobot(data.robot);
    contestStatusService.filterContestStatus(data.contestStatus);

    return data as Partial<ParticipantType>;
  }

  private publishParticipant(
    id: string,
    data: Partial<ParticipantType>
  ): ParticipantType {
    const participantTemplate = this.getParticipantTemplate(id);

    let title = data.title ?? participantTemplate.title;
    if (typeof title !== "string") {
      title = anyToString(title);
    }

    const personalInfo = PersonalInfoService.publishPersonalInfo(
      data.personalInfo ?? participantTemplate.personalInfo
    );
    const robot = robotService.publishRobot(
      data.robot ?? participantTemplate.robot
    );
    const contestStatus = contestStatusService.publishContestStatus(
      data.contestStatus ?? participantTemplate.contestStatus
    );

    return new Participant({
      id: id,
      title: title,
      personalInfo: personalInfo,
      robot: robot,
      contestStatus: contestStatus,
    });
  }

  getParticipantIndex(): Array<ParticipantIdTitleType> {
    try {
      return participantRepo.readParticipantIndex();
    } catch (error: any) {
      throw error;
    }
  }

  getParticipant(id: string): ParticipantType {
    try {
      if (!participantRepo.isParticipantExist(id)) {
        throw new Error(`${id} : participant is not exist`);
      }

      const data = participantRepo.readParticipant(id);

      const participant = this.publishParticipant(id, data);

      return participant;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  setParticipant(data: any): ParticipantType {
    try {
      const src: Partial<ParticipantType> = this.filterParticipant(data);
      if (!src.id) {
        throw new Error("participant: id is required");
      }
      participantRepo.writeParticipant(src);
      return this.getParticipant(src.id);
    } catch (error: any) {
      throw error;
    }
  }

  resetParticipant(id: string): ParticipantType {
    try {
      const participant = this.getParticipantTemplate(id);

      participantRepo.writeParticipant(participant);
      return this.getParticipant(id);
    } catch (error: any) {
      throw error;
    }
  }
}
