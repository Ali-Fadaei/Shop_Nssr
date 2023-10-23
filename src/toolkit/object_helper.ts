export function isPlainObject(obj) {
  const prototype = Object.getPrototypeOf(obj);
  return prototype === Object.getPrototypeOf({}) || prototype === null;
}
