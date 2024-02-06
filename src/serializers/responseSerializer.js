const httpStatus = require("http-status");

exports.successResponse = ({
  response,
  status,
  totalData,
  limit = 10,
  page,
  data,
}) => {
  response.status(status || httpStatus.OK).json({
    status: status || httpStatus.OK,
    message: "OK",
    totalData: totalData,
    totalPage: Math.ceil(totalData / limit) || 1,
    currentPage: parseInt(page) || 1,
    data: data,
  });
};

exports.errorResponse = ({ response, error }) => {
  response.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json({
    status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
    message: error.message,
    data: null,
  });
};
