import Joi from '@hapi/joi';

const methodAssertion = [
  Joi.object().keys({
    x: Joi.number().required().max(5),
    y: Joi.number().required(),
  }),
  { abortEarly: false, convert: false },
] as const;

class MethodDecorators {
  fake(x: string, y?: number) {
    Joi.assert({ x, y }, ...methodAssertion);
    return x + y;
  }
}

const methodDecorators = new MethodDecorators();
console.log(methodDecorators.fake('5', 6));
