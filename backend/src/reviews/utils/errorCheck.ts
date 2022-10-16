import * as errorCode from '../../utils/error/errorCode';
import * as reviewsService from "../reviews.service";
import {getReviewsUserId} from "../reviews.service";
import {NextFunction} from "express";
import ErrorResponse from "../../utils/error/errorResponse";
import {err} from "../reviews.controller";

export const reviewsIdParseCheck = async (
    reviewsId : string,
    next : NextFunction
) => {
    let result : number;
    try {
        result = parseInt(reviewsId, 10);
        return result;
    } catch (error : any) {
        // next(new ErrorResponse(errorCode.INVALID_INPUT_REVIEWS, 400));
        throw new Error(errorCode.INVALID_INPUT_REVIEWS);
    }
    return 0;
};

export const reviewsIdExistCheck = async (
    reviewsId : number,
    next : NextFunction
) => {
    let result : number;
    try {
        result = await reviewsService.getReviewsUserId(reviewsId);
        return result;
    } catch (error : any) {
        // next(new ErrorResponse(errorCode.NOT_FOUND_REVIEWS, 404));
        throw new Error(errorCode.NOT_FOUND_REVIEWS);
    }
    return 0;
};

export const idAndTokenIdSameCheck = async (
    id : number,
    tokenId : number,
    next : NextFunction
) => {
    if (id !== tokenId) {
        // next(new ErrorResponse(errorCode.UNAUTHORIZED_REVIEWS, 400));
        throw new Error(errorCode.UNAUTHORIZED_REVIEWS);
    }
};

