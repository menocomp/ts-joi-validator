import { Parser } from 'acorn';

export const zipObject = (props: unknown[], values: unknown[]) => {
  return props.reduce((prev, prop, i) => {
    return Object.assign(prev, { [prop as string]: values[i] });
  }, {});
};

export const getFunctionParams = (fn: Function) => {
  const parsedFunction = Parser.parse(`function ${fn.toString()}`, { ecmaVersion: 'latest' }) as any;
  return parsedFunction.body[0].params.map((n: any) => n.name);
};
