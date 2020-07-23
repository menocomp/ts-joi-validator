import { TSJoiAssertion } from './';

export type ValidationStore = {
  [methodName: string]: {
    params: {
      [paramPosition: number]: TSJoiAssertion;
    };
    method: {
      name?: TSJoiAssertion;
      params?: [];
    };
  };
};
