import express, {
  Router,
  Request,
  Response,
  NextFunction,
  Errback,
} from "express";

import { ParticipantType } from "../model/Participant";

import { ParticipantRepository } from "../core/repository/participant";
import { ParticipantMongoRepo } from "../repository/mongo/participant";

const participantRepository: ParticipantRepository = new ParticipantMongoRepo();

const router: Router = express.Router();

router.get("/", async (req, res) => {
  res.send("hello get").status(200);
});

router.get("/:id", async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const participant: Partial<ParticipantType> =
      await participantRepository.readParticipant({ _id: id });

    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(participant).status(200);
  } catch (err: any) {
    console.log(err);
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send({ message: err.toString() }).status(404);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = req.body;

    const participant: Partial<ParticipantType> =
      await participantRepository.createParticipant(data);

    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(participant).status(200);
  } catch (err: any) {
    console.log(err);
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send({ message: err.toString() }).status(404);
  }
});

router.post("/:id", async (req: any, res, next) => {
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
      await participantRepository.createParticipant(data);

    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(participant).status(200);
  } catch (err: any) {
    console.log(err);
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send({ message: err.toString() }).status(404);
  }
});

router.patch("/", async (req, res, next) => {
  res.send("hello patch");
});

router.patch("/:id", async (req, res, next) => {
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
      await participantRepository.updateParticipant({ _id: id }, data);

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

router.delete("/", async (req, res, next) => {
  res.send("hello delete");
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id: string = req.params.id;

    const participant: Partial<ParticipantType> =
      await participantRepository.deleteParticipant({ _id: id });

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

export default router;
