const textDecoder = new TextDecoder();

type Success = { success: true; output: string };
type Failure = { success: false; output: string; error: string };
export const run = async ({
  cmd,
}: {
  cmd: string[];
}): Promise<Success | Failure> => {
  const command = Deno.run({
    cmd,
    stdout: "piped",
    stderr: "piped",
  });

  const [status, stdout, stderr] = await Promise.all([
    command.status(),
    command.output(),
    command.stderrOutput(),
  ]);

  // NOTE: stdout can have a trailing newline so we trim it
  const output = textDecoder.decode(stdout).trim();

  if (!status.success) {
    // NOTE: stderr can have a trailing newline so we trim it
    const error = textDecoder.decode(stderr).trim();
    return { success: false, output, error };
  }

  return {
    success: true,
    output,
  };
};
