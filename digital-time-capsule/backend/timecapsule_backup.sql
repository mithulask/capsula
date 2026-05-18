--
-- PostgreSQL database dump
--

\restrict crZPmEpV6TrULxRhVfUKFPatPmDo9KlrjamiN966ZUC1j2iegeAhi21TyjCucq2

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: capsule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capsule (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    unlock_date date NOT NULL,
    message text
);


ALTER TABLE public.capsule OWNER TO postgres;

--
-- Name: capsule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.capsule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.capsule_id_seq OWNER TO postgres;

--
-- Name: capsule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.capsule_id_seq OWNED BY public.capsule.id;


--
-- Name: capsule_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capsule_members (
    id integer NOT NULL,
    capsule_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.capsule_members OWNER TO postgres;

--
-- Name: capsule_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.capsule_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.capsule_members_id_seq OWNER TO postgres;

--
-- Name: capsule_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.capsule_members_id_seq OWNED BY public.capsule_members.id;


--
-- Name: capsules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capsules (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    content text,
    media_url character varying(500),
    unlock_date timestamp without time zone NOT NULL,
    created_at timestamp without time zone,
    owner_id integer NOT NULL
);


ALTER TABLE public.capsules OWNER TO postgres;

--
-- Name: capsules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.capsules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.capsules_id_seq OWNER TO postgres;

--
-- Name: capsules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.capsules_id_seq OWNED BY public.capsules.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(128) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: capsule id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsule ALTER COLUMN id SET DEFAULT nextval('public.capsule_id_seq'::regclass);


--
-- Name: capsule_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsule_members ALTER COLUMN id SET DEFAULT nextval('public.capsule_members_id_seq'::regclass);


--
-- Name: capsules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsules ALTER COLUMN id SET DEFAULT nextval('public.capsules_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: capsule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.capsule (id, title, unlock_date, message) FROM stdin;
\.


--
-- Data for Name: capsule_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.capsule_members (id, capsule_id, user_id) FROM stdin;
\.


--
-- Data for Name: capsules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.capsules (id, title, content, media_url, unlock_date, created_at, owner_id) FROM stdin;
1	Test Capsule	This is a test capsule.	https://example.com/image.png	2025-12-31 00:00:00	2025-12-02 16:44:34.218378	2
2	rahh	woopwoop	\N	2025-12-17 00:00:00	2025-12-02 16:45:24.222312	1
3	lalala	lalala	\N	2025-12-17 00:00:00	2025-12-02 16:49:43.950859	1
4	hello	adfsf	\N	2025-12-23 00:00:00	2025-12-02 17:11:08.296595	1
5	laladsfsd	dsfsdfdsf	\N	2025-12-24 00:00:00	2025-12-02 17:11:33.708069	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash) FROM stdin;
1	mirani	suresmit000@gmail.com	$2b$12$t4PNNv00E3d8QE23e04WOejEhlz9ezA9JD9nD6XDL9MylNdGgxrHm
2	testuser	testuser@example.com	$2b$12$tyy5qtPtSYs8rvlIAGvdSO/3/uxhJ8s1v2gESbJS1Wj9GrN/g3FyS
\.


--
-- Name: capsule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.capsule_id_seq', 1, false);


--
-- Name: capsule_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.capsule_members_id_seq', 1, false);


--
-- Name: capsules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.capsules_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: capsule_members capsule_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsule_members
    ADD CONSTRAINT capsule_members_pkey PRIMARY KEY (id);


--
-- Name: capsule capsule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsule
    ADD CONSTRAINT capsule_pkey PRIMARY KEY (id);


--
-- Name: capsules capsules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsules
    ADD CONSTRAINT capsules_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: capsule_members capsule_members_capsule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsule_members
    ADD CONSTRAINT capsule_members_capsule_id_fkey FOREIGN KEY (capsule_id) REFERENCES public.capsules(id);


--
-- Name: capsule_members capsule_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsule_members
    ADD CONSTRAINT capsule_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: capsules capsules_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capsules
    ADD CONSTRAINT capsules_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict crZPmEpV6TrULxRhVfUKFPatPmDo9KlrjamiN966ZUC1j2iegeAhi21TyjCucq2

