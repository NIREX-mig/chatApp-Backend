import { validationResult } from "express-validator";
import ApiResponse from "../utils/apiResponse.js"

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    res.status(400).json(
      new ApiResponse(400,"Validation Error!", {Error : errors.array()})
    )
  };