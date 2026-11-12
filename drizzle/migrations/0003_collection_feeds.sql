ALTER TABLE public.schemes ADD COLUMN IF NOT EXISTS alt_names text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.data_sources ADD COLUMN IF NOT EXISTS feed_url text;
ALTER TABLE public.data_sources ADD COLUMN IF NOT EXISTS feed_level text NOT NULL DEFAULT 'central';
ALTER TABLE public.data_sources ADD COLUMN IF NOT EXISTS auto_collect boolean NOT NULL DEFAULT false;
ALTER TABLE public.data_sources ADD COLUMN IF NOT EXISTS last_status text;
ALTER TABLE public.data_sources ADD COLUMN IF NOT EXISTS last_http integer;
GRANT ALL ON public.data_sources, public.schemes, public.collection_runs, public.scheme_documents, public.documents TO service_role;
INSERT INTO public.data_sources (name, url, access_method, integration_status, notes)
SELECT v.name, v.url, 'manual', 'not_integrated', v.notes FROM (VALUES
 ('myScheme','https://www.myscheme.gov.in/','Scheme pages load only in a browser; no public bulk API found. Use downloaded datasets or a permitted crawler.'),
 ('Tamil Nadu Government Portal','https://www.tn.gov.in/','Checked automatically for reachability.'),
 ('TN e-Sevai','https://www.tnesevai.tn.gov.in/','Certificate services portal; checked for reachability.'),
 ('BC, MBC & Minorities Welfare Dept (TN)','https://www.bcmbcmw.tn.gov.in/','Checked for reachability.'),
 ('National Portal of India','https://www.india.gov.in/','Scheme list loads only in a browser; crawl-delay 10s.')
) AS v(name,url,notes)
WHERE NOT EXISTS (SELECT 1 FROM public.data_sources d WHERE d.url = v.url);