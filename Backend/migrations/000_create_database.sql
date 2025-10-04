-- Run this script from a superuser connection to create the application database
-- Adjust the database name, owner, and password to match your environment requirements.

CREATE DATABASE ClaimDoo
    WITH
    OWNER = CURRENT_USER
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TEMPLATE template0
    CONNECTION LIMIT = -1;
