
GRANT USAGE ON SCHEMA public TO postgres;

--
-- PostgreSQL database dump
--

-- Dumped from database version 10.14 (Debian 10.14-1.pgdg90+1)
-- Dumped by pg_dump version 10.14 (Debian 10.14-1.pgdg90+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


--
-- Name: app; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA app;
ALTER SCHEMA app OWNER TO postgres;
COMMENT ON SCHEMA app IS 'stagency app schema';

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA app;

--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA app;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner:
--

-- CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA app;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner:
--

-- COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';



--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';

SET default_tablespace = '';

SET default_with_oids = false;

--- create functions
--
-- Name: id_generator(); Type: FUNCTION; Schema: app; Owner: postgres
--
--- https://rob.conery.io/2014/05/29/a-better-id-generator-for-postgresql/
--
create sequence app.global_id_sequence;
CREATE OR REPLACE FUNCTION app.id_generator(OUT result bigint) RETURNS bigint
    LANGUAGE plpgsql
    AS $$
DECLARE
    our_epoch bigint := 1548366389588;
    seq_id bigint;
    now_millis bigint;
    -- the id of this DB shard, must be set for each
    -- schema shard you have - you could pass this as a parameter too
    shard_id int := 1;
BEGIN
    SELECT nextval('app.global_id_sequence') % 1024 INTO seq_id;

    SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000) INTO now_millis;
    result := (now_millis - our_epoch) << 23;
    result := result | (shard_id << 10);
    result := result | (seq_id);
END;
$$;

--- create roles
CREATE ROLE "ADMIN" nologin nobypassrls noinherit;
CREATE ROLE "AGENTADMIN" nologin nobypassrls noinherit;
CREATE ROLE "AGENTASSISTANT" nologin nobypassrls noinherit;
CREATE ROLE "FESTIVAL" nologin nobypassrls noinherit;
CREATE ROLE "ANONYMOUS" nologin nobypassrls noinherit;
CREATE ROLE "AGENT" nologin nobypassrls noinherit;
CREATE ROLE "ARTIST" nologin nobypassrls noinherit;

--- so that postgres role (which postgraphile currently logs in as) can switch roles:
GRANT "ADMIN" to postgres;
GRANT "AGENTADMIN" to postgres;
GRANT "AGENTASSISTANT" to postgres;
GRANT "FESTIVAL" to postgres;
GRANT "ANONYMOUS" to postgres;
GRANT "AGENT" to postgres;
GRANT "ARTIST" to postgres;


--- ENUMS --- https://hasura.io/docs/latest/graphql/core/databases/postgres/schema/enums.html

CREATE TABLE app.ticket_type (
  value text PRIMARY KEY,
  comment text
);
INSERT INTO app.ticket_type (value, comment) VALUES
  ('GA_STANDING', 'GA Standing'),
  ('GA_SEATED', 'GA Seated'),
  ('UPPER_LEVEL', 'Upper Level'),
  ('VIP_SEATED', 'VIP Seated'),
  ('AUCTION', 'Auction'),
  ('BALCONY', 'Balcony'),
  ('BUNDLE', 'Bundle'),
  ('FAN_CLUB', 'Fan Club'),
  ('LAWN', 'Lawn'),
  ('LOGE', 'Loge'),
  ('LOWER_LEVEL', 'Lower Level'),
  ('MEZZANINE', 'Mezzanine'),
  ('ORCHESTRA', 'Orchestra'),
  ('OTHER', 'Other'),
  ('PIT', 'Pit'),
  ('RESERVED', 'Reserved'),
  ('UNKNOWN', 'Unknown'),
  ('VIP_STANDING', 'VIP Standing'),
  ('VIP_GOLD_CIRCLE', 'VIP Gold Circle');

CREATE TABLE app.deal_structure_type (
  value text PRIMARY KEY,
  comment text,
  description text
);
INSERT INTO app.deal_structure_type (value, comment, description) VALUES
('PERCENTAGE_OF_NET', 'Percentage of Net', 'Artist receives % of Net Box Office Receipts.'),
('FLAT_GUARANTEE', 'Flat Guarantee', 'Artist receives set guarantee.'),
('GUARANTEE_PLUS_BONUS', 'Guarantee Plus Bonus', 'Artist receives set guarantee plus bonus if parameters are met.'),
('GUARANTEE_VERSUS_PERCENTAGE_OF_GROSS', 'Guarantee Versus Percentage of Gross', 'Artist receives set guarantee or a set percentage of the Gross Box Office Receipts - whichever is greater.'),
('PROMOTER_PROFIT', 'Promoter Profit', 'Artist receives set guarantee plus a % of the Net Box Office Receipts after adjustments and promoter profit.');

CREATE TABLE app.deal_status_type (
  value text PRIMARY KEY,
  comment text
);
INSERT INTO app.deal_status_type (value, comment) VALUES
('PENDING', 'Pending'),
('CONFIRMED', 'Confirmed');

CREATE TABLE app.expense_type (
  value text PRIMARY KEY,
  comment text
);
INSERT INTO app.expense_type (value, comment) VALUES
('FLAT_COST', 'Flat Cost'),
('PER_TICKET_COST', 'Per Ticket Cost'),
('PERCENTAGE_COST', 'Percentage Cost');

CREATE TABLE app.deal_event_type (
  value text PRIMARY KEY,
  comment text
);
INSERT INTO app.deal_event_type (value, comment) VALUES
('FESTIVAL'        , 'Festival' ),
('PRIVATE_EVENT'   , 'Private Event' ),
('FREE_APPEARANCE' , 'Free Appearance' );

CREATE TABLE app.deal_event_billing_type (
  value text PRIMARY KEY,
  comment text
);
INSERT INTO app.deal_event_billing_type (value, comment) VALUES
('100%_HEADLINE'       , '100% Headline' ),
('CO-HEADLINE'         , 'Co-Headline' ),
('75%_SUPPORT_BILLING' , '75% Support Billing' ),
('50%_SUPPORT_BILLING' , '50% Support Billing' ),
('FESTIVAL_BILLING'    , 'Festival Billing' ),
('OTHER-OPENS'         , 'Other-Opens' ),
('NOT_APPLICABLE'      , 'N/A' );

--- TABLES
CREATE TABLE app.ticket_scaling (
    id bigint DEFAULT app.id_generator() NOT NULL,
    deal_id bigint NOT NULL,
    ticket_type text,
    capacity integer,
    complimentary integer,
    kills integer,
    price integer,
    facility integer,
    charity integer,
    secondary integer,
    other integer,
    notes text,
    sort_order text,
    created_at timestamp WITH time zone DEFAULT now() NOT NULL,
    updated_at timestamp WITH time zone DEFAULT now() NOT NULL
);

CREATE TABLE app.deal_event (
    id bigint DEFAULT app.id_generator() NOT NULL,
    deal_id bigint NOT NULL,
    date timestamp WITH time zone,
    venue_id bigint,
    buyer_id bigint,
    copromoter_id bigint,
    created_at timestamp WITH time zone DEFAULT now() NOT NULL,
    updated_at timestamp WITH time zone DEFAULT now() NOT NULL
);

CREATE TABLE app.show_schedule (
    id bigint DEFAULT app.id_generator() NOT NULL,
    deal_id bigint NOT NULL,
    start_time time without time zone,
    show_schedule_type text,
    notes text,
    sort_order text,
    created_at timestamp WITH time zone DEFAULT now() NOT NULL,
    updated_at timestamp WITH time zone DEFAULT now() NOT NULL
);

CREATE TABLE app.performance_schedule (
    id bigint DEFAULT app.id_generator() NOT NULL,
    deal_id bigint NOT NULL,
    start_time time without time zone,
    set_length interval,
    artist_name text,
    notes text,
    sort_order text,
    created_at timestamp WITH time zone DEFAULT now() NOT NULL,
    updated_at timestamp WITH time zone DEFAULT now() NOT NULL
);

CREATE TABLE app.expense (
    id bigint DEFAULT app.id_generator() NOT NULL,
    deal_id bigint NOT NULL,
    name text,
    expense_type text,
    cost integer,
    maximum integer,
    notes text,
    sort_order text,
    created_at timestamp WITH time zone DEFAULT now() NOT NULL,
    updated_at timestamp WITH time zone DEFAULT now() NOT NULL
);

CREATE TABLE app.artist (
    id bigint DEFAULT app.id_generator() NOT NULL,
    name text NOT NULL,
    -- For now we'll use a column on artist but in the future we should
    -- migrate this to a websites table so we're not limited in the websites
    -- we support.
    spotify_uri text,
    -- JSON of the form {url: string, width?: number, height?: number}
    image jsonb,
    genres text[] DEFAULT '{}'::text[],
    created_at timestamp WITH time zone DEFAULT now() NOT NULL,
    updated_at timestamp WITH time zone DEFAULT now() NOT NULL
);

COMMENT ON COLUMN app.artist.image IS 'A JSON object of the format {url: string, width: number, height: number}';
COMMENT ON COLUMN app.artist.genres IS 'A list of genres for the artist as plain text strings';

CREATE TABLE app.person (
    id bigint DEFAULT app.id_generator() NOT NULL,
    name text NOT NULL,
    -- JSON of the form {url: string, width?: number, height?: number}
    image jsonb,
    created_at timestamp WITH time zone DEFAULT now() NOT NULL,
    updated_at timestamp WITH time zone DEFAULT now() NOT NULL
);

COMMENT ON TABLE app.person IS 'Any person who is not an application user (ex. promoter, band member, manager, etc.).';
COMMENT ON COLUMN app.person.image IS 'A JSON object of the format {url: string, width: number, height: number}';

CREATE TABLE app.venue (
    id bigint DEFAULT app.id_generator() NOT NULL,
    name text NOT NULL,
    -- JSON of the form {url: string, width?: number, height?: number}
    image jsonb,
    created_at timestamp WITH time zone DEFAULT now() NOT NULL,
    updated_at timestamp WITH time zone DEFAULT now() NOT NULL
);

COMMENT ON COLUMN app.venue.image IS 'A JSON object of the format {url: string, width: number, height: number}';

CREATE TABLE app.deal_structure (
    id bigint DEFAULT app.id_generator() NOT NULL,
    deal_structure_type text,
    name text,
    description text,
    created_at timestamp WITH time zone DEFAULT now() NOT NULL,
    updated_at timestamp WITH time zone DEFAULT now() NOT NULL
);

CREATE TABLE app.deal (
    id bigint DEFAULT app.id_generator() NOT NULL,
    artist_id bigint,
    event_type text,
    event_billing_type text,
    status_type text NOT NULL,
    created_at timestamp WITH time zone DEFAULT now() NOT NULL,
    updated_at timestamp WITH time zone DEFAULT now() NOT NULL
);

--- JOIN TABLES

-- indexes and relationships

ALTER TABLE ONLY app.ticket_scaling ADD CONSTRAINT ticket_scaling_pkey PRIMARY KEY (id);
ALTER TABLE ONLY app.show_schedule ADD CONSTRAINT show_schedule_pkey PRIMARY KEY (id);
ALTER TABLE ONLY app.performance_schedule ADD CONSTRAINT performance_schedule_pkey PRIMARY KEY (id);
ALTER TABLE ONLY app.expense ADD CONSTRAINT expense_pkey PRIMARY KEY (id);
ALTER TABLE ONLY app.artist ADD CONSTRAINT artist_pkey PRIMARY KEY (id);
ALTER TABLE ONLY app.person ADD CONSTRAINT person_pkey PRIMARY KEY (id);
ALTER TABLE ONLY app.venue ADD CONSTRAINT venue_pkey PRIMARY KEY (id);
ALTER TABLE ONLY app.deal_structure ADD CONSTRAINT deal_structure_pkey PRIMARY KEY (id);
ALTER TABLE ONLY app.deal ADD CONSTRAINT deal_pkey PRIMARY KEY (id);
ALTER TABLE ONLY app.deal_event ADD CONSTRAINT deal_event_pkey PRIMARY KEY (id);

ALTER TABLE app.ticket_scaling OWNER TO postgres;
ALTER TABLE app.show_schedule OWNER TO postgres;
ALTER TABLE app.performance_schedule OWNER TO postgres;
ALTER TABLE app.expense OWNER TO postgres;
ALTER TABLE app.artist OWNER TO postgres;
ALTER TABLE app.person OWNER TO postgres;
ALTER TABLE app.venue OWNER TO postgres;
ALTER TABLE app.deal_structure OWNER TO postgres;
ALTER TABLE app.deal OWNER TO postgres;
ALTER TABLE app.deal_event OWNER TO postgres;

ALTER TABLE app.ticket_scaling ADD CONSTRAINT ticket_scaling_ticket_type_fkey FOREIGN KEY (ticket_type) REFERENCES app.ticket_type;
ALTER TABLE app.ticket_scaling ADD CONSTRAINT ticket_scaling_deal_id_fkey FOREIGN KEY (deal_id) REFERENCES app.deal(id) ON DELETE CASCADE;
ALTER TABLE app.show_schedule ADD CONSTRAINT show_schedule_deal_id_fkey FOREIGN KEY (deal_id) REFERENCES app.deal(id);
ALTER TABLE app.performance_schedule ADD CONSTRAINT performance_schedule_deal_id_fkey FOREIGN KEY (deal_id) REFERENCES app.deal(id);
ALTER TABLE app.expense ADD CONSTRAINT expense_deal_id_fkey FOREIGN KEY (deal_id) REFERENCES app.deal(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE app.expense ADD CONSTRAINT expense_expense_type_fkey FOREIGN KEY (expense_type) REFERENCES app.expense_type;
ALTER TABLE app.deal_structure ADD CONSTRAINT deal_structure_deal_structure_type_fkey FOREIGN KEY (deal_structure_type) REFERENCES app.deal_structure_type;
ALTER TABLE app.deal ADD CONSTRAINT deal_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES app.artist(id);
ALTER TABLE app.deal ADD CONSTRAINT deal_status_type_fkey FOREIGN KEY (status_type) REFERENCES app.deal_status_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE app.deal ADD CONSTRAINT deal_event_type_fkey FOREIGN KEY (event_type) REFERENCES app.deal_event_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE app.deal ADD CONSTRAINT deal_event_billing_type_fkey FOREIGN KEY (event_billing_type) REFERENCES app.deal_event_billing_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE app.deal_event ADD CONSTRAINT deal_event_deal_id_fkey FOREIGN KEY (deal_id) REFERENCES app.deal(id);
ALTER TABLE app.deal_event ADD CONSTRAINT deal_event_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES app.venue(id);
ALTER TABLE app.deal_event ADD CONSTRAINT deal_event_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES app.person(id);
ALTER TABLE app.deal_event ADD CONSTRAINT deal_event_copromoter_id_fkey FOREIGN KEY (copromoter_id) REFERENCES app.person(id);


CREATE INDEX ticket_scaling_deal_id_idx ON app.ticket_scaling USING btree (deal_id);
CREATE INDEX show_schedule_deal_id_idx ON app.show_schedule USING btree (deal_id);
CREATE INDEX performance_schedule_deal_id_idx ON app.performance_schedule USING btree (deal_id);
CREATE INDEX deal_artist_id_idx ON app.deal USING btree (artist_id);
CREATE INDEX deal_event_deal_id_idx ON app.deal_event USING btree (deal_id);
