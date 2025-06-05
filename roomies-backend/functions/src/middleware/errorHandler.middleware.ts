import express, {Request, Response} from "express";
export const errorHandler = (app: express.Express) => {
  app.use((error: Error, req: Request, res: Response) => {
    res.status(500).send({message: "Internal Server Error"});
  });
};
