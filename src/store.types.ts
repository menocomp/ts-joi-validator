import { TSJoiValidation } from './';

export type ValidationStore = {
  [methodName: string]: {
    params: {
      [paramPosition: number]: TSJoiValidation;
    };
    method: {
      name?: TSJoiValidation;
      params?: [];
    };
  };
};
