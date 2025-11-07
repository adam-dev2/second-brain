import type { Response } from "express";

const clients = new Map<string, Response>();

type IData =
  | {
      cardId: string;
      title: string;
      message?: string;
      error?: string;
    }
  | string;

export const addClient = (userId: string, res: Response) => {
  clients.set(userId, res);
};

export const removeClient = (userId: string) => {
  clients.delete(userId);
};

export const sendEvent = (userId: string, event: string, data: IData) => {
  const res = clients.get(userId);
  if (!res) return;

  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};
