# Counts-only check of older account and payment tables

**Why:** the security fix of 24 Nov 2026 (`3f6669ea`) closed routes that could have exposed Generator Oracle subscription, payment, team and push-notification records, and an unused projects API. If these tables are absent or empty in production, those routes had nothing to expose. The check needs production database access, which the developer does not have, and should not have for this purpose.

**What it does:** it prints, per table, either `absent` or **a single number** (the row count). It cannot return any name, email, phone number, payment detail or other row content, and it changes nothing.

## Who runs it and where

An owner or administrator with production database access runs it in the database provider's **SQL console** (for example the SQL editor of the provider behind Vercel's `DATABASE_URL`). Use a read-only role if one exists.

## The query (copy exactly)

```sql
SELECT t AS table_name,
       CASE WHEN to_regclass('public.' || quote_ident(t)) IS NULL THEN 'absent'
            ELSE (xpath('/row/n/text()',
                        query_to_xml(format('SELECT count(*) AS n FROM public.%I', t), false, true, '')))[1]::text
       END AS row_count
FROM unnest(ARRAY[
  'oracle_users', 'oracle_sessions', 'oracle_subscriptions', 'oracle_usage',
  'oracle_payments', 'oracle_push_subscriptions',
  'users', 'customers', 'BuildingProject'
]) AS t;
```

## Reading the result

| Result | Meaning |
|---|---|
| Every row `absent` or `0` | The fixed routes had no records to expose in these tables. This supports, but cannot prove, that no exposure occurred: it shows today's state, not the past. |
| Any count above 0 | Records exist. Tell management. The next step is a review, by an authorised person, of whether and how those records were reachable before 24 Nov. Do **not** copy the records anywhere. |

Send back only the table of names and counts.
