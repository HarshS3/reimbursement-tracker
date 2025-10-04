BEGIN;

ALTER TABLE expenses
  ADD COLUMN IF NOT EXISTS original_amount NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS original_currency VARCHAR(10);

UPDATE expenses
SET original_amount = amount,
    original_currency = currency
WHERE original_amount IS NULL OR original_currency IS NULL;

ALTER TABLE expenses
  ALTER COLUMN original_amount SET NOT NULL,
  ALTER COLUMN original_currency SET NOT NULL;

COMMIT;
