---
name: selectr-schema
description: Generate or update a Selectr schema for a PostgreSQL database - a validated v2 base file (<stem>.selectr-schema.json) plus its review report - from the live catalogue, application code and documentation. Use when asked to generate, create, update or regenerate a Selectr schema (or "selectr-schema.json") for a database.
---

# Selectr schema generator

Produces a Selectr v2 **base** (facts: entities, columns, relations) for one PostgreSQL schema, and a review report. Every database access and every check goes through the `run` CLI next to this file.

Read before editing a base (paths are relative to this file):

- `reference/schema-format.md`, sections "Base format (v2)" and "The relation id rule": the format reference. Do not guess the format from memory.
- `reference/shop.selectr-schema.json`: a worked example with every relation shape.
- `reference/generation-guide.md`: how to recognise and write each relation shape, provenance, scope, kinds, `unresolved`.

## When to use

- **New:** a database has no base yet.
- **Update:** the database or its code changed and an existing base must follow it, keeping its relation ids and its curation.

Not for: the overlay (`<stem>.selectr-overlay.json` is the user's file; never write it), databases other than PostgreSQL, or a schema other than `public` (Selectr reads only `public` today).

## Conventions

- **`run`** means `<skill>/run`, where `<skill>` is the directory holding this file. `run --help` lists the commands. It needs Node.js 24. Inside the Selectr repo it first rebuilds its bundle when the sources are newer (this needs `npm install` at the repo root), with build output on stderr.
- **`<stem>`** means the output directory plus the file stem, e.g. `~/schemas/shop`. All files sit next to each other:

  | File | Role |
  |---|---|
  | `<stem>.selectr-schema.json` | deliverable: the base |
  | `<stem>.selectr-review.md` | deliverable: the review report |
  | `<stem>.selectr-introspection.json` | working file: catalogue facts |
  | `<stem>.selectr-verify.json` | working file: verify-joins counts |

  The working files hold catalogue facts and counts only, no row values; keep them so a later update can reuse them.
- **Exit codes:** `0` ok; `1` findings you must act on (validation errors, an input base that does not validate, a draft that does not validate); `2` usage error, unreadable input, unsupported file or connection failure. Progress and warnings go to stderr; `validate` prints its problems on stdout.

## Inputs to gather, in order

Find out where each input is, plus the output directory and stem, the schema's display name (`--name`) and the previous base when updating. They come from whoever started the run, a human or a brief: ask only for what is missing. With nobody to ask, choose the documented default and record it in the Generation notes (step 7); for `--name`, that is the database name humanized (`shop_db` → `Shop db`).

1. **The live database, read-only.** Ask the human to create a URL file themselves: one line `postgres://<role>@<host>:<port>/<database>` (with the password if the role needs one), saved outside any repository, then `chmod 600 <file>`. You pass only its path, `--url-file <path>`. If `SELECTR_SCHEMA_PG_URL` is already set in your environment, the commands use it when `--url-file` is absent. A read-only role is best; the CLI opens every session read-only with a statement timeout anyway, and refuses a URL that tries to override either. `introspect` reads tables, columns, types, primary keys, unique constraints, foreign keys, indexes, comments, partitioning and check constraints.
2. **Application or ORM code**, if any: declared associations and joins, polymorphic type values, enums and vocabularies, comments.
3. **Documentation**, if any: wikis, ADRs, data dictionaries, existing models of this database.
4. **Naming conventions:** `<x>_id` → `<x>s`, `<x>_ids` arrays, `<x>_type`/`<x>_id` polymorphic pairs, a tenancy column carried by most tables.

## Workflow

1. **Introspect.**

   ```bash
   run introspect --url-file <url-file> --out <stem>.selectr-introspection.json
   ```

   `--schema` defaults to `public`. `--timeout-ms` sets the statement timeout (default 15000).

   Look at `tables[].estimatedRows` (`null` = never analysed, so unknown; `0` = analysed and empty; before PostgreSQL 14 a never-analysed table also reads `0`): when most tables are (nearly) empty, step 4 will mostly report `no-data`. Expect that, and say so in the generation notes.

2. **Draft.** New base:

   ```bash
   run draft <stem>.selectr-introspection.json --name "<Name>" --out <stem>.selectr-schema.json
   ```

   If a tenancy column is carried by most tables (`reference/generation-guide.md`, section 1), declare the scope here, so the relation ids come out right:

   ```bash
   run draft <stem>.selectr-introspection.json --name "<Name>" --scope shop_id [--scope-entity shops] [--scope-label "Shop"] --out <stem>.selectr-schema.json
   ```

   Pass `--scope-label` with the tenant's name when the default (the humanised column without `_id`) does not read well.

   Update: read the previous base first. Copy it to a scratch directory outside any repository, then draft from it:

   ```bash
   run draft <stem>.selectr-introspection.json --name "<Name>" --previous <scratch>/previous.selectr-schema.json --out <stem>.selectr-schema.json --force
   ```

   `--force` is needed because `<stem>.selectr-schema.json` already exists. It is safe here: the scratch copy is the `--previous`, so nothing is lost.

   - The previous base must validate (`run validate` it first and fix mechanical errors); one that does not is refused with its problems (exit 1). A file Selectr no longer reads (`not a Selectr schema v2 file`) cannot be carried forward: draft a new base and use the old file as documentation input.
   - Its scope, labels, descriptions, column hints, groups, `unresolved`, sources and every relation carry forward, with ids recomputed by the same rule. Whatever names a vanished table or column is dropped and printed as a `dropped ...` line on stderr.
   - Foreign keys follow the catalogue: a relation that is a foreign key in the draft takes `foreign_key`/`high` from it, keeping the previous names and note; a previous `foreign_key` relation whose constraint is gone (columns still there) is kept as `curated` at confidence `medium` (so step 4 samples it again), with a `dropped relation <id>: foreign key no longer in the catalogue, kept as curated` line.
   - Its scope carries forward by itself: leave `--scope` out unless the scope changes. It is declared again on the new draft, so tables added since then are scoped by the same rule as a new draft and `partitioned` is re-read from the catalogue; a `scoped` value in the previous base stays. A `--scope` on another column replaces the previous one (and says so on stderr); on the same column it keeps the previous label and entity. A kept `true` the rule disagrees with is printed as `scoped by the previous base <entity>: <reason>`: decide from the docs, flip `scoped` by hand if the rule is right, then take the new ids from `validate`.
   - An existing `--out` is refused (exit 2, nothing written) unless you add `--force`; so is `--out` equal to `--previous`. With `--previous`, nothing is written when the result would not validate (exit 1). A plain draft is written even when it does not validate (exit 1), so you can inspect it.
   - The draft has every table as an entity, a relation per foreign key (`foreign_key`/`high`), `<x>_id` naming guesses (`inferred`/`medium`, only between compatible column types), nullability, comments as descriptions, enum labels as `allowedValues`, and one group, `All tables` (`New tables` for tables an update adds). It has no scope unless you pass `--scope <column>` (which also sets `scoped` on every entity whose column is `NOT NULL` and of the scope's type, printing `not scoped <entity>: <reason>` for the others, detects `partitioned` from the partition keys, and recomputes relation ids; `--scope-entity` names the tenant's own table, `--scope-label` defaults to the humanised column without `_id`; it fails with exit 2 when no table has the column). It has no polymorphic, natural-key or array relations, no kinds or timelines, and only mechanical labels (singular entity labels guessed from the table name).
   - Keep every `dropped ...`, `not scoped ...`, `scoped by the previous base ...` and `scope type tie ...` line for the Generation notes (step 7) and the hand-over.

3. **Enrich by hand** from the code, the docs and the naming conventions, following `reference/generation-guide.md`. Edit `<stem>.selectr-schema.json` directly. For bulk mappings (an existing model, a data dictionary) you may write a throwaway script outside the repository. Work in this order: scope first if `draft` did not declare it (it changes relation ids), then relations, entities, `unresolved`, groups, sources. After each batch of edits:

   ```bash
   run validate <stem>.selectr-schema.json
   ```

   Repeat until it reports 0 errors and exits 0. Warnings are fine.

   - Write each join exactly as the code, docs or catalogue declare it. Add the scope pair only when the source declares it or the target's key includes the scope column; Selectr applies the scope to scoped entities on its own.
   - A documented join replaces a draft guess between the same two entities with overlapping columns but other pairs (delete the guess; its id differs). Delete a draft guess the docs contradict.
   - Relations you add from code are `declared`; from docs or a person, `curated`. Never `verified`, never `foreign_key`.
   - Relation ids follow `<from>.<cols>[<cond>]-><to>`, with the scope pair left out of `<cols>` only when both entities are `scoped: true` (`reference/schema-format.md`, "The relation id rule"). Flipping `scoped` therefore changes ids. A wrong id fails validation with `id should be "<id>"`; use exactly that value.

4. **Verify joins against live data.**

   ```bash
   run verify-joins <stem>.selectr-schema.json --report <stem>.selectr-verify.json --url-file <url-file> --write
   ```

   - **What it samples:** each relation that is not `verified` and is either `inferred` or below `high` confidence (every relation with `--all`). For each one it reads up to 200 source rows (`--sample`), or array elements for a `match: "array"` pair. When the source entity is `scoped: true`, it samples within one scope value, the most frequent among the first 1000 qualifying rows; an unscoped entity is sampled across all its rows, even when it has a column named like the scope column. It then counts how many of them find a target row. When the base gives a join pair two different column types (`text` → `uuid`), each source value is cast to the target column's type first (numeric types are compared as they are, never cast). It never prints values.
   - **Outcomes**, checked in this order:
     1. `error`: the statement failed: a bad value, a missing column or table, or a timeout. Unchanged; the run continues with the next relation.
     2. `no-data`: nothing was sampled (no source row qualifies). Unchanged.
     3. `verified`: at least 20 sampled and at least the threshold resolve (`--threshold`, default 0.95). The relation becomes `verified`/`high`; a `foreign_key` relation (sampled only with `--all`) keeps its provenance and becomes `high`.
     4. `contradicted`: under 50% resolve, **whatever the sample size**, so 1 of 3 is contradicted. Confidence becomes `low`; provenance is unchanged.
     5. `unconfirmed`: everything else (between 50% and the threshold, or at or above it with under 20 sampled). Unchanged.

     stderr gets one line per relation (`<outcome> <id> (<resolved>/<sampled>)`), then one summary line (`<n> relations: <a> verified, <b> unconfirmed, …`); stdout stays empty. The report gives each relation's `resolved/sampled` and `scoped`, which means sampled within one scope value (so it is `false` on every `no-data`); the review's Verify-joins section lists every relation whose outcome is not `verified`, grouped by outcome (`unconfirmed` split into all resolved on a sample too small, and partly resolved), with its `resolved/sampled` (and the scrubbed message for an `error`). A `contradicted` from a small sample is weak evidence; the reviewer reads the counts.
   - **`--write`** updates the base only when something was verified or contradicted, and only if the result still validates (else exit 1, nothing written). The exit code is 0 even when relations are contradicted.
   - **A lost connection** stops the run with exit 2. The report keeps what was sampled; the base is untouched. Re-run once the connection is back.
   - **Act on:**
     - an `error`: its message tells the cause (quoted text in it is replaced by `"…"`):
       - `invalid input syntax for type <t>` or `invalid input value for enum <t>`: a bad value. Either a `condition`'s `equals` that the column's type rejects (fix the value from the code or docs), or source values that do not cast to the target column's type (the join columns are probably wrong).
       - `cannot cast type <a> to <b>` or `operator does not exist`: the two columns cannot be compared at all; the join columns are probably wrong.
       - `column "…" does not exist` or `relation "…" does not exist`: a name in the base does not match the database; compare it with the introspection.
       - `canceling statement due to statement timeout`: re-run with a larger `--timeout-ms`.

       A type difference that casts cleanly is not an error: the review's "Join pairs whose column types differ" lists it. Selectr navigates such joins fine, but it is worth a look.
     - `no-data` on a polymorphic relation: check the type value.
     - `no-data` on most relations: the database is sparse (see step 1). Nothing to fix; say so in the generation notes, since most relations are then unchecked.

     A re-run samples whatever is still unverified and replaces the report.

5. **Settle contradicted relations.** For each `contradicted` relation (in the run's stderr and in the report), check the code and docs:
   - If they show the join is wrong (another target column, a missing pair, the wrong type value), fix the relation and re-run step 4.
   - Otherwise leave it as it is, at confidence `low`. Do not delete it and do not raise its confidence: the reviewer flags it and the human decides.

6. **Validate.**

   ```bash
   run validate <stem>.selectr-schema.json
   ```

   It must report 0 errors and exit 0; warnings are fine. It also checks the user's overlay next to the base if one exists. Report errors there to the human; do not edit the overlay.

7. **Review, in a fresh agent or a fresh context.** Give the reviewer only:
   - the brief `reference/reviewer.md`;
   - the paths of the base, the introspection, the verify report, the review file `<stem>.selectr-review.md` and, when updating, the previous base copy;
   - where the code and docs inputs are.

   Do not pass your own conclusions. Before starting the reviewer, run `review-checks` (command below) and add, under `## For the reviewer`, a `### Generation notes` block with every fact the reviewer cannot see in the files, one line each. For example:
   - a default you chose because nobody gave the input (such as `--name`);
   - tables an external model lists that are not in the catalogue (skipped, with their relations);
   - deliberate departures from the docs, and tables with no key;
   - the step 2 lines on an update;
   - a sparse database: most verify outcomes `no-data`.

   Facts only, no verdicts. Nothing is kept back for the hand-over alone. Re-run `review-checks` after every later edit; it keeps the block.

   The reviewer runs `review-checks`, fixes only mechanical errors, and writes a **pass** or **hold** verdict under "For the reviewer" in the review file.

   On **hold**, address every listed item. Then re-run `validate` (and steps 4 and 5 if you changed relations), then refresh the mechanical checks:

   ```bash
   run review-checks <stem>.selectr-schema.json --introspection <stem>.selectr-introspection.json --verify-report <stem>.selectr-verify.json --out <stem>.selectr-review.md
   ```

   Add `--overlay <path>` only to check an overlay that is not next to the base; the one next to it is checked anyway. This keeps the reviewer's notes. Then start a fresh reviewer again.

   **At most 3 holds.** After the third hold, stop and hand over to the human anyway, with the verdict and every open item from the last round.

8. **Hand over, only on pass** (or after the third hold). Tell the human:
   - the two deliverable paths;
   - the verdict;
   - the reviewer's "needs a human" items;
   - the generation notes;
   - the `dropped`, `not scoped`, `scoped by the previous base` and `scope type tie` lines from step 2.

   In Selectr, they load `<stem>.selectr-schema.json` from the no-schema screen.

## Rules

- **Never write credentials or row values** to any file, commit or message.
  - Never read, print or copy the URL file.
  - Never print the environment variable either: no `echo $SELECTR_SCHEMA_PG_URL`, `env`, `printenv` or `set`.
  - Never put a connection URL on a command line.
  - Never ask the human to paste a password or URL into the chat.
  - The base's `sources` name the database only, never a host or user.
- **Touch the database only through `run`.** No `psql`, no queries of your own. Vocabularies (`allowedValues`, polymorphic type values) come from enums, check constraints, code or docs, never from rows.
- **Keep ids stable.** When a base exists, read it first and draft with `--previous`. Never rename an entity key. Change a relation id only to the value `validate` reports.
- **Never weaken provenance by hand.**
  - `foreign_key` comes only from the catalogue, `verified` only from `verify-joins`.
  - Never set either by hand, and never change the provenance or confidence of a relation with provenance `foreign_key` or `verified`.
  - You may raise an `inferred` relation to `declared` or `curated` when code or docs confirm it. An `inferred` relation is at most `medium`; only `verify-joins` makes it `high`.
- **Never write the overlay.**
