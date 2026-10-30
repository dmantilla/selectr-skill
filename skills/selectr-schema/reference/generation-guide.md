# Generation guide

How to turn the draft into a full base (workflow step 3 of `SKILL.md`). The format itself is defined in `reference/schema-format.md` ("Base format (v2)", "The relation id rule"); this guide does not restate it. Examples use the shop fixture, `reference/shop.selectr-schema.json` (scope column `shop_id`).

Run `run validate <stem>.selectr-schema.json` after each batch of edits.

## Where the evidence is

In `<stem>.selectr-introspection.json`:

| Field | Tells you |
|---|---|
| `tables[].partitionKey` | partitioning, e.g. `HASH (shop_id)`: a scope candidate |
| `primaryKeys` | key columns in key order; a tenancy column usually leads |
| `uniqueConstraints`, `indexes` (`unique: true`) | natural keys a relation can target; one-to-one sources |
| `indexes` on `(x_type, x_id)` | a polymorphic pair |
| `checks` | closed vocabularies, e.g. `CHECK (entity_type = ANY (ARRAY['dispute'::text, 'order'::text]))` |
| `columns[].enumValues`, `columns[].comment`, `tables[].comment` | vocabularies and descriptions |
| `columns[].udtName` starting `_` | an array column (the base writes its type as `uuid[]`) |
| `foreignKeys` | relations the draft already has |

Then the code (associations, polymorphic declarations, enums, joins in queries) and the docs.

## 1. Scope (first)

**Recognise:** one column carried by most tables, usually the first column of their composite primary keys, often also the partition key (`tables[].partitionKey`). In the shop: `shop_id`.

**Declare it when drafting**, so relation ids and flags come out right:

```bash
run draft <introspection> --name "Shop" --scope shop_id --scope-entity shops --out <base>
```

- `--scope <column>` sets `"scope": { "label": "Shop", "column": "shop_id", ... }`. `--scope-label` replaces the default label (the humanised column without `_id`). It fails (exit 2) when no table has the column.
- `--scope-entity`: the tenant's own table (`shops`), when it is modelled. Omit it otherwise. It must be an entity of the draft.
- `partitioned: true` is set when any table's `partitionKey` names that column.
- `"scoped": true` is set on an entity when its scope column is the tenancy: the column is `NOT NULL` and has the scope's type. The scope's type is the type of the scope entity's primary-key column (`shops.id`) with `--scope-entity` (and a single-column key), else the most common type of the column across tables (on a tie, the type met first, printed as `scope type tie: <a>, <b>; chose <a>`; `--scope-entity` settles it). Numeric widths count as one type (`int4` and `int8`). Every other table with the column is left unscoped and printed as `not scoped <entity>: <reason>` on stderr: a nullable column (rows that belong to no tenant, such as platform-level users), or another type (a text id from another system). The tenant entity itself (`shops`, keyed by `id`) is never scoped.
- Relation ids are recomputed: the scope pair leaves the id only between two scoped entities. If two relations then share an id, the later is dropped and printed as a `dropped ...` line.
- When updating with `--previous`, the previous base's scope is carried forward: leave `--scope` out unless it changes. It is declared again on the new draft, so new tables are scoped by the rule above and `partitioned` is re-read. A `scoped` value in the previous base, `true` or `false`, stays; when the rule disagrees with a kept `true`, stderr says `scoped by the previous base <entity>: <reason>`. A `--scope` on another column wins and says so on stderr.

If the base already exists without a scope, copy it to a scratch directory and re-run `draft <introspection> --name "Shop" --previous <copy> --scope shop_id --out <base> --force`. `--force` is needed because `<base>` exists, and is safe because the copy is the `--previous`. Then run `validate`.

Flipping `scoped` by hand is rarely needed: only when the docs say a table the rule scoped is not tenant data, or the reverse. Flipping it changes the ids of that entity's relations that carry the scope pair; `validate` gives the new ids.

No column on most tables means no scope; omit `scope` entirely.

## 2. Relations, by shape

One relation per logical join, declared once from the side that holds the reference (normally the "many" side). Selectr derives the other direction.

**Write each join exactly as the code, docs or catalogue declare it.** Do not add pairs the source does not have. The scope pair (`shop_id` → `shop_id`) belongs in a join only when the source declares it, or when the target's key includes the scope column (`draft` already completes such keys). Selectr filters a scoped entity's list by the chosen scope on its own, and a target keyed without the scope column is found by its key alone.

| Shape | Recognise by | Write |
|---|---|---|
| Plain | `<x>_id` → table `<x>s`, key `id` | `{ "from": "customer_id", "to": "id" }`. The draft already guesses these as `inferred`. |
| Composite | the target's key has several columns, e.g. `(shop_id, id)` or `(order_id, line_no)` | One pair per key column the source holds, in the target key's order: `(order_id,line_no)`. When the key includes the scope column, the scope pair is one of them (its position does not matter); between two scoped entities it is left out of the id. |
| To the tenant | `shop_id` → `shops.id` | A real pair `{ "from": "shop_id", "to": "id" }`; it stays in the id: `disputes.shop_id->shops`. |
| Polymorphic | `<x>_type` + `<x>_id`, no foreign key, often indexed together | One relation per type value, with `"condition": { "side": "from", "column": "entity_type", "equals": "dispute" }` and the join on `entity_id` → `id` (plus the scope pair when the target's key includes it). Id: `documents.entity_id[entity_type=dispute]->disputes`. |
| Constant on the target | a shared lookup table split by a category column | `condition` with `"side": "to"`, e.g. join `stage` → `code`, condition `{ "side": "to", "column": "category", "equals": "dispute_stage" }`. |
| Natural key | source columns match a unique constraint or unique index of the target that is not its surrogate key; a partial unique index counts | Pairs on the business columns: `disputes.(network,reason_code)->reason_codes` with `network` → `network`, `reason_code` → `code`. Targets are usually `kind: "reference"`. With a partial index, say in `note` which rows it covers (`indexes[].predicate`). |
| Array | column type ends `[]`, usually `<x>_ids` | `match: "array"` on that pair only, at most one array pair per relation, `cardinality: "many_to_many"`: `evidence.document_ids->documents`. |
| Self | a column pointing at its own table: `parent_<x>_id`, `merged_into_id` | `from` and `to` are the same entity, e.g. `orders.parent_order_id->orders`. Names must differ: `Parent order` / `Child orders`. |

- **Polymorphic type values.** Write each value exactly as stored. Comparison is on text and case-sensitive, and some ORMs store a class name (`Dispute`), not a table name. Take the values from check constraints, enums, the code or the docs, and write one relation per value whose target is an entity here. Add the column to `unresolved` only when a documented value has no target entity, with a note naming that value.
- **Cardinality** is read from the `from` side:
  - `many_to_one`: the default;
  - `one_to_one`: the `from` columns are unique (a primary key or unique constraint on exactly them);
  - `many_to_many`: array relations, or a many-to-many the docs state;
  - `one_to_many`: only when the reference can only be written from the parent side.

  The catalogue's uniqueness wins over the docs: a `from` that is not unique is never `one_to_one`. If a source says many-to-one for an array, write `many_to_many` anyway.
- **A join onto part of a composite target key** (`order_id` → `order_versions (order_id, version)`) is allowed: each source row then finds several target rows. Take the cardinality from the docs (`many_to_many` only for an array or a many-to-many they state; otherwise `many_to_one`) and say in `note` that the join covers part of the key.

## 3. Names, both directions

- `name`: what a `from` row calls its target. Singular for to-one (`Order`), plural for to-many (`Documents`).
- `inverseName`: what a `to` row calls the `from` rows. Plural for `many_to_one` and `many_to_many` (`Disputes`, `Evidence`), singular for `one_to_one`.
- Use plain words, not column names. Replace the draft's mechanical names.
- After relabelling entities, refresh every `inverseName` still at the draft's default (the humanised source table, `Order items`) to the source entity's label in the plural (`Line items` once `order_items` is labelled `Line item`).
- When several relations join the same two entities, make every label distinct: `Billing address` / `Orders (billing)` and `Shipping address` / `Orders (shipping)`.

## 4. Provenance and confidence

Provenance says where the fact came from; confidence says how sure it is. They are independent.

| Provenance | Comes from | Set by | Typical confidence |
|---|---|---|---|
| `foreign_key` | a foreign-key constraint in the catalogue | `draft` only | `high` |
| `declared` | application or ORM code (an association, a join in a query) | you | `high` when explicit; `medium` when only implied |
| `curated` | docs, a data dictionary, an existing model, or a person | you | `high` when the source names the columns; `medium` when you interpreted it |
| `inferred` | naming alone | `draft`, or you | `medium`; `low` when ambiguous |
| `verified` | a live sample that resolved | `verify-joins` only | `high` |

- Raise a draft `inferred` relation to `declared` or `curated` when the code or docs confirm it.
- An `inferred` relation is at most `medium`, whatever its source says: only `verify-joins` raises it to `high`, by making it `verified`. Other provenances take the source's confidence.
- Never set `foreign_key` or `verified` by hand.
- Never change the provenance or confidence of a relation that already has `foreign_key` or `verified`.
- `verify-joins` samples every relation that is `inferred` or below `high`. Give a relation you are unsure of `medium` so that it gets checked.

## 5. Entities

- `label`: a singular human name (`Dispute`). The draft's singular labels are mechanical guesses; fix any that read wrong.
- `kind`:
  - `entity`: the default.
  - `reference`: lookup or code tables.
  - `event`: append-only rows, one per occurrence of something that happened to a parent row (`<x>_events`, `<x>_log`, and an audit table that appends a row per action; a timestamp plus a type column).
  - `history`: versions or snapshots of one parent row (`<x>_history`, `<x>_versions`, an audit table that stores each version of the row).
  - `junction`: rows that only link two entities (primary key made of two references). Write one relation from the junction to each side.
  - `other`.

  Name patterns are hints. The docs' description of how rows are written wins: rows appended per occurrence → `event`; versions of one row → `history`.
- `timeline`, on `event` and `history` entities: `{ "timestampColumn": "recorded_at", "summaryColumns": ["event_type", "to_stage"] }`. `summaryColumns` are 1 to 3 short columns that say what happened: a type, status or action column, plus at most two details. It shows as a History list on the parent's record sheet only through a `many_to_one` relation from the event entity to its parent.
- `titleColumns`: short identifying columns, e.g. a number, a name, a status. Every entity should have them (the review lists those without).
- `searchColumns`: the columns people search by. `defaultSort`: usually `created_at` `desc`.
- `lookupKeys`: columns holding this row's id in another system, e.g. `{ "column": "source_id", "kind": "source" }`.
- Columns:
  - `description`: from comments or docs.
  - `allowedValues`: only from enums, check constraints, code or docs. Set `allowedValuesOpen: false` for a closed list (enum, check), `true` for a partial one.
  - `"sensitive": true`: personal or secret data such as email, phone, addresses, people's and display names, card or bank data, tokens, IP addresses and the location derived from them.
- A table with no primary key gets `primaryKey: []` from the draft. Use a unique constraint's columns if one exists; otherwise leave it and say so in the Generation notes (step 7 of `SKILL.md`).

## 6. `unresolved`

Add `{ "entity", "column", "note" }` for every id-like column (`<x>_id`, `<x>_ids`) that is the `from` column of no relation, other than the scope column, the entity's own key, its `lookupKeys` and the external ids below. The note says why:

- `target table not built yet`;
- `type value refund has no entity here`.

- A column that holds this row's id in another system (a source, provider or original id) belongs in `lookupKeys`, not in `unresolved`.
- An id of a row in an external system that the docs say is never joined goes in the column's `description`, not in `unresolved`, and not in `lookupKeys` unless it identifies this row.
- A `<x>_ref` column is id-like only when the code or docs say it references a row; an idempotency key or a free-form reference is not.
- A draft naming guess the code or docs contradict (the column holds something else): delete the relation. List the column in `unresolved` only if it really references a row and has no target here.

## 7. Groups, sources, description

- **`groups`:** put every entity in exactly one group, by domain area (`Disputes`, `Commerce`, `Reference`). An entity in no group is not offered in the picker. On an update, move the draft's `New tables` entries into real groups.
- **`sources`:** keep the draft's `introspection` entry (it names the database only). Add `{ "kind": "code", "ref": "<repo>@<version>" }` and `{ "kind": "docs", "ref": "<title or file>@<version>" }` for what you used. Never a host, user or password.
- **`description`:** one or two sentences on what the database holds.

## 8. Mapping an existing model

When the docs include a model of this database (a JSON or YAML relation list, a data dictionary):

1. For each relation it lists, work out its **shape**:
   - the tables (→ entity keys);
   - the join column pairs, including tenancy;
   - any constant condition;
   - whether a column is an array.
2. **Ignore its ids.** Compute Selectr ids with the rule. A base relation with the same id is the same relation: update it (names, provenance up from `inferred`). Do not add a second one.
   - **The documented join wins over a draft guess.** When a draft relation has the same `from` and `to` and overlapping join columns but different pairs (typically the draft completed a composite key that the documented join does not use), delete the draft guess and write the documented join. Its id differs; that is fine.
   - A draft guess the docs contradict (the column holds something else): delete it, as in section 6.
   - Tables the model lists that are not in the catalogue: skip them and their relations, and list them in the Generation notes (step 7 of `SKILL.md`).
3. Translate its relation kinds:
   - tenancy → a reference to a tenant table (`orders.shop_id → shops.id`) is a relation like any other (section 2, "To the tenant"): keep it, or the draft's guess of it, whether or not its column is the scope column. Only the scope pair (`shop_id` → `shop_id`) is not a relation of its own; it goes into a `join` only as section 2 says;
   - polymorphic → one relation per type value;
   - array → `match: "array"`, `many_to_many`;
   - natural key and self → as in section 2;
   - links to tables outside this database → `unresolved`, unless the docs say they are never joined (section 6).
4. **Provenance:** `curated` by default.
   - A relation the model marks as declared in code stays `declared`.
   - One it marks as a foreign key stays `foreign_key` only when the catalogue has the constraint (the draft then already has it, with that provenance); otherwise write `curated`.
   - One it marks as inferred stays `inferred`, at most `medium` (section 4): write its `high` as `medium`.
   - Otherwise carry over the model's confidence when it states one, so `verify-joins` samples the uncertain ones.
5. Translate its table kinds: `audit` and `event_log` → `event` when rows are appended per occurrence, `history` when they are versions of one row; `mirror` and `analytics` → `entity`, and `other` only when the docs say nobody browses them. As in section 5, the docs' description of how rows are written wins over the model's kind and the table's name.
6. Its unresolved or unknown targets go into `unresolved`. Record the model in `sources`.

Example. A model entry:

```json
{ "id": "R12", "type": "polymorphic", "table": "documents", "columns": ["entity_type", "entity_id"], "targets": { "dispute": "disputes", "order": "orders" }, "tenancy": "shop_id" }
```

becomes two relations:

```json
{ "id": "documents.entity_id[entity_type=dispute]->disputes", "from": "documents", "to": "disputes",
  "join": [ { "from": "shop_id", "to": "shop_id" }, { "from": "entity_id", "to": "id" } ],
  "condition": { "side": "from", "column": "entity_type", "equals": "dispute" },
  "cardinality": "many_to_one", "name": "Dispute", "inverseName": "Documents",
  "provenance": "curated", "confidence": "high", "note": null }
```

The scope pair is there because `disputes` is keyed `(shop_id, id)`. The second is the same with `order` / `orders`, name `Order`.

For many entries, write a throwaway script outside the repository that reads the model and the base and writes relations. Run `validate` after it; the validator recomputes every id.

## Before verify-joins

- [ ] `validate` reports 0 errors and exits 0 (warnings are fine).
- [ ] Every join is written as its source declares it: no scope pair added where neither the source nor the target's key has it, and no draft guess left beside the documented join it duplicates.
- [ ] Every array relation is `many_to_many` with exactly one `match: "array"` pair.
- [ ] Every polymorphic type value you know has its own relation.
- [ ] Names are plain words and distinct between relations that join the same two entities.
- [ ] Every entity has a `label`, `titleColumns` and a group.
- [ ] Every id-like column is the `from` column of a relation, a lookup key, listed in `unresolved`, or described as an external id that is never joined.
- [ ] Sensitive columns are flagged.
