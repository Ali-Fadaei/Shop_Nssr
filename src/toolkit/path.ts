import path from 'path';

/** returns module dirName */
export const getDirName = () => path.dirname(require.main?.filename ?? '');

/** join entered strings with module dirName */
export const joinModule = (...paths: string[]) => {
  return path.join(getDirName(), ...paths);
};
