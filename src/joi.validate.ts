import { TSJoiValidation } from './';
import { zipObject } from './helpers';
import { ValidationStore } from './store.types';

const baseJoiValidation = (value: unknown, joiValidation: TSJoiValidation) => {
  const [joiSchema, options] = joiValidation;

  const { error, value: newValue } = joiSchema.validate(value, options);
  if (error) {
    throw error;
  }
  return newValue;
};

export const joiValidate = (validationStore: ValidationStore, methodName: string, params: unknown[]) => {
  if (!validationStore[methodName]) return;

  // Params validation
  for (const paramPosition in validationStore[methodName].params) {
    const paramValidation = validationStore[methodName].params[paramPosition];

    params[paramPosition] = baseJoiValidation(params[paramPosition], paramValidation);
  }

  // Method validation
  if (!validationStore[methodName].method) {
    return params;
  }

  const { name: methodValidation, params: paramsList } = validationStore[methodName].method;

  if (methodValidation && paramsList) {
    const paramsObject = zipObject(paramsList, params);

    return baseJoiValidation(paramsObject, methodValidation);
  }
};
