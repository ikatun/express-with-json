import express, { Router } from 'express';

export type JsonOrMiddlewareHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => Promise<object> | object | void | Promise<void>;

export interface IJsonErrorInfo {
  statusCode?: number;
}

const defaultErrorInfo: IJsonErrorInfo = {
  statusCode: 500,
};

export class JsonErrorResponse extends Error {
  public constructor(public body: object, public errorInfo: IJsonErrorInfo = defaultErrorInfo) {
    super();
    // @ts-ignore
    this.__proto__ = JsonErrorResponse.prototype // required for instanceof to work after transpilation
  }

  public writeResponse(res: express.Response) {
    const { statusCode } = this.errorInfo;
    if (statusCode !== undefined) {
      res.status(statusCode);
    }
    res.send(this.body);
  }
}

export const jsonHandler = (handler: JsonOrMiddlewareHandler) => async (req: express.Request, res: express.Response, next) => {
  try {
    const handlerResponse = await handler(req, res);
    res.json(handlerResponse);
  } catch (e) {
    if (e instanceof JsonErrorResponse) {
      e.writeResponse(res)
    } else {
      next(e);
    }
  }
};

export const middlewareHandler = (handler: JsonOrMiddlewareHandler) => async (req: express.Request, res: express.Response, next) => {
  if (handler.length > 2) {
    return handler(req, res, next);
  }
  try {
    await handler(req, res);
    next();
  } catch (e) {
    if (e instanceof JsonErrorResponse) {
      e.writeResponse(res)
    } else {
      next(e);
    }
  }
};

export type EndpointMiddleware = (path: string, ...handlers: Array<JsonOrMiddlewareHandler>) => void;

export interface IExpressWithJson {
  getJson: EndpointMiddleware;
  patchJson: EndpointMiddleware;
  postJson: EndpointMiddleware;
  deleteJson: EndpointMiddleware;
  putJson: EndpointMiddleware;
  useAsync: (...handlers: Array<JsonOrMiddlewareHandler>) => void;
}

function last<T>(xs: Array<T>): T {
  return xs[xs.length - 1];
}

function init<T>(xs: Array<T>): Array<T> {
  return xs.slice(0, -1);
}

function toRegularExpressArgs(handlers: Array<JsonOrMiddlewareHandler>) {
  return [...init(handlers).map(middlewareHandler), jsonHandler(last(handlers))];
}

export function withJson<T extends express.Application | Router>(express: T): T & IExpressWithJson {
  express['getJson'] = (path, ...handlers) => express.get(path, ...toRegularExpressArgs(handlers));
  express['patchJson'] = (path, ...handlers) => express.patch(path, ...toRegularExpressArgs(handlers));
  express['postJson'] = (path, ...handlers) => express.post(path, ...toRegularExpressArgs(handlers));
  express['deleteJson'] = (path, ...handlers) => express.delete(path, ...toRegularExpressArgs(handlers));
  express['putJson'] = (path, ...handlers) => express.put(path, ...toRegularExpressArgs(handlers));
  express['useAsync'] = (...handlers) => express.use(...handlers.map(middlewareHandler));

  return express as any;
}

export default withJson;
