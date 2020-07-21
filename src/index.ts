import Joi, { SchemaLike, ValidationOptions } from "@hapi/joi";

type ParamAssertion =
  | [SchemaLike, ValidationOptions?]
  | [SchemaLike, string | Error, ValidationOptions?];

const validationStore: {
  [methodName: string]: {
    [paramPosition: number]: ParamAssertion;
  };
} = {};

const AssertFn = (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  const originalFunction: Function = descriptor.value;

  descriptor.value = function (...args: any[]) {
    joiAssert(name, args);

    return originalFunction.apply(this, args);
  };
  return descriptor;
};

const joiAssert = (methodName: string, params: any[]) => {
  for (let paramPosition in validationStore[methodName]) {
    const paramAssertion = validationStore[methodName][paramPosition];

    const [joiSchema] = paramAssertion;

    if (Joi.isSchema(joiSchema)) {
      debugger;
      if (
        typeof paramAssertion[1] === "string" ||
        paramAssertion[1] instanceof Error
      ) {
        const [, message, options] = paramAssertion;
        Joi.assert(params[paramPosition], joiSchema, message, options);
      } else {
        const [, options] = paramAssertion;
        Joi.assert(params[paramPosition], joiSchema, options);
      }
    }
  }
};

const TsJoi = (paramAssertion: ParamAssertion) => (
  target: any,
  name: string,
  position: number
) => {
  validationStore[name] = {
    ...validationStore[name],
    [position.toString()]: paramAssertion,
  };
};

const xParam: ParamAssertion = [
  Joi.number().required().min(5),
];

const yParam: ParamAssertion = [
  Joi.number().min(5),
];

class xyz {
  @AssertFn
  fake(@TsJoi(xParam) x: string, @TsJoi(yParam) y?: number) {
    return x + y;
  }
}

const x = new xyz();
console.log(x.fake("20"));
