import Joi, { SchemaLike, ValidationOptions, required } from "@hapi/joi";
import { Parser } from "acorn";

type TSJoiAssertion =
  | [SchemaLike, ValidationOptions?]
  | [SchemaLike, string | Error, ValidationOptions?];

const validationStore: {
  [methodName: string]: {
    params: {
      [paramPosition: number]: TSJoiAssertion;
    };
    method: {
      name?: TSJoiAssertion;
      params?: [];
    };
  };
} = {};

const getFunctionParams = (fn: Function) => {
  const parsedFunction = Parser.parse(`function ${fn.toString()}`) as any;
  return parsedFunction.body[0].params.map((n: any) => n.name);
};

const zipObject = (props: [], values: []) => {
  return props.reduce((prev, prop, i) => {
    return Object.assign(prev, { [prop]: values[i] });
  }, {});
};

const TsJoiMethod = (methodAssertion?: TSJoiAssertion) => (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  debugger;

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
    joiAssert(name, args);

    return originalFunction.apply(this, args);
  };
  return descriptor;
};

const TsJoiParam = (paramAssertion: TSJoiAssertion) => (
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

const baseJoiAssert = (value: any, joiAssertion: TSJoiAssertion) => {
  const [joiSchema] = joiAssertion;

  if (Joi.isSchema(joiSchema)) {
    if (
      typeof joiAssertion[1] === "string" ||
      joiAssertion[1] instanceof Error
    ) {
      const [, message, options] = joiAssertion;
      Joi.assert(value, joiSchema, message, options);
    } else {
      const [, options] = joiAssertion;
      Joi.assert(value, joiSchema, options);
    }
  }
};

const joiAssert = (methodName: string, params: []) => {
  if (!validationStore[methodName]) return;

  // Params validation
  debugger;

  for (let paramPosition in validationStore[methodName].params) {
    const paramAssertion = validationStore[methodName].params[paramPosition];

    baseJoiAssert(params[paramPosition], paramAssertion);
  }

  // Method validation
  if (!validationStore[methodName].method) return;
  const { name: methodAssertion, params: paramsList } = validationStore[
    methodName
  ].method;

  if (methodAssertion && paramsList) {
    const paramsObject = zipObject(paramsList, params);

    baseJoiAssert(paramsObject, methodAssertion);
  }
};

const xParam: TSJoiAssertion = [Joi.number().required().min(5)];

const yParam: TSJoiAssertion = [Joi.number()];

const methodAssertion: TSJoiAssertion = [
  Joi.object().keys({
    x: Joi.number().required().min(5),
    y: Joi.number(),
  }),
];

class xyz {
  @TsJoiMethod(methodAssertion)
  fake(x: string, @TsJoiParam(yParam) y?: number) {
    return x + y;
  }
}

const x = new xyz();
console.log(x.fake("5"));
