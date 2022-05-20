import { Request, RequestHandler, Response } from 'express';
import * as status from 'http-status';
import * as reservationsService from './reservations.service';
import { ReservationsPageInfo } from '../paginate';

export const create: RequestHandler = (req: Request, res: Response) => {
  if (!req.role) {
    res.status(status.UNAUTHORIZED);
    return;
  }
  reservationsService.create;
};

export const search: RequestHandler = async (req: Request, res: Response) => {
  const info = req.query;
  const page = info.page as string ? info.page as string : '1';
  const limit = info.limit as string ? info.limit as string : '5';
  const filter = info.filter as string[];
  const p :ReservationsPageInfo = new ReservationsPageInfo(page, limit, filter);
  const data = await reservationsService
    .search(p.getPage(), p.getLimit(), p.getFilter());
  res.send(data);
};
