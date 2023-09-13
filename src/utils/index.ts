const customPick = <T extends object, K extends keyof T>({
  object,
  keys,
}: {
  object: T;
  keys: K[];
}) =>
  keys.reduce((result, key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = object[key];
    }
    return result;
  }, {} as Pick<T, K>);

export { customPick };
