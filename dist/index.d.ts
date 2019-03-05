import express from 'express';
export declare type JsonHandler = (req: express.Request, res: express.Response) => Promise<object> | object;
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
export declare type EndpointMiddleware = (path: string, handler: JsonHandler) => void;
export interface IExpressWithJson {
    getJson: EndpointMiddleware;
    patchJson: EndpointMiddleware;
    postJson: EndpointMiddleware;
    deleteJson: EndpointMiddleware;
}
export declare function withJson<T extends express.Application>(express: T): T & IExpressWithJson;
