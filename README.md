# Titan Racers Site

Public website for `titanracers.com`.

## Environment

The newsletter form posts to this site's server route at `/api/subscribe`. That
route forwards Titan-only signup requests to the shared RaidGuild Forge
subscription API.

Optional environment variables:

- `FORGE_SUBSCRIBE_URL`: Forge subscribe endpoint. Defaults to
  `https://forge.raidguild.org/api/subscribe`.
- `FORGE_SUBSCRIBE_CONFIRM_URL`: Forge token confirmation endpoint. Defaults to
  `https://forge.raidguild.org/api/subscribe/confirm`.
- `TITAN_SITE_URL`: Canonical Titan Racers origin used for the server-side Forge
  request `Origin` header and confirmation link origin. Defaults to
  `https://titanracers.com`.

Do not expose the Forge endpoint through a `NEXT_PUBLIC_` variable; the browser
should only call the same-origin Titan route.
