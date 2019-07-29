import express, { Router } from 'express';
export declare type JsonHandler = (req: express.Request, res: express.Response) => Promise<object> | object;
export declare type MiddlewareHandler = (req: express.Request, res: express.Response, next?: express.NextFunction) => any;
export declare type JsonOrMiddlewareHandler = JsonHandler | MiddlewareHandler;
export interface IJsonErrorInfo {
    statusCode?: number;
}
export declare class JsonErrorResponse extends Error {
    body: object;
    errorInfo: IJsonErrorInfo;
    constructor(body: object, errorInfo?: IJsonErrorInfo);
    writeResponse(res: express.Response): void;
}
export declare const jsonHandler: (handler: JsonHandler) => (req: express.Request, res: express.Response, next: any) => Promise<void>;
export declare const middlewareHandler: (handler: MiddlewareHandler) => (req: express.Request, res: express.Response, next: any) => Promise<MiddlewareHandler | undefined>;
export declare type EndpointMiddleware = (path: string, ...handlers: Array<JsonOrMiddlewareHandler>) => void;
export interface IExpressWithJson {
    getJson: EndpointMiddleware;
    patchJson: EndpointMiddleware;
    postJson: EndpointMiddleware;
    deleteJson: EndpointMiddleware;
    putJson: EndpointMiddleware;
}
export declare function withJson<T extends express.Application | Router>(express: T): T & IExpressWithJson;
export default withJson;
