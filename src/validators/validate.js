import { validationResult } from "express-validator";
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    res.status(400).json(
      new ApiResponse(400,"Validation Error!", {Error : errors.array()})
    )
    // const extractedErrors = [];
    // errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));
  
    // // 422: Unprocessable Entity
    // throw new ApiError(422, "Validation Error!", extractedErrors);
    // console.log(extractedErrors)
  };