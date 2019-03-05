import express from 'express';

export type JsonHandler = (req: express.Request, res: express.Response) => Promise<object> | object;

export interface IJsonErrorInfo {
  statusCode?: number;
}

const defaultErrorInfo: IJsonErrorInfo = {
  statusCode: 500,
};

export class JsonErrorResponse extends Error {
  public constructor(public body: object, public errorInfo: IJsonErrorInfo = defaultErrorInfo) {
    super();
  }

  public writeResponse(res: express.Response) {
    const { statusCode } = this.errorInfo;
    if (statusCode !== undefined) {
      res.status(statusCode);
    }
    res.send(this.body);
  }
}

export const jsonHandler = (handler: JsonHandler) => async (req: express.Request, res: express.Response, next) => {
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
}

export type EndpointMiddleware = (path: string, handler: JsonHandler) => void;

export interface IExpressWithJson {
  getJson: EndpointMiddleware;
  patchJson: EndpointMiddleware;
  postJson: EndpointMiddleware;
  deleteJson: EndpointMiddleware;
}

export function withJson<T extends express.Application>(express: T): T & IExpressWithJson {
  express['getJson'] = (path, handler) => express.get(path, jsonHandler(handler));
  express['patchJson'] = (path, handler) => express.patch(path, jsonHandler(handler));
  express['postJson'] = (path, handler) => express.post(path, jsonHandler(handler));
  express['deleteJson'] = (path, handler) => express.delete(path, jsonHandler(handler));

  return express as any;
}
