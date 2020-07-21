import Joi, { SchemaLike, ValidationOptions } from "@hapi/joi";

type ParamAssertion =
  | [SchemaLike, ValidationOptions?]
  | [SchemaLike, string | Error, ValidationOptions?];

type MethodAssertion = [SchemaLike, ValidationOptions?];

const validationStore: {
  [methodName: string]: {
    params: {
      [paramPosition: number]: ParamAssertion;
    };
    method?: MethodAssertion;
  };
} = {};

const TsJoiMethod = (methodAssertion?: MethodAssertion) => (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  debugger;
  if (!validationStore[name]) {
    validationStore[name] = { params: {}, method: methodAssertion };
  } else if (!validationStore[name].method) {
    validationStore[name].method = methodAssertion;
  }

  const originalFunction: Function = descriptor.value;

  descriptor.value = function (...args: any[]) {
    joiAssert(name, args);

    return originalFunction.apply(this, args);
  };
  return descriptor;
};

const TsJoiParam = (paramAssertion: ParamAssertion) => (
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

const joiAssert = (methodName: string, params: any[]) => {
  debugger;

  // Params validation
  for (let paramPosition in validationStore[methodName].params) {
    const paramAssertion = validationStore[methodName].params[paramPosition];

    const [joiSchema] = paramAssertion;

    if (Joi.isSchema(joiSchema)) {
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

  // Method validation
  const methodAssertion = validationStore[methodName].method;
  if (methodAssertion) {
    debugger;
    const [joiSchema, options] = methodAssertion;

    if (Joi.isSchema(joiSchema)) {
      try {
        Joi.assert(params, joiSchema, options);
      } catch (err) {
        debugger;
      }
    }
  }
};

const xParam: ParamAssertion = [Joi.number().required().min(5)];

const yParam: ParamAssertion = [Joi.number().min(5), "mina"];

const methodAssertion: MethodAssertion = [
  Joi.object().keys({
    x: Joi.number().required().min(5),
    y: Joi.number().min(5),
  }),
];

class xyz {
  @TsJoiMethod(methodAssertion)
  fake(x: string, y?: number) {
    return x + y;
  }
}

const x = new xyz();
console.log(x.fake("20"));
