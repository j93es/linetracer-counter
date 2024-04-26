import express, { Router, Request, Response, NextFunction } from "express";

const router: Router = express.Router();

import { UserService } from "../core/service/user";
import { UserMongoService } from "../service/user-service";

const userService: UserService = new UserMongoService();

/* GET home page. */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("hello, user").status(200);
});

router.get(
  "/:year",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idYear = req.params.year;
      const data = await userService.getData(idYear);
      res.send(data).status(200);
    } catch (e) {
      console.error(e);
      res.send(e).status(404);
    }
  }
);

export default router;
