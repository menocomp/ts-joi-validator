import Joi from '@hapi/joi';
import { TsJoiParam, TsJoiMethod, TSJoiAssertion } from '../../src';

const yParam: TSJoiAssertion = [Joi.number()];

const methodAssertion: TSJoiAssertion = [
  Joi.object().keys({
    x: Joi.number().required().min(6),
    y: Joi.number().required(),
  }),
  { abortEarly: false },
];

class MethodParamsDecorators {
  @TsJoiMethod(methodAssertion)
  fake(x: string, @TsJoiParam(yParam) y?: number) {
    return x + y;
  }
}

const methodParamsDecorators = new MethodParamsDecorators();
console.log(methodParamsDecorators.fake('5'));
