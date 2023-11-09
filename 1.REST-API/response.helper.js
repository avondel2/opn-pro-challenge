exports.responseService = (response, statusCode = 500, data = undefined) => {
  return response.status(ResponseData[statusCode].httpStatus).json({
    statusCode,
    message: ResponseData[statusCode].message,
    responseData: data,
  })
}

const ResponseData = {
  0: {
    message: 'Success',
    httpStatus: 200,
  },
  201: {
    message: 'Created',
    httpStatus: 201,
  },
  400: {
    message: 'Invalid Data',
    httpStatus: 400,
  },
  401: {
    message: 'Unauthorized',
    httpStatus: 401,
  },
  403: {
    message: 'Permission Denied',
    httpStatus: 403,
  },
  500: {
    message: 'System Error',
    httpStatus: 500,
  },
}
