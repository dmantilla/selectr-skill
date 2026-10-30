# Selectr schema format (v2)

The base format reference, taken from the Selectr architecture docs.

## Base format (v2)

Every object in the base schema is closed: **unknown properties are errors** (`unknown property "x"`). The only exception is an optional top-level `"$schema"` string. Required properties are marked (req).

```jsonc
{
  "format": "selectr-schema",        // req, exactly this
  "version": 2,                      // req, exactly 2
  "name": "Shop",                    // req, non-empty; shown in the header, used for file names
  "description": "...",
  "generatedAt": "2026-10-29T09:33:00Z",              // informational
  "generator": { "name": "...", "version": "..." },   // informational; both keys required if present
  "sources": [ { "kind": "introspection", "ref": "..." } ],  // informational; kind and ref required
  "scope": { ... },                  // optional, see below
  "entities": { "<key>": { ... } },  // req
  "relations": [ { ... } ],          // req (may be empty)
  "groups": [ { "label": "Commerce", "entities": ["shops", "customers"] } ],
  "unresolved": [ { "entity": "dispute_events", "column": "actor_id", "note": "target table not built yet" } ]
}
```

`generatedAt`, `generator` and `sources` are not read at runtime.

### Scope

An optional tenancy/partition column present on most tables.

```json
{ "label": "Shop", "column": "shop_id", "entity": "shops", "partitioned": true }
```

`label` and `column` are required and non-empty. `entity` (the entity that *is* the tenant) must be an existing entity key. `partitioned` records that the tables are partitioned on `column`. Scope is used in these places:

- the relation id rule (below), and `linkForColumn` never linking through the scope self-pair from a scoped entity;
- the AI prompt (`Scope: Shop, column shop_id (partitioned)`);
- the **scope picker** in the journey bar, which appears only when the base declares a `scope`. The chosen value is per journey tab and saved in the `.journey.json` file as a top-level `scope` (see journey-system.md). With `scope.entity` the picker searches that entity; without it, it takes a raw value;
- **query filtering**: for an entity with `scoped: true`, a chosen value adds `scope.column = <value>` to its list query (and the SQL preview, count and re-run). `scopeFilters(model, entity, filters, scope)` does this, unless a filter already constrains the scope column (`constrainsScope`): a query that names its own scope wins. Related-record queries get no extra filter; they stay in scope through the scope pair the relation lists in its `join`;
- the **partition notice**: when `scope.partitioned` is true, a scoped entity is listed with no value chosen and no filter on the scope column, the list shows `Searching every <scope label lowercased> — pick one to search a single partition.` It warns; it never blocks the query.

With no scope in the base, nothing in the UI mentions scope and nothing is filtered. A `scope.parent` level is not supported.

### Entities

`entities` is an object; its keys are the **entity keys** used by journeys, relations, groups and the overlay. Generators default the key to the table name. An entity:

| Property | Type | Notes |
|---|---|---|
| `table` (req) | string | table name, validated as an identifier at query time |
| `dbSchema` | string | only `"public"` is accepted for now; anything else is an error |
| `label` (req) | string | shown in the picker and badges |
| `description` | string | |
| `kind` | `entity` \| `reference` \| `event` \| `history` \| `junction` \| `other` | hint |
| `primaryKey` (req) | string[] | every column must exist; composite keys list the scope column first, e.g. `["shop_id", "id"]` |
| `scoped` | boolean | entity carries `scope.column` as its tenancy; requires a schema `scope` and that column in `columns`. Decides list filtering, verify-joins sampling and whether the scope pair is in its relations' ids |
| `titleColumns` | string[] | columns joined with ` · ` as a record's title; fallback is the primary key values |
| `defaultSort` | `{ column, direction: "asc"\|"desc" }` | applied to **unfiltered** lists only |
| `searchColumns` | string[] | offered in the search box; fallback chain: `searchColumns`, `titleColumns`, `primaryKey` |
| `lookupKeys` | `{ column, kind }[]` | hint: natural keys (e.g. an id from another system); column must exist |
| `timeline` | `null` \| `{ timestampColumn, summaryColumns }` | hint for event/history entities; columns must exist |
| `columns` (req) | object name -> column | see below |
| `computedFields` | `{ name, source, path, type }[]` | values extracted from a JSONB column; `source` must be a column |

A **column**: `type` (req, non-empty Postgres type name such as `uuid`, `text`, `timestamptz`, `jsonb`; arrays end in `[]`, e.g. `uuid[]`), `nullable` (req, boolean), and optional `description`, `allowedValues` (string[]), `allowedValuesOpen` (boolean; true means the list is not exhaustive), `sensitive` (boolean).

A **computed field**: `name` (alias in results), `source` (JSONB column), `path` (key path, e.g. `["payment","method"]`), `type` (`text` | `number` | `boolean`). It is sent to the backend as a `ComputedFieldParam` and becomes `("payload"->'payment'->>'method')` (see backend.md).

The record sheet reads some of these hints: `kind` and `timeline` (an `event`/`history` entity with a `timeline` is shown as a History timeline under its parent), `allowedValues` (shown as chips) and column `description` (the field name's hover title). `lookupKeys`, `sensitive` (no masking yet) and `unresolved` are validated and carried on the `Model`, but nothing in the UI reads them yet. Selectr works without any of them.

Semantic checks on entities: `primaryKey`, `titleColumns`, `searchColumns`, `defaultSort.column`, `timeline` columns, `lookupKeys[].column`, `computedFields[].source` must all name existing columns of that entity; `dbSchema` must be `public`; `scoped` needs a scope and the scope column.

### Relations

A relation is declared **once**; Selectr derives both directions (see "Relation engine"). There are no separate hasMany/belongsTo entries.

```json
{
  "id": "orders.customer_id->customers",
  "from": "orders",
  "to": "customers",
  "join": [ { "from": "shop_id", "to": "shop_id" }, { "from": "customer_id", "to": "id" } ],
  "condition": null,
  "cardinality": "many_to_one",
  "name": "Customer",
  "inverseName": "Orders",
  "provenance": "foreign_key",
  "confidence": "high",
  "note": null
}
```

| Property | Notes |
|---|---|
| `id` (req) | must equal the id computed from the relation's shape (next section) and be unique |
| `from`, `to` (req) | entity keys; must exist |
| `join` (req) | non-empty array of pairs `{ from, to, match? }`: `from` is a column of the `from` entity, `to` a column of the `to` entity. `match: "array"` (the only allowed value) means the `from` column is an array containing the `to` value; the `from` column's type must end in `[]` |
| `condition` | `null` or `{ side: "from"\|"to", column, equals }`: narrows one side to a constant (`equals` is a string, number or boolean); the column must exist on that side's entity |
| `cardinality` (req) | `many_to_one`, `one_to_one`, `one_to_many`, `many_to_many`, read from the `from` side |
| `name` (req) | label going from -> to |
| `inverseName` (req) | label going to -> from |
| `provenance` (req) | where the fact came from: `foreign_key`, `declared`, `curated`, `inferred`, `verified` |
| `confidence` (req) | `high`, `medium`, `low`; independent of provenance |
| `note` | string or null |

**Join pairs are complete.** Every column needed to hit the right rows, including the scope column, must be listed in `join`; Selectr adds nothing implicitly (no partition-key copying, no index guessing). That is why most scoped relations start with `{ "from": "shop_id", "to": "shop_id" }`.

Polymorphic relations are one relation per type value, using `condition` (`documents.entity_id[entity_type=dispute]->disputes`, see the id table below). Array relations (`evidence.document_ids->documents`) use `match: "array"` and are normally `many_to_many`.

### The relation id rule

Ids are deterministic so overlay references survive regeneration:

```
<from>.<cols>[<condition>]-><to>
```

- `<cols>`: the `from` columns of the `join` pairs, in order, **leaving out the scope self-pair** (`from === to === scope.column`) **when both entities are `scoped: true`**. Between two scoped entities that pair is tenancy plumbing rather than part of what the relation means. When either entity is not scoped, the pair is a real join column (an unscoped table that joins on a column named like the scope column) and stays: `payouts.shop_id->shop_settings`, never `payouts.()->shop_settings`. One column is written bare; several are written `(a,b)`. If only scope pairs are present between two scoped entities the result is `()`.
- `[<condition>]`: present only when `condition` is set, written `[column=equals]`. The `side` is not part of the id.
- `relationId(rel, scope?)` in `validate.ts` is the single implementation; the generator, validator, overlay merge and the skill all use it. `scope` is an `IdScope`, `{ column, scopedEntities }`; `idScope(base)` builds it from a base or a merged model (undefined without a scope).
- This refines the spec's wording ("leaving out the scope self-pair"), which assumed both endpoints are scoped. Because the rule reads `scoped`, flipping an entity's `scoped` flag changes the ids of its relations that carry the scope pair.

Examples from the shop fixture (scope column `shop_id`):

| Relation | Id |
|---|---|
| orders -> customers via `(shop_id,shop_id)`, `(customer_id,id)` | `orders.customer_id->customers` (scope pair dropped) |
| disputes -> reason_codes via `(network,network)`, `(reason_code,code)` (natural key, not scope) | `disputes.(network,reason_code)->reason_codes` |
| documents -> disputes, `condition` on `from.entity_type = dispute` | `documents.entity_id[entity_type=dispute]->disputes` |
| evidence -> documents, array pair on `document_ids` | `evidence.document_ids->documents` |
| disputes -> shops via `(shop_id,id)` (`to` is not `shop_id`, so the pair is kept) | `disputes.shop_id->shops` |

Every scope pair in the fixture joins two scoped entities. Without a scope in the schema nothing is dropped. A wrong id is a validation error (`id should be "..."`), as is a duplicate.

### Groups

`groups` is a list of `{ label, entities }` the entity picker shows as headings (the schema editor's groups panel edits them in the overlay; "Use base groups" removes the overlay's). Every listed entity must exist in the base (error otherwise). **An entity listed in no group is not offered in the picker** (it is still reachable by relations and journeys). With no groups at all, the merged model gets one group, `Entities`, with every entity.

### Unresolved

`unresolved` lists id-like columns with no known target, so reviewers can track them. An unknown entity or column there is a warning, not an error.

### Minimal valid base

```json
{
  "format": "selectr-schema",
  "version": 2,
  "name": "Mini",
  "entities": {
    "customers": {
      "table": "customers", "label": "Customer", "primaryKey": ["id"], "titleColumns": ["email"],
      "columns": { "id": { "type": "uuid", "nullable": false }, "email": { "type": "text", "nullable": false } }
    },
    "orders": {
      "table": "orders", "label": "Order", "primaryKey": ["id"],
      "columns": {
        "id": { "type": "uuid", "nullable": false },
        "customer_id": { "type": "uuid", "nullable": true }
      }
    }
  },
  "relations": [
    {
      "id": "orders.customer_id->customers", "from": "orders", "to": "customers",
      "join": [ { "from": "customer_id", "to": "id" } ],
      "cardinality": "many_to_one", "name": "Customer", "inverseName": "Orders",
      "provenance": "declared", "confidence": "high"
    }
  ]
}
```

