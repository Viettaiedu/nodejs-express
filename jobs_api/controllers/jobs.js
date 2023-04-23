const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const mongoose = require("mongoose");
const moment = require("moment");
const getJobs = async (req, res) => {
  const {
    userInfo: { userId },
    query: { status, jobType, search, sort },
  } = req;
  const queryObject = {
    createdBy: userId,
  };
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.company = { $regex: search, $options: "i" };
  }

  let results = Job.find(queryObject);
  //sort
  if (sort === "lastest") {
    results = results.sort("-createdAt");
  }
  if (sort === "oldest") {
    results = results.sort("createdAt");
  }
  if (sort === "a-z") {
    results = results.sort("-position");
  }
  if (sort === "z-a") {
    results = results.sort("position");
  }

  // pagination

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  results = results.skip(skip).limit(limit);
  const jobs = await results;
  const totalJobs = await Job.countDocuments(queryObject);
  const numberPages = Math.ceil(totalJobs / limit);
  res.status(StatusCodes.OK).json({
    jobs,
    nbHits: totalJobs,
    currentPage: page,
    numberPages,
  });
};
const getJob = async (req, res) => {
  const {
    userInfo: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({
    createdBy: userId,
    _id: jobId,
  });
  if (!job) throw new NotFoundError("job not found with id " + jobId);
  res.status(StatusCodes.OK).json({ job });
};
const createJob = async (req, res) => {
  const { position, company } = req.body;
  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }
  req.body.createdBy = req.userInfo.userId;
  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.OK).json({ job });
};
const updateJob = async (req, res) => {
  const {
    body: { position, company },
    userInfo: { userId },
    params: { id: jobId },
  } = req;
  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }
  const isCheckJob = await Job.findOne({
    createdBy: userId,
    _id: jobId,
  });
  if (!isCheckJob) throw new NotFoundError("job not found with id " + jobId);
  const job = await Job.findByIdAndUpdate(
    { _id: jobId },
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    userInfo: { userId },
    params: { id: jobId },
  } = req;
  const isCheckJob = await Job.findOne({
    createdBy: userId,
    _id: jobId,
  });
  if (!isCheckJob) throw new NotFoundError("job not found with id " + jobId);
  const job = await Job.findByIdAndDelete({ _id: jobId });
  res.status(StatusCodes.OK).json({ message: "Delete job successful", job });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.userInfo.userId) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  const defaultStats = {
    pending: stats.pending || 0,
    declined: stats.declined || 0,
    interview: stats.interview || 0,
  };
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.userInfo.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .lang("vi")
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.json({ monthlyApplications, defaultStats });
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
};
