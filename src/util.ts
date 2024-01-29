export const parseNumberAttr = (input: string | null, defaultVal: number = 0): number => {
  const  result = parseInt(input || '', 10);
  return !isNaN(result) ? result : defaultVal;
};

export const parseBooleanAttr = (input: string | null): Boolean => {
  return (typeof input !== 'string');
};

export const parseStringAttr = (input: string | null, defaultVal: string = ''): string => {
  return (typeof input === 'string') ? input : defaultVal;
};
