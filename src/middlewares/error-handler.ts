import type { ErrorRequestHandler, RequestHandler } from 'express';
import { HttpError } from '../errors/http-error';
import { renderError } from '../views/error.view';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json(renderError(`Cannot ${req.method} ${req.path}`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // HttpError and body-parser errors (e.g. malformed JSON) carry their own status.
  const status: number = typeof err?.status === 'number' ? err.status : 500;
  const exposeMessage = status < 500 || err instanceof HttpError;

  if (status >= 500) console.error(err);

  res.status(status).json(renderError(exposeMessage ? err.message : 'Internal Server Error'));
};
