import Joi from '@hapi/joi';
import { TSJoiAssertion, TsJoiParam, TsJoiMethod } from '../src';

const xParam: TSJoiAssertion = [Joi.number().required().min(6)];

const yParam: TSJoiAssertion = [Joi.number().required()];

class ParamsDecorators {
  @TsJoiMethod()
  fake(@TsJoiParam(xParam) x: string, @TsJoiParam(yParam) y?: number) {
    return x + y;
  }
}

const paramsDecorators = new ParamsDecorators();
console.log(paramsDecorators.fake('1970'));
