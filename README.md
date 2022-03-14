# dead-man-commit

A dead man's switch for git commits. Automatically commits (and pushes) the
selected repositories after 30 minutes of inactivity.

Built with [deno](https://deno.land).

To get started:

- Ensure you have deno installed
- Clone the repo
- Run `scripts/build.sh`

You should now have 3 binaries in `build/`.

## Config

When you run the binary it will complain about a missing config directory and
file, create those. Example config is as follows:

```yaml
version: 1
log:
  file: /var/log/dead-man-commit.log
  level: DEBUG
repos:
  - path: /Users/foo/path/to/repo
    delay: 3600
  - path: /Users/foo/path/to/another/repo
```

Config values

- `version` - Required, must be `1`
- `log` - Optional
  - `file` - Optional, path to log file (must be writable), file will be created
  if it does not exist. If there is no `file` specified, logs are output to the
  console.
  - `level` - Optional, valid values are `DEBUG`, `INFO` or `ERROR`, and is
  optional.
- `repos` - Required, an array of repositories to monitor, valid formats are:
  - String, the absolute path to the repository
  - Object containing the keys:
    - `path` - Required, the absolute path to the repository
    - `delay` - Optional, the number of seconds to wait after the last activity
    is detected before making a commit

## Cron

To make this useful you probably need to run it from cron or similar somewhat
regularly.
