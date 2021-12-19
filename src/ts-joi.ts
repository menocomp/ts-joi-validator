import { TSJoiValidation } from './joi.types';
import { ValidationStore } from './store.types';
import { joiValidate } from './joi.validate';
import { getFunctionParams } from './helpers';

const validationStore: ValidationStore = {};

export const TsJoiMethod =
  (methodValidation?: TSJoiValidation) => (target: any, name: string, descriptor: PropertyDescriptor) => {
    if (methodValidation) {
      const params = getFunctionParams(target[name]);

      if (!validationStore[name]) {
        validationStore[name] = {
          params: {},
          method: { name: methodValidation, params },
        };
      } else if (!validationStore[name].method) {
        validationStore[name].method = { name: methodValidation, params };
      }
    }

    const originalFunction: Function = descriptor.value;

    descriptor.value = function (...args: []) {
      const newArgs = joiValidate(validationStore, name, args);

      return originalFunction.apply(this, Object.values(newArgs));
    };
    return descriptor;
  };

export const TsJoiParam = (paramValidation: TSJoiValidation) => (target: any, name: string, position: number) => {
  validationStore[name] = {
    ...validationStore[name],
    params: {
      ...validationStore[name]?.params,
      [position.toString()]: paramValidation,
    },
  };
};
