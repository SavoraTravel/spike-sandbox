# Package: add formatDuration

Player: `players/coder.md`

## Outcome

`src/time.js` exports `formatDuration(totalSeconds)`, which turns a whole number of seconds into a short, readable duration.

| Input | Output |
|---|---|
| `0` | `"0s"` |
| `42` | `"42s"` |
| `60` | `"1m 00s"` |
| `303` | `"5m 03s"` |
| `3600` | `"1h 00m"` |
| `7505` | `"2h 05m"` |
| `90061` | `"25h 01m"` |

Negative numbers, non-integers and anything that isn't a number throw a `TypeError`.

## Scope

- May create or change only `src/time.js` and `test/time.test.js`.
- Must not change any other file, including `README.md`, even if something there looks wrong.

## Success criteria

- Every row in the table holds, and the error cases throw `TypeError`.
- `npm test` passes, including the existing tests.

## Checks

Run `npm test`.

## Limits

Never merge. Never push to `main`.
