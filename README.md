# dead-man-commit

A dead man's switch for git commits. Automatically commits (and pushes) the
selected repositories after 30 minutes of inactivity.

Built with [deno](https://deno.land).

To get started:

- Ensure you have deno installed
- Clone the repo
- Run `scripts/build.sh`

You should now have 3 binaries in `build/`.

When you run the binary it will complain about a missing config directory and
file, create those. Example config is as follows:

```yaml
version: 1
repos:
  - path: /Users/foo/path/to/repo
    delay: 3600
  - path: /Users/foo/path/to/another/repo
```

You can also specify the `repos` property as an array of strings. The delay
parameter is seconds after the last change before an auto commit is made.

To make this useful you probably need to run it from cron or similar somewhat
regularly.
