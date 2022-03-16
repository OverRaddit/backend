import {
  NextFunction, Request, RequestHandler, Response,
} from 'express';
import * as status from 'http-status';
import ErrorResponse from '../errorResponse';
import * as BooksSerice from './books.service';

export interface SearchBookInfoQuery {
  query: string,
  sort: string,
  page: string,
  limit: string,
  category: string,
}

export const searchBookInfo = async (
  req: Request<{}, {}, {}, SearchBookInfoQuery>,
  res: Response,
  next: NextFunction,
) => {
  const {
    query, sort, page, limit, category,
  } = req.query;
  if (!(query && page && limit)) {
    next(new ErrorResponse(status.BAD_REQUEST, 'query, page, limit 중 하나 이상이 없습니다.'));
  } else {
    res.status(status.OK).json(
      await BooksSerice.searchInfo(query, sort, parseInt(page, 10), parseInt(limit, 10), category),
    );
  }
};

export const infoId: RequestHandler = (req: Request, res: Response) => {
  res.send('hello express');
  // search 함수
};
export const info: RequestHandler = (req: Request, res: Response) => {};

export const booker: RequestHandler = (req: Request, res: Response) => {
  res.send('hello express');
  // search 함수
};

export const search: RequestHandler = (req: Request, res: Response) => {
  res.send('hello express');
};
