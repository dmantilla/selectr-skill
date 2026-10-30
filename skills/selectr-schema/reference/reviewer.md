# Reviewer brief

You review a generated Selectr base before it is handed to a human. You are a fresh agent or context. Work only from the paths you were given and from this brief, not from the generating agent's conclusions:

- the base, `<stem>.selectr-schema.json`;
- the introspection, `<stem>.selectr-introspection.json`;
- the verify report, `<stem>.selectr-verify.json`;
- the review file to write, `<stem>.selectr-review.md`;
- the previous base copy, when this was an update;
- where the human's code and docs inputs are. You may read them. When the code is available only as a model extracted from it, treat that model as the code.

`run` is `<skill>/run`, `<skill>` being the directory above this file. The format reference is `reference/schema-format.md`; the generator's rules are in `reference/generation-guide.md`.

**You do not regenerate or re-enrich the base.**

- Never run `draft`, `introspect` or `verify-joins`.
- Never add or remove relations or entities.
- Never change a join, condition, cardinality, provenance or confidence.
- Never touch the overlay.
- Never query the database.
- Never copy credentials or row values anywhere.

## 1. Run the mechanical checks

```bash
run review-checks <stem>.selectr-schema.json --introspection <stem>.selectr-introspection.json --verify-report <stem>.selectr-verify.json --out <stem>.selectr-review.md
```

It writes these sections:

- Validation;
- Coverage: counts, a provenance × confidence table, catalogue tables missing from the base, catalogue foreign keys with no relation;
- Join pairs whose column types differ, from the base's own column types (an array pair compares its element type);
- Unconfirmed relations: those below `high` confidence, with their verify outcome;
- Verify-joins: the count per outcome, then every relation that did not verify, under Unconfirmed (all resolved on a sample too small, then partly resolved), Contradicted, No data and Errors, each with `resolved/sampled` (an error also with its message). High-confidence relations show up here only;
- Unresolved;
- Id-like columns without a relation: columns named `*_id`, `*_ids` or `*Id` that no relation starts from, that are not in `unresolved` or the entity's `lookupKeys`, and that are not the entity's primary key or the scope column;
- Possibly sensitive columns not flagged: names with a personal or secret token (email, phone, address, people's and display names, IP-derived location, tax and card identifiers, tokens, ...), leaving out references, kinds, counts, amounts, timestamps and flags (`*_id`, `*_type`, `*_count`, `*_amount`, `*_at`, `is_*`, `has_*`);
- Entities without title columns.

It ends with a `## For the reviewer` heading. Everything from that heading down is kept when the command is re-run. The generating agent may have put a `### Generation notes` block there: facts you cannot see in the files (for example a default it chose, skipped model tables, deliberate departures from the docs, a sparse database). Keep it, take it into account, and write your notes below it. Exit 1 means validation errors.

`unconfirmed` means at least 50% resolved but short of the threshold, or at or above it on fewer than 20 sampled rows. The Verify-joins section covers the last run only. Relations verified by an earlier run show only in the provenance table's `verified` row.

## 2. Read the base against the inputs

Check, and note every finding:

1. **Coverage.**
   - Every relation the code or docs describe is in the base by shape: same endpoints, join column pairs and condition, whatever its id. Against a large external model, compare with a throwaway script outside any repository, matching on the from table, the to table, the set of join pairs and the condition; ids differ between formats.
   - Every catalogue table and foreign key the checks list as missing is explained.
2. **Shapes.**
   - Each join is written as the code, docs or catalogue declare it. The scope pair is there when the source declares it or the target's key includes the scope column, not on every relation between two scoped entities. A reference to a tenant table (`orders.shop_id → shops.id`) is a relation like any other, including one an external model calls tenancy.
   - Polymorphic relations have one relation per type value, with a `condition`, and the values match the code.
   - Array relations are `many_to_many` with `match: "array"`.
   - Natural keys hit a unique key of the target.
3. **Provenance is honest.**
   - `foreign_key` only where `foreignKeys` in the introspection has that constraint.
   - `verified` only on relations `verify-joins` verified.
   - `declared` and `curated` are backed by the code or the docs.
4. **Contradicted relations** (Verify-joins section, under Contradicted). Under 50% resolved, whatever the sample size: read the `resolved/sampled` counts, since 1 of 3 is weak evidence. For each, read the inputs and recommend one of:
   - keep, with a reason;
   - fix the join, saying how;
   - remove.
5. **Verify-joins errors** (Verify-joins section, under Errors). An `error` is a bad value, a missing column or a timeout, never a type difference that casts (`verify-joins` casts the source to the target's type). Tell them apart by the message, whose quoted text is replaced by `"…"`:
   - `invalid input syntax for type <t>` or `invalid input value for enum <t>`: a `condition` value the column's type rejects, or source values that do not cast to the target's type;
   - `cannot cast type <a> to <b>` or `operator does not exist`: columns that cannot be compared, so the join is probably wrong;
   - `column "…" does not exist` or `relation "…" does not exist`: a name that does not match the introspection;
   - `canceling statement due to statement timeout`: a timeout, not a finding about the join.
6. **Join pairs whose column types differ.** Selectr navigates them fine, but check each against the inputs: a `text` column holding uuids is common, an `int4` against a `uuid` is a wrong join.
7. **Names** read correctly in both directions and are distinct on each entity (a clash is a mechanical fix, section 3).
8. **`unresolved`:** every id-like column with no relation is listed, with a useful note, unless it is an id in another system recorded in `lookupKeys`. The "Id-like columns without a relation" section lists the ones that are none of these; each needs a relation, an `unresolved` entry, a lookup key, or a `description` saying it is an id in an external system that is never joined. Other id-like names it cannot recognise (`ref`, `owner`) are still worth a look in the introspection's `columns[]`; a `_ref` column counts only when the docs say it references a row (an idempotency key is not one).
9. **Sensitive columns:** each "possibly sensitive" column is either personal or secret data that should be flagged, or plainly not. The list is a starting point: also glance at text columns the docs describe as names, free text or location.
10. **Update only:**
   - Compare relation ids with the previous base.
   - Every id that disappeared must belong to a table or column that is no longer in the introspection, or to a relation whose entity changed its `scoped` flag (the scope pair then enters or leaves the id; the same relation is under the new id).
   - Every curated label or description that disappeared needs a reason.

## 3. Fix only mechanical errors

You may fix:

- validation errors with one obvious correction;
- a relation id that `validate` says should be another value;
- a typo in an entity key or column name that clearly refers to an existing one;
- a missing `inverseName` or `name`;
- a name clash: two relations on one entity whose names, or a name and an inverse name, read the same. Rename the less specific one.

Anything else is a finding for the generating agent or a human. Record every fix. After fixing, run:

```bash
run validate <stem>.selectr-schema.json
```

Then re-run `review-checks` so the mechanical sections match the file.

## 4. Write "For the reviewer"

Fill in the section in `<stem>.selectr-review.md`, under the existing heading (below any Generation notes):

```markdown
## For the reviewer

Reviewed <date> against <inputs read>.

### Fixed
- `relations[12].id`: "disputes.(shop_id,order_id)->orders" -> "disputes.order_id->orders" (id rule)
(or: Nothing.)

### Needs a human
- Contradicted: `<id>` (<resolved>/<sampled>): <recommendation>
- Unconfirmed: `<id>`: <why it matters, or "low impact">
- Unresolved: `<entity>.<column>`: <note>
- Sensitive: `<entity>.<column>`: flag / not sensitive
- Type difference: `<id>`: fine / wrong join, and why
- Coverage gaps: <relation or table from the inputs that is missing, and why>

### Verdict
pass | hold: <one line>
- <for hold: each item the generating agent must address>
```

Grouping is expected on a large base (`- No data: 194 relations; the database is sparse`). List one by one only the relations that are not references to a tenant table, are at `medium` or `low` confidence and did not verify. Contradicted relations and errors are always listed one by one.

**Verdict:**

- **hold** if any of these is true:
  - validation errors remain;
  - a relation the inputs describe is missing without a reason;
  - a provenance claim is not backed;
  - a shape is wrong;
  - an update lost curation without a reason.
- **pass** otherwise.

Items that only need a human's decision (contradicted, unconfirmed, unresolved, sensitivity) do not hold the base on their own. List them under "Needs a human". A confidence lower than the source's is a note, never a hold.

On a second round after a hold, keep the earlier notes. Add a new dated block below them with its own Fixed, Needs a human and Verdict.
