import Joi, { ValidationError } from '@hapi/joi';
import { assert } from 'chai';
import { TSJoiAssertion, TsJoiMethod } from '../src';

describe('MethodDecorators', function () {
  describe('With 1 argument', function () {
    const methodAssertion: TSJoiAssertion = [
      Joi.object().keys({
        x: Joi.string(),
      }),
    ];

    class MethodDecorators1 {
      @TsJoiMethod(methodAssertion)
      fake1(x: string) {
        return x;
      }
    }

    const validTests = [
      { args: '1' },
      { args: ' ' },
      { args: 'x' },
      { args: 'true' },
      { args: undefined },
      { args: 'undefined' },
    ];

    validTests.forEach(function (test) {
      it(`Must pass --> ${test.args} <--`, function () {
        const methodDecorators = new MethodDecorators1();

        methodDecorators.fake1(test.args as any);
      });
    });

    const invalidTests = [
      { args: '' },
      { args: null },
      { args: true },
      { args: false },
      { args: {} },
      { args: [] },
      { args: () => {} },
      { args: function () {} },
    ];

    invalidTests.forEach(function (test) {
      it(`Must fail --> ${test.args} <--`, function () {
        const methodDecorators = new MethodDecorators1();

        try {
          methodDecorators.fake1(test.args as any);
          assert.fail();
        } catch (e) {
          assert.instanceOf(e, ValidationError);
        }
      });
    });
  });

  describe('With 2 arguments', function () {
    const methodAssertion: TSJoiAssertion = [
      Joi.object().keys({
        x: Joi.boolean(),
        y: Joi.number().max(5),
      }),
    ];

    class MethodDecorators2 {
      @TsJoiMethod(methodAssertion)
      fake2(x: boolean, y: number) {
        return;
      }
    }

    const validTests = [
      { args: [true, 0] },
      { args: [false, -0] },
      { args: ['true', 0] },
      { args: ['false', -0] },
      { args: [undefined, undefined] },
      { args: [false, 5] },
    ];

    validTests.forEach(function (test) {
      it(`Must pass --> ${test.args} <--`, function () {
        const methodDecorators = new MethodDecorators2();

        methodDecorators.fake2(test.args[0] as any, test.args[1] as any);
      });
    });

    const invalidTests = [
      { args: ['', null] },
      { args: [null, 0] },
      { args: [true, ''] },
      { args: [{}, []] },
      { args: [true, 6] },
    ];

    invalidTests.forEach(function (test) {
      it(`Must fail --> ${test.args} <--`, function () {
        const methodDecorators = new MethodDecorators2();

        try {
          methodDecorators.fake2(test.args[0] as any, test.args[1] as any);
          assert.fail();
        } catch (e) {
          assert.instanceOf(e, ValidationError);
        }
      });
    });
  });
});
