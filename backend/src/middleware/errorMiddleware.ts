import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.js";

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        });
    }
    
    return res.status(500).json({
    status: 'error',
    message: err.message,
    });  
}

export default errorHandler