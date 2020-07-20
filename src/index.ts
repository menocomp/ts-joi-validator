const validationStore: {
  [methodName: string]: {
    [paramPosition: number]: any[];
  };
} = {};

const AssertFn = (
  target: any,
  name: string,
  descriptor: PropertyDescriptor
) => {
  const originalFunction: Function = descriptor.value;

  descriptor.value = function (...args: any[]) {
    if (!validate(name, args)) {
      throw new Error("Validation Error");
    }

    return originalFunction.apply(this, args);
  };
  return descriptor;
};

const validate = (methodName: string, params: any[]): boolean => {
  let isValid = true;
  for (let paramPosition in validationStore[methodName]) {
    for (let validator of validationStore[methodName][paramPosition]) {
      switch (validator) {
        case "required":
          isValid = isValid && params[paramPosition] !== undefined;
          break;
        case "number":
          isValid = isValid && Number.isInteger(params[paramPosition]);
          break;
      }
    }
  }
  return isValid;
};

const IsNumber = (target: any, name: string, position: number) => {
  validationStore[name] = {
    ...validationStore[name],
    [position.toString()]: [
      ...(validationStore[name]?.[position] ?? []),
      "number",
    ],
  };
};

const Required = (target: any, name: string, position: number) => {
  validationStore[name] = {
    ...validationStore[name],
    [position.toString()]: [
      ...(validationStore[name]?.[position] ?? []),
      "required",
    ],
  };
};

class xyz {
  @AssertFn
  fake(@IsNumber x: number, @Required y: number) {
    return x + y;
  }
}

const x = new xyz();
console.log(x.fake(1, 2));
