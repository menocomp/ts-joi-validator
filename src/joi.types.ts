import Joi, { SchemaLike, ValidationOptions } from '@hapi/joi';

export type TSJoiAssertion = [SchemaLike, ValidationOptions?] | [SchemaLike, string | Error, ValidationOptions?];
