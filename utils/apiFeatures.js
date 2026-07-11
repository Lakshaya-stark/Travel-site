class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeQuery = ["page", "sort", "limit", "fields"];
    excludeQuery.forEach((el) => {
      delete queryObj[el];
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortQuery = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortQuery);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const lim = this.queryString.limit * 1 || 100;
    const skip = lim * (page - 1);

    this.query = this.query.skip(skip).limit(lim);

    return this;
  }
}

module.exports = APIFeatures;
