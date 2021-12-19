import Joi from '@hapi/joi';
import { TSJoiValidation, TsJoiParam, TsJoiMethod } from '../../';

const xParam: TSJoiValidation = [Joi.number().required().min(6)];

const yParam: TSJoiValidation = [Joi.number().optional()];

class ParamsDecorators {
  @TsJoiMethod()
  fake(@TsJoiParam(xParam) x: string, @TsJoiParam(yParam) y?: number) {
    console.log(`x = ${x} and its type is ${typeof x}`);
    console.log(`y = ${y} and its type is ${typeof y}`);
  }
}

const paramsDecorators = new ParamsDecorators();
console.log(paramsDecorators.fake('7'));
