export const doesFileExist = async (path: string) => {
  try {
    const stat = await Deno.stat(path);
    if (stat.isFile) {
      return true;
    }
    return false;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error;
  }
};

export const doesDirectoryExist = async (path: string) => {
  try {
    const stat = await Deno.stat(path);
    if (stat.isDirectory) {
      return true;
    }
    return false;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error;
  }
};
