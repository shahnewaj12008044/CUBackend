export const flattenNestedObject = (
  prefix: string,
  nestedObj: Record<string, unknown> | undefined,
  payload: Record<string, unknown>,
) => {
  const flattenedData: Record<string, unknown> = { ...payload };

  if (nestedObj) {
    delete flattenedData[prefix];
    Object.keys(nestedObj).forEach((key) => {
      flattenedData[`${prefix}.${key}`] = nestedObj[key];
    });
  }

  return flattenedData;
};