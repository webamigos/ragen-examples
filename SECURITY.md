# Security Policy

This repo holds runnable examples for [`@webamigos/ragen-sdk-ts`](https://www.npmjs.com/package/@webamigos/ragen-sdk-ts).
Examples get copied into real projects, so an insecure pattern here propagates
into other people's code. We treat that as a real vulnerability class, not just
a docs problem.

## Reporting a vulnerability

**Do not open a public issue.** Report privately through GitHub's [private
vulnerability
reporting](https://github.com/webamigos/ragen-examples/security/advisories/new), or by
email to **security@webamigos.pl**.

Include what you have:

- which example is affected, and which file
- what the insecure pattern is, and what it leads to if copied
- a suggested fix, if you have one

If the issue is in the SDK itself rather than an example, report it against
[`webamigos/ragen-sdk-ts`](https://github.com/webamigos/ragen-sdk-ts/security/advisories/new).

## What to expect

| Step | Timeline |
|---|---|
| Acknowledgement that we received your report | 48 hours |
| Initial assessment and severity classification | 7 days |
| A fix timeline communicated back to you | 14 days |
| Patch released | Critical: as fast as we can. High: 30 days. Medium/low: next release. |

## Committed credentials

If you find a real API key, token or other credential committed anywhere in this
repo — including in history — report it privately and immediately. Do not open a
public issue, and do not include the credential itself in your report; the file
and commit are enough for us to find and revoke it.

## Scope

**In scope:**

- a committed credential, in the working tree or in git history
- an example that exposes the Ragen API key to the browser. Every example must
  keep API calls server-side; a key reaching client-side code is the single
  most damaging thing an example can teach.
- an example that logs a key, echoes it in a response, or passes it through a
  query string
- an insecure pattern an example presents as the normal way to do something:
  missing input validation on a route that reaches the API, an open CORS policy,
  a disabled TLS check, unsafe deserialization of user input
- a compromised or typosquatted dependency in an example's `package.json`

**Out of scope:**

- an example being minimal. These are teaching examples, not hardened
  production services — missing rate limiting, auth, or observability is a
  deliberate omission. Report it if the omission would be *dangerous* when
  copied, not merely absent.
- vulnerabilities in Express, Next.js, Fastify, NestJS or the other frameworks
  themselves — report those upstream
- results from an automated scanner with no demonstrated exploit
- an advisory against a transitive dependency with no path to exploitation

## If you are running these examples

They are starting points, not deployable services. Before putting one in
production: keep every Ragen call on the server, load credentials from the
environment rather than a committed file, add authentication and rate limiting
to any route you expose, and validate input before it reaches the API.
