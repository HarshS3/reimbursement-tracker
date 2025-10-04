BEGIN;

ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS country VARCHAR(100);

UPDATE companies
SET country = COALESCE(country, 'Unknown');

ALTER TABLE companies
    ALTER COLUMN country SET NOT NULL;

COMMIT;
