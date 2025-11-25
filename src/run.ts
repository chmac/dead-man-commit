const textDecoder = new TextDecoder();

type Success = { success: true; output: string };
type Failure = { success: false; output: string; error: string };
export const run = async ({
  cmd,
}: {
  cmd: string[];
}): Promise<Success | Failure> => {
  const [program, ...args] = cmd;
  const command = new Deno.Command(program, { args });
  const { success, stdout, stderr } = await command.output();

  // NOTE: stdout can have a trailing newline so we trim it
  const output = textDecoder.decode(stdout).trim();

  if (!success) {
    // NOTE: stderr can have a trailing newline so we trim it
    const error = textDecoder.decode(stderr).trim();
    return { success: false, output, error };
  }

  return {
    success: true,
    output,
  };
};
