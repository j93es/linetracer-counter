import { uri } from "config";
import { ListenServerRepository } from "component/displayBoard/controller/core/listenServer";
import { idController } from "component/displayBoard/controller/id";
import { EventSourcePolyfill } from "event-source-polyfill";

let instance: ListenServerSseRepo | null = null;
class ListenServerSseRepo implements ListenServerRepository {
  private eventSource: EventSource | null = null;
  private id: string | null = null;

  constructor() {
    if (!instance) {
      instance = this;
      this.id = idController.generateId();
    }
    return instance;
  }

  subscribeToServer(callback: (data: any) => void) {
    if (!this.id) {
      this.id = idController.generateId();
    }
    this.eventSource = new EventSourcePolyfill(`${uri}/display-board`, {
      headers: {
        "x-request-id": this.id,
      },
    });
    this.eventSource.onmessage = (event) => {
      callback(JSON.parse(event.data));
    };
  }

  listenToServer(callback: (data: any) => void) {
    this.eventSource?.addEventListener("message", (event) => {
      callback(JSON.parse(event.data));
    });
  }
}

const listenServerSseRepo = new ListenServerSseRepo();

export default listenServerSseRepo;
