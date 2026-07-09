const Tour = require("./../models/tourModels");

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Missing name or price",
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";

  req.query.sort = "-ratingAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

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

exports.getAllTours = async (req, res) => {
  try {
    // const queryObj = { ...req.query };
    // const excludeQuery = ["page", "sort", "limit", "fields"];
    // excludeQuery.forEach((el) => {
    //   delete queryObj[el];
    // });

    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    // let query = Tour.find(JSON.parse(queryStr));

    // if (req.query.sort) {
    //   let sortQuery = req.query.sort.split(",").join(" ");

    //   query = query.sort(sortQuery);
    // } else {
    //   query = query.sort("-createdAt");
    // }

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    // const page = req.query.page * 1 || 1;
    // const lim = req.query.limit * 1 || 100;
    // const skip = lim * (page - 1);

    // query = query.skip(skip).limit(lim);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error("Page Doesnot Exists");
    // }

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: "Success",
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "Success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      data: {
        err,
      },
    });
  }

  // const id = req.params.id * 1;
  // // const tour = tours.find((el) => el.id == id);

  // res.status(200).json({
  //   status: "Success",
  //    data: {
  //      tour,
  //    },
  // });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: "Success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      error: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      error: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingAvg: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: "$difficulty",
          numRatings: { $sum: "$ratingQuantity" },
          numTours: { $sum: 1 },
          avgRating: { $avg: "$ratingAvg" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    res.status(200).json({
      status: "Success",
      items: stats.length,
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      error: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
    ]);
    res.status(200).json({
      status: "Success",
      items: plan.length,
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      error: err,
    });
  }
};
