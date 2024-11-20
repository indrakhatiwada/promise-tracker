-- Deallocate all prepared statements
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT name FROM pg_prepared_statements) LOOP
        EXECUTE 'DEALLOCATE "' || r.name || '"';
    END LOOP;
END $$;
