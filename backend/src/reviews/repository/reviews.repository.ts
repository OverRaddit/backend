import { executeQuery } from '../../mysql';
import { Reviews } from '../entity/reviews.entity';
import { BookInfo } from '../../books/entity/bookInfo.entity';
import { jipDataSource } from '../../../app-data-source';

export const createReviews = async (userId: number, bookInfoId: number, content: string) => {
  // bookInfoId가 유효한지 확인
  const numberOfBookInfo = await jipDataSource.createQueryBuilder()
    .select('COUNT(*)')
    .from(BookInfo, 'book_info').where('id = :bookInfoId', { bookInfoId })
    .getRawOne();

  if (numberOfBookInfo) {
    const review : Reviews = new Reviews(userId, bookInfoId, content);
    jipDataSource.createQueryBuilder().insert().into(Reviews).values(review)
      .execute();
  }
};

export const getReviewsPage = async (bookInfoId: number, userId: number, page: number, sort: 'ASC' | 'DESC') => {
  const middleQuery = jipDataSource.createQueryBuilder('reviews', 'r')
    .innerJoin('user', 'u', 'r.userId = u.id')
    .innerJoin('book_info', 'b', 'r.bookInfoId = b.id')
    .select('r.id', 'reviewsId')
    .addSelect('r.userId', 'reviewerId')
    .addSelect('r.bookInfoId')
    .addSelect('r.content')
    .addSelect('r.createdAt')
    .addSelect('b.title')
    .addSelect('u.nickname')
    .where('r.isDeleted = false');
  if (Number.isNaN(bookInfoId) === false) {
    middleQuery.andWhere('r.bookInfoId = :bookInfoId', { bookInfoId });
  }
  if (Number.isNaN(userId) === false) {
    middleQuery.andWhere('r.userId = :userId', { userId });
  }
  middleQuery.orderBy('r.id', sort);
  const reviews = middleQuery.take(10).skip(page * 10).getRawMany();
  return (reviews);
};

export const getReviewsCounts = async (bookInfoId: number, userId: number) => {
  const middleQuery = jipDataSource.createQueryBuilder(Reviews, 'r')
    .select('COUNT(*)')
    .where('r.isDeleted = false');
  if (Number.isNaN(bookInfoId) === false) {
    middleQuery.andWhere('r.bookInfoId = :bookInfoId', { bookInfoId });
  }
  if (Number.isNaN(userId) === false) {
    middleQuery.andWhere('r.userId = :userId', { userId });
  }
  const counts = middleQuery.getRawOne();
  return (counts);
};

export const getReviewsUserId = async (
  reviewsId : number,
) => {
  const reviewsUserId = await executeQuery(`
    SELECT
      userId
    FROM reviews
    WHERE id = ? 
    AND isDeleted = false
    `, [reviewsId]);
  return reviewsUserId[0].userId;
};

export const updateReviews = async (
  reviewsId : number,
  userId : number,
  content : string,
) => {
  await jipDataSource.createQueryBuilder()
    .update(Reviews)
    .set({ content })
    .set({ updateUserId: userId })
    .where('id = :reviewsId', { reviewsId })
    .execute();
};

export const deleteReviews = async (reviewsId: number, deleteUser: number) => {
  await jipDataSource.createQueryBuilder()
    .update(Reviews)
    .set({ isDeleted: true })
    .set({ deleteUserId: deleteUser })
    .where('id = :reviewsId', { reviewsId })
    .execute();
};
