import Joi from '@hapi/joi';
import { TsJoiParam, TsJoiMethod, TSJoiValidation } from '../../';

const xParam: TSJoiValidation = [Joi.string()];

const methodValidation: TSJoiValidation = [
  Joi.object().keys({
    x: Joi.string().min(2),
    y: Joi.number().min(5),
  }),
];

class MethodParamsDecorators {
  @TsJoiMethod(methodValidation)
  fake(@TsJoiParam(xParam) x: string, y?: number) {
    console.log(`x = ${x} and its type is ${typeof x}`);
    console.log(`y = ${y} and its type is ${typeof y}`);
  }
}

const methodParamsDecorators = new MethodParamsDecorators();
console.log(methodParamsDecorators.fake('66', 5));
