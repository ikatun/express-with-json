import express, { Router } from 'express';
export declare type JsonOrMiddlewareHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => Promise<object> | object | void | Promise<void>;
export interface IJsonErrorInfo {
    statusCode?: number;
}
export declare class JsonErrorResponse extends Error {
    body: object;
    errorInfo: IJsonErrorInfo;
    constructor(body: object, errorInfo?: IJsonErrorInfo);
    writeResponse(res: express.Response): void;
}
export declare const jsonHandler: (handler: JsonOrMiddlewareHandler) => (req: express.Request, res: express.Response, next: any) => Promise<void>;
export declare const middlewareHandler: (handler: JsonOrMiddlewareHandler) => (req: express.Request, res: express.Response, next: any) => Promise<void | object>;
export declare type EndpointMiddleware = (path: string, ...handlers: Array<JsonOrMiddlewareHandler>) => void;
export interface IExpressWithJson {
    getJson: EndpointMiddleware;
    patchJson: EndpointMiddleware;
    postJson: EndpointMiddleware;
    deleteJson: EndpointMiddleware;
    putJson: EndpointMiddleware;
    useAsync: (...handlers: Array<JsonOrMiddlewareHandler>) => void;
}
export declare function withJson<T extends express.Application | Router>(express: T): T & IExpressWithJson;
export default withJson;
