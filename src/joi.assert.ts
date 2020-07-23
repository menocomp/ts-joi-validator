import Joi from '@hapi/joi';
import { TSJoiAssertion } from './';
import { zipObject } from './helpers';
import { ValidationStore } from './store.types';

const baseJoiAssert = (value: any, joiAssertion: TSJoiAssertion) => {
  const [joiSchema] = joiAssertion;

  if (Joi.isSchema(joiSchema)) {
    if (typeof joiAssertion[1] === 'string' || joiAssertion[1] instanceof Error) {
      const [, message, options] = joiAssertion;
      Joi.assert(value, joiSchema, message, options);
    } else {
      const [, options] = joiAssertion;
      Joi.assert(value, joiSchema, options);
    }
  }
};

export const joiAssert = (validationStore: ValidationStore, methodName: string, params: []) => {
  if (!validationStore[methodName]) return;

  // Params validation
  for (const paramPosition in validationStore[methodName].params) {
    const paramAssertion = validationStore[methodName].params[paramPosition];

    baseJoiAssert(params[paramPosition], paramAssertion);
  }

  // Method validation
  if (!validationStore[methodName].method) return;
  const { name: methodAssertion, params: paramsList } = validationStore[methodName].method;

  if (methodAssertion && paramsList) {
    const paramsObject = zipObject(paramsList, params);

    baseJoiAssert(paramsObject, methodAssertion);
  }
};
