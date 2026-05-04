import { FilterQuery, Query } from 'mongoose';
interface QueryParams {
  searchTerm?: string;
  sort?: string;
  limit?: string;
  page?: string;
  fields?: string;
  [key: string]: unknown;
}

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query:QueryParams;

  constructor(modelQuery: Query<T[], T>, query:QueryParams) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

search(searchableFields: string[]) {
  const searchTerm = this?.query?.searchTerm as string;

  if (searchTerm) { // ✅ guard BEFORE calling .replace()
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    this.modelQuery = this.modelQuery.find({
      $or: searchableFields.map(
        (field) =>
          ({
            [field]: { $regex: escaped, $options: 'i' }, // ✅ use escaped, not searchTerm
          }) as FilterQuery<T>,
      ),
    });
  }

  return this;
}

  // filter() {
  //   const queryObj = { ...this.query }; // copy

  //   // Filtering
  //   const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

  //   excludeFields.forEach((el) => delete queryObj[el]);

  //   this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

  //   return this;
  // }

  filter() {
  const queryObj = { ...this.query };
  const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  excludeFields.forEach((el) => delete queryObj[el]);

  // Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  this.modelQuery = this.modelQuery.find(JSON.parse(queryStr));

  return this;
}

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  // src/builder/QueryBuilder.ts

async countTotal() {
  const totalQueries = this.modelQuery.getFilter();

  const total = await this.modelQuery.model.countDocuments(totalQueries);

  const page = Number(this?.query?.page) || 1;
  const limit = Number(this?.query?.limit) || 10;
  const totalPage = Math.ceil(total / limit);

  return { page, limit, total, totalPage };
}
}

export default QueryBuilder;
