
export interface CoreOptions <T extends object>{
  keyPrefix?: string;
  initialValues: T;
  /**
   * @default .
   */
  separator?: string;
  isPlainObject?(obj: unknown):boolean;
}

function defaultIsPlainObject(obj: unknown): obj is object {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.getPrototypeOf(obj) === Object.prototype
  );
}

export default function core<T extends object>({
  initialValues,
  keyPrefix = '',
  separator = '.',
  isPlainObject = defaultIsPlainObject
}: CoreOptions<T>) {
  const result: Record<string, unknown> = {};
  type Frame = { obj: Record<string, unknown>; prefix: string };
  const stack: Frame[] = [{ obj: initialValues as Record<string, unknown>, prefix: keyPrefix }];

  while (stack.length) {
    const { obj, prefix } = stack.pop() as Frame;
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}${separator}${key}` : key;
      if (isPlainObject(value)) {
        stack.push({ obj: value as Record<string, unknown>, prefix: newKey });
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
}