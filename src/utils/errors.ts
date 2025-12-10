/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";

export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class RequestError extends BaseError {
  public code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export class ServiceError extends Error {
  public code;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export class DocumentNotFoundError extends ServiceError {
    constructor(id: string) {
        super(StatusCodes.NOT_FOUND, `No Document found with id ${id}`);
    }
}

export class ServerError extends Error {
  constructor(
    public code: number,
    public message: string,
    public originalError?: any,
    public meta?: any,
  ) {
    super();
  }

  public get responseJson() {
    return { ...this, originalError: undefined };
  }
}
