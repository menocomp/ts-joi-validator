import Joi from '@hapi/joi';
import { TSJoiAssertion, TsJoiMethod } from '../../src';

const methodAssertion: TSJoiAssertion = [
  Joi.object().keys({
    x: Joi.number().required().min(5),
    y: Joi.number(),
  }),
];

class MethodDecorators {
  @TsJoiMethod(methodAssertion)
  fake(x: string, y?: number) {
    return x + y;
  }
}

const methodDecorators = new MethodDecorators();
console.log(methodDecorators.fake('5'));
