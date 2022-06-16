import * as errorCode from '../utils/error/errorCode';
import { executeQuery } from '../mysql';
import * as models from './users.model';
import * as types from './users.type';

export const getLending = async () => {
  const items = await executeQuery(`
    SELECT
    l.userId as userId,
    l.createdAt as lendDate,
    l.lendingCondition as lendingCondition,
    bi.id as bookInfoId,
    bi.title as title,
    DATE_ADD(l.createdAt, INTERVAL 14 DAY) as duedate,
    bi.image as image, 
    bi.author as author
    FROM lending as l
    LEFT JOIN book as b
    on l.bookId = b.id
    LEFT JOIN book_info as bi
    on b.infoid = bi.id
    where l.returnedAt is null;
  `) as models.Lending[];
  await Promise.all(items.map(async (item: models.Lending, idx) => {
    const rtnObj: models.Lending = Object.assign(item);
    const reservedUserArr: any[] = await executeQuery(`
    SELECT
    *
    FROM reservation 
    where bookInfoId = ?;
    `, [items[idx].bookInfoId]);
    rtnObj.overDueDay = 0;
    rtnObj.reservedNum = reservedUserArr.length;
    const nowDate = new Date();
    if (rtnObj.duedate < nowDate) {
      rtnObj.overDueDay += Math.floor(nowDate.getTime() / (1000 * 3600 * 24)
        - rtnObj.duedate.getTime() / (1000 * 3600 * 24));
    }
    return rtnObj;
  }));
  return { items };
};

export const setOverDueDay = async (items: any) => {
  const lending = await getLending();
  if (items) {
    return items.map((item: models.User) => {
      const rtnObj: models.User = Object.assign(item);
      rtnObj.lendings = lending.items.filter((lend) => lend.userId === item.id);
      rtnObj.overDueDay = 0;
      if (rtnObj.lendings.length) {
        const nowDate = new Date();
        rtnObj.lendings.forEach((lend: models.Lending) => {
          if (lend.duedate < nowDate) {
            rtnObj.overDueDay += Math.floor(nowDate.getTime() / (1000 * 3600 * 24)
              - lend.duedate.getTime() / (1000 * 3600 * 24));
          }
        });
      }
      return rtnObj;
    });
  }
  return items;
};

export const userReservations = async (userId: number) => {
  const reservationList = await executeQuery(`
    SELECT reservation.id as reservationId,
    reservation.bookInfoId as reservedBookInfoId,
    reservation.createdAt as reservationDate,
    reservation.endAt as endAt,
    (SELECT COUNT(*)
      FROM reservation
      WHERE status = 0
        AND bookInfoId = reservedBookInfoId
        AND createdAt <= reservationDate) as ranking,
    book_info.title as title
    FROM reservation
    LEFT JOIN book_info
    ON reservation.bookInfoId = book_info.id
    WHERE reservation.userId = ? AND reservation.status = 0;
  `, [userId]);
  return reservationList;
};

export const searchUserByNickName = async (nickname: string, limit: number, page: number) => {
  let items = (await executeQuery(`
    SELECT 
    *
    FROM user
    WHERE nickName LIKE ?
    LIMIT ?
    OFFSET ?;
  `, [`%${nickname}%`, limit, limit * page])) as models.User[];
  items = await setOverDueDay(items);
  const total = (await executeQuery(`
  SELECT FOUND_ROWS() as totalItems;
  `));
  const meta: types.Meta = {
    totalItems: total[0].totalItems,
    itemCount: items.length,
    itemsPerPage: limit,
    totalPages: Math.ceil(total[0].totalItems / limit),
    currentPage: page + 1,
  };
  return { items, meta };
};

export const searchUserById = async (id: number) => {
  const items = (await executeQuery(`
    SELECT 
    *
    FROM user
    WHERE id=?;
  `, [id])) as models.User[];
  return { items };
};

export const searchUserByEmail = async (email: string) => {
  const items = (await executeQuery(`
    SELECT 
    *
    FROM user
    WHERE email LIKE ?;
  `, [email])) as models.User[];
  return { items };
};

export const searchUserByIntraId = async (intraId: number) => {
  const result = (await executeQuery(`
    SELECT *
    FROM user
    WHERE
      intraId = ?
  `, [intraId])) as models.User[];
  return result;
};

export const searchAllUsers = async (limit: number, page: number) => {
  let items = (await executeQuery(`
    SELECT
    SQL_CALC_FOUND_ROWS
    *
    FROM user
    LIMIT ?
    OFFSET ?;
  `, [limit, limit * page])) as models.User[];
  items = await setOverDueDay(items);
  const total = (await executeQuery(`
  SELECT FOUND_ROWS() as totalItems;
  `));
  const meta: types.Meta = {
    totalItems: total[0].totalItems,
    itemCount: items.length,
    itemsPerPage: limit,
    totalPages: Math.ceil(total[0].totalItems / limit),
    currentPage: page + 1,
  };
  return { items, meta };
};

export const createUser = async (email: string, password: string) => {
  const emailList = await executeQuery(`
  SELECT email FROM user`);
  if (emailList.indexOf(email) !== -1) {
    throw new Error(errorCode.emailOverlap);
  }
  await executeQuery(`
    INSERT INTO user(
      email, password, nickName
    )
    VALUES (
      ?, ?, ?
    );
  `, [email, password, '']);
  return null;
};

export const updateUserEmail = async (id: number, email:string) => {
  const emailList = await executeQuery(`
  SELECT email FROM user`);
  if (emailList.indexOf(email) !== -1) {
    throw new Error(errorCode.emailOverlap);
  }
  await executeQuery(`
  UPDATE user 
  SET email = ?
  WHERE id = ?;
  `, [email, id]);
};

export const updateUserPassword = async (id: number, password: string) => {
  await executeQuery(`
  UPDATE user
  SET password = ?
  WHERE id = ?;
  `, [password, id]);
};

export const updateUserAuth = async (
  id: number,
  nickname: string,
  intraId: number,
  slack: string,
  role: number,
) => {
  const nicknameList = await executeQuery(`
  SELECT nickname FROM user`);
  if (nicknameList.indexOf(nickname) !== -1) {
    throw new Error(errorCode.nicknameOverlap);
  }
  let setString = '';
  const queryParameters = [];
  if (nickname !== '') {
    setString += 'nickname=?,';
    queryParameters.push(nickname);
  } if (intraId) {
    setString += 'intraId=?,';
    queryParameters.push(intraId);
  } if (slack !== '') {
    setString += 'slack=?,';
    queryParameters.push(slack);
  } if (role !== -1) {
    setString += 'role=?,';
    queryParameters.push(role);
  }
  setString = setString.slice(0, -1);
  queryParameters.push(id);
  await executeQuery(`
  UPDATE user 
  SET
  ${setString}
  where id=?
  `, queryParameters);
};
