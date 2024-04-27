import express, {
  Router,
  Request,
  Response,
  NextFunction,
  Errback,
} from "express";

import { ParticipantType } from "../model/index/Participant";

import { ParticipantServiceInterface } from "../core/service/participant";
import { ParticipantService } from "../service/participant-service";

const router: Router = express.Router();
const participantService: ParticipantServiceInterface =
  new ParticipantService();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("hello get").status(200);
});

router.get("/:_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _id: string = req.params._id;
    const participant: Partial<ParticipantType> =
      await participantService.getParticipant(_id);

    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(participant).status(200);
  } catch (err: any) {
    console.log(err);
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send({ message: err.toString() }).status(404);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    const participant: Partial<ParticipantType> =
      await participantService.postParticipant(data);

    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(participant).status(200);
  } catch (err: any) {
    console.log(err);
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send({ message: err.toString() }).status(404);
  }
});

router.patch("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("hello patch");
});

router.patch(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const id: string = req.params.id;
      if (!data.id) {
        data.id = id;
      }
      if (id !== data.id) {
        throw new Error(
          "id is not matched : query id and body id is different"
        );
      }

      const participant: Partial<ParticipantType> =
        await participantService.patchParticipant(id, data);

      res.header("Content-Type", "application/json; charset=utf-8");
      res.status(200);
      res.send(participant);
    } catch (err: any) {
      console.log(err);
      res.header("Content-Type", "application/json; charset=utf-8");
      res.status(404);
      res.send({ message: err.toString() });
    }
  }
);

router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("hello patch");
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const id: string = req.params.id;
    if (!data.id) {
      data.id = id;
    }
    if (id !== data.id) {
      throw new Error("id is not matched : query id and body id is different");
    }

    const participant: Partial<ParticipantType> =
      await participantService.putParticipant(id, data);

    res.header("Content-Type", "application/json; charset=utf-8");
    res.status(200);
    res.send(participant);
  } catch (err: any) {
    console.log(err);
    res.header("Content-Type", "application/json; charset=utf-8");
    res.status(404);
    res.send({ message: err.toString() });
  }
});

router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  res.send("hello delete");
});

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params.id;

      const participant: Partial<ParticipantType> =
        await participantService.removeParticipant(id);

      res.header("Content-Type", "application/json; charset=utf-8");
      res.status(200);
      res.send(participant);
    } catch (err: any) {
      console.log(err);
      res.header("Content-Type", "application/json; charset=utf-8");
      res.status(404);
      res.send({ message: err.toString() });
    }
  }
);

export default router;
