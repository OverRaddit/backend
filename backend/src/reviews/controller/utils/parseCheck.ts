export const sortParse = (
  sort : any,
) : 'ASC' | 'DESC' => {
  if (sort === 'asc' || sort === 'desc') {
    return sort.toUpperCase();
  }
  return 'DESC';
};

export const pageParse = (
  page : number,
) : number => {
  return Number.isNaN(page) ? 0 : page;
};
