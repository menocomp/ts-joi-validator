import Joi from '@hapi/joi';
import { TSJoiValidation, TsJoiMethod } from '../../';

const methodValidation: TSJoiValidation = [
  Joi.object().keys({
    x: Joi.number().required().min(5),
    y: Joi.number().allow(null),
  }),
];

class MethodDecorators {
  @TsJoiMethod(methodValidation)
  fake(x: string, y?: number | null) {
    console.log(`x = ${x} and its type is ${typeof x}`);
    console.log(`y = ${y} and its type is ${typeof y}`);
  }
}

const methodDecorators = new MethodDecorators();
methodDecorators.fake('6', null);
