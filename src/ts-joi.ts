import { TSJoiAssertion } from "./joi.types";
import { ValidationStore } from "./store.types";
import { joiAssert } from "./joi.assert";
import { getFunctionParams } from "./helpers";

const validationStore: ValidationStore = {};

export const TsJoiMethod = (methodAssertion?: TSJoiAssertion) => (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  if (methodAssertion) {
    const params = getFunctionParams(target[name]);

    if (!validationStore[name]) {
      validationStore[name] = {
        params: {},
        method: { name: methodAssertion, params },
      };
    } else if (!validationStore[name].method) {
      validationStore[name].method = { name: methodAssertion, params };
    }
  }

  const originalFunction: Function = descriptor.value;

  descriptor.value = function (...args: []) {
    joiAssert(validationStore, name, args);

    return originalFunction.apply(this, args);
  };
  return descriptor;
};

export const TsJoiParam = (paramAssertion: TSJoiAssertion) => (
  target: any,
  name: string,
  position: number
) => {
  validationStore[name] = {
    ...validationStore[name],
    params: {
      ...validationStore[name]?.params,
      [position.toString()]: paramAssertion,
    },
  };
};
