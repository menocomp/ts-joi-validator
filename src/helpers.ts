import { Parser } from 'acorn';

export const zipObject = (props: [], values: []) => {
  return props.reduce((prev, prop, i) => {
    return Object.assign(prev, { [prop]: values[i] });
  }, {});
};

export const getFunctionParams = (fn: Function) => {
  const parsedFunction = Parser.parse(`function ${fn.toString()}`) as any;
  return parsedFunction.body[0].params.map((n: any) => n.name);
};
