import { CounterDeviceLogType } from "pages/admin/model/CounterDeviceLog";
import { ContestType } from "pages/admin/model/Contest";

import { ContestController } from "pages/admin/controller/fetch/ContestController";
import { CounterDeviceLogController } from "pages/admin/controller/fetch/CounterDeviceLogController";

import { counterDeviceCode } from "config";

const contestController = new ContestController();
const counterDeviceLogController = new CounterDeviceLogController();

let instance: CounterDeviceStateController | null = null;
export class CounterDeviceStateController {
  private startTime: number | null = null;
  private endTime: number | null = null;

  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  private parsingValue(value: Uint8Array) {
    let rawString: string = "";
    for (let i = 0; i < value.length; i++) {
      rawString += String.fromCharCode(value[i]);
    }

    // const commands: string[] = rawString
    //   .split(this.headCode)
    //   .map((rawCommand: string) => {
    //     return rawCommand.split(this.tailCode);
    //   });

    let commandsBuffer: string[] = rawString.split(counterDeviceCode.head);

    let commands: string[] = [];
    for (let i = 0; i < commandsBuffer.length; i++) {
      commands = commands.concat(
        commandsBuffer[i].split(counterDeviceCode.tail)
      );
    }

    return commands;
  }

  private isStart(command: String) {
    if (command[0] === counterDeviceCode.driveStart) {
      return true;
    }

    return false;
  }

  private isEnd(command: String) {
    if (command[0] === counterDeviceCode.driveEnd) {
      return true;
    }

    return false;
  }

  private isReset(command: String) {
    if (command[0] === counterDeviceCode.driveReset) {
      return true;
    }

    return false;
  }

  private makeRecordTime(command: string): number {
    let recordTime: number = parseInt(command);

    return recordTime;
  }

  private isRecord(command: string) {
    if (isNaN(this.makeRecordTime(command))) {
      return false;
    }
    return true;
  }

  private async driveStart(getTime: number, contestId: string) {
    this.startTime = getTime;
    this.endTime = null;

    const contest: Partial<ContestType> = {
      id: contestId,
      driveStartTime: getTime,
      isDriveStopWatchRunning: true,
    };

    await contestController.patch(contest);
  }

  private async driveEnd(getTime: number, contestId: string) {
    if (!this.startTime) {
      return;
    }

    this.endTime = getTime;
    const recordTime = this.endTime - this.startTime;

    const contest: Partial<ContestType> = {
      id: contestId,
      driveStartTime: undefined,
      isDriveStopWatchRunning: false,
      latestDriveRecordTime: recordTime,
    };

    const counterDeviceLog: Partial<CounterDeviceLogType> = {
      hostId: contestId,

      startTime: this.startTime,
      endTime: this.endTime,
      type: "Ignored",
      recordTime: recordTime,
      writeTime: this.endTime,
    };
    this.startTime = null;

    Promise.all([
      await contestController.patch(contest),
      await counterDeviceLogController.post(counterDeviceLog),
    ]);
  }

  private async sendReset(contestId: string) {
    this.startTime = null;
    this.endTime = null;

    const contest: Partial<ContestType> = {
      id: contestId,
      driveStartTime: undefined,
      isDriveStopWatchRunning: false,
    };

    await contestController.patch(contest);
  }

  private async sendRecord(recordTime: number, contestId: string) {
    const contest: Partial<ContestType> = {
      id: contestId,
      driveStartTime: undefined,
      isDriveStopWatchRunning: false,
      latestDriveRecordTime: recordTime,
    };

    const counterDeviceLog: Partial<CounterDeviceLogType> = {
      hostId: contestId,

      type: "SUCCESS",
      recordTime: recordTime,
    };

    Promise.all([
      await contestController.patch(contest),
      await counterDeviceLogController.post(counterDeviceLog),
    ]);
  }

  async stateMachine(
    value: Uint8Array | undefined,
    getTime: number,
    contestId: string | undefined
  ): Promise<string> {
    if (!value) {
      return "EMPTY_VALUE";
    }
    if (!contestId) {
      return "EMPTY_CONTEST_ID";
    }

    const commands = this.parsingValue(value);
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.length === 0) {
        continue;
      }

      if (this.isStart(command)) {
        await this.driveStart(getTime, contestId);
        return "DRIVE_START";
      }
      if (this.isEnd(command)) {
        await this.driveEnd(getTime, contestId);
        return "DRIVE_END";
      }
      if (this.isReset(command)) {
        await this.sendReset(contestId);
        return "DRIVE_RESET";
      }
      if (this.isRecord(command)) {
        const recordTime = this.makeRecordTime(command);
        await this.sendRecord(recordTime, contestId);
        return "ADD_RECORD";
      }
    }

    return "IDLE";
  }
}
