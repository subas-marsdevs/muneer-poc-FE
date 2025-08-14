export const dummyData = [
  {
    question: "what is the acceptance criteria for project muneer",
    content: {
      answer:
        "The acceptance criteria for Project Muneer include the following:\n\n1. The ability to upload, embed, and query within 30 seconds for a 10-page PDF.\n2. Correct citation links must open the exact page or slide.\n3. An Arabic prompt “؟موﯾﻟا وﻛﻣارأ مﮭﺳ ﺎﻣ رﻌﺳ” should return the Tadawul price with a timestamp.\n4. There should be no hard-coded secrets in the repository [1].",
      sources: {
        "1": {
          document_id: 1,
          page_number: 1,
          source_location: "page_1",
          similarity: 0.4883657707731961,
          chunk_text:
            "One-Page POC Brief – Project “Muneer”\n\n1. Goal\n\nBuild a clickable, cloud-hosted Proof of Concept (POC) that demonstrates Muneer’s core value: an AI workspace that ingests Saudi-market finance documents and answers bilingual (Arabic/English) questions with cited sources.\n\n2. Scope (Must-Have for POC)\n\nArea\n\nArea\n\nRequirement\n\nData • Upload ≤ 5 files (PDF, PPTX, XLSX) • Pull live Tadawul price for one ticker Ingestion via free API\n\n• Extract tables/text, store in vector DB (e.g., PgVector)\n\nChat UI • Single-page web app (React or Next.js) • Prompt box, streaming answers, source chips linking back to file page / slide\n\n• Accept Arabic prompts; return Arabic answers (OK to use open-weight\n\nSupport Arabic LLM or translate via API)\n\nSecurity\n\nSecurity\n\n• Local .env for API keys; encrypt files at rest (AES-256)\n\nStub\n\nDeployment • Host on STC Cloud or Docker container (self-host)\n\n3. Out of Scope\n\nAuthentication, multi-tenant setup, PDPL controls, advanced workflow builder, enterprise connectors.",
          filename: "One-Page POC Brief – Project “Muneer”.pdf",
          file_path:
            "/home/ganesh/poc_muneer/uploads/20250812_210716_One-Page POC Brief – Project “Muneer”.pdf",
          file_url:
            "http://localhost:8000/uploads/20250812_210716_One-Page POC Brief – Project “Muneer”.pdf",
        },
        "2": {
          document_id: 1,
          page_number: 1,
          source_location: "page_1",
          similarity: 0.6776097801196814,
          chunk_text:
            "4. Suggested Tech Stack\n\n● Backend: Python 3.11, FastAPI, LangChain, pgvector/PostgreSQL\n\n● LLM: Llama 3 8B (self-host) OR OpenAI GPT-4o (if anonymized)\n\n● Frontend: React + Tailwind, tRPC/REST\n\nInfra: Docker-Compose; optional STC Cloud GPU for LLM\n\n5. Deliverables\n\n1. Running demo URL + admin instructions.\n\n2. Git repo with README (setup, env vars, run, deploy).\n\n3. 2-minute loom/video showing: upload file ➜ ask Arabic + English questions ➜ see answers with citations.\n\n6. Timeline & Effort\n\nWeek\n\nWeek\n\nMilestone\n\n1\n\nSetup repo, Docker, baseline LLM & DB\n\n2 File upload & parsing pipeline\n\n3 Chat API & frontend\n\nArabic QA, Tadawul price fetch, polish & video demo\n\n7. Acceptance Criteria\n\n● Upload, embed, and query within 30 s for a 10-page PDF.\n\n● Correct citation links open exact page/slide.\n\n● Arabic prompt “ ؟موﯾﻟا وﻛﻣارأ مﮭﺳ ﺎﻣ رﻌﺳ ” returns Tadawul price with timestamp.\n\n● No hard-coded secrets in repo.\n\n8. Next Steps\n\n1. Confirm stack & hosting choice.\n\n2. Kick-off meeting (≤ 30 min) to clarify questions.\n\n3. Daily Slack updates; weekly demo.",
          filename: "One-Page POC Brief – Project “Muneer”.pdf",
          file_path:
            "/home/ganesh/poc_muneer/uploads/20250812_210716_One-Page POC Brief – Project “Muneer”.pdf",
          file_url:
            "http://localhost:8000/uploads/20250812_210716_One-Page POC Brief – Project “Muneer”.pdf",
        },
        "3": {
          document_id: 2,
          page_number: 8,
          source_location: "page_8",
          similarity: 0.7806343995768532,
          chunk_text:
            "UK companies in Saudi Arabia\n\n8\n\nCase Study; King’s College\n\nKing’s college Launch in Jeddah, Saudi Arabia\n\nDIT supported the entire process from their first scoping visit to the Kingdom of Saudi Arabia, in 2016, to the introduction to their now Saudi investment arm, the Bugshan group.\n\nIn 2022, The British mission in Saudi hosted a reception in Jeddah, on behalf of King’s and Ashmore to celebrate this milestone. The reception was attended by key Healthcare figures in the Kingdom\n\nThe Saudi Public investment fund (PIF) joined the Bugshan group as investors. paving the way for more wellbeing centres across the Western region of Saudi Arabia.\n\nThe first phase of the project, due to be completed in Q3 of 2023 will launch the 150 bed capacity hospital in Jeddah.\n\nn 2024/25 The project will expand by another 100 beds.\n\nCase Study Astra Zenica\n\nThe Partnership for Healthcare System Sustainability and Resilience\n\n(PHSSR) in Saudi Arabia\n\nThe Partnership for Health System Sustainability and Resilience (PHSSR) is global collaboration between\n\nacademic, governmental, non-governmental, life sciences, healthcare and business organizations aimed\n\nat studying and helping to build health systems that are both resilient to crises and sustainable in the\n\nface of long-term stresses. The PHSSR was established in 2020 by the London School of Economics, the\n\nWorld Economic Forum, and AstraZeneca, who were later joined by global-level partners that include\n\nRoyal Philips, KPMG, Apollo Hospitals and the Center for Asia-Pacific Resilience and Innovation. The\n\npartnership also includes additional organisations at the regional and national levels such as the Saudi",
          filename: "MedicaPresentation_KSA.pptx",
          file_path:
            "/home/ganesh/poc_muneer/uploads/20250812_210839_MedicaPresentation_KSA.pptx",
          file_url:
            "http://localhost:8000/uploads/20250812_210839_MedicaPresentation_KSA.pptx",
        },
        "4": {
          document_id: 2,
          page_number: 6,
          source_location: "page_6",
          similarity: 0.7841853756683601,
          chunk_text:
            "KSA Routes to Market/Tips for Doing Business\n\nMost common routes to market are as follows:\n\nAgent / Distributor – Local representative (access to tenders)\n\nAccess to local technology incubators (i.e. BADIR) and technology/healthcare investment funds (i.e. Riyadh Techno Valley/PIF).\n\nDevelop networks and relationships\n\nOverseas Delivery Partners – AEI (trade/ incubator services)\n\nFamiliarize yourself with traditions, culture, religion, customs etc.\n\n** DUE DILIGENCE & LEGAL ADVICE RECOMMENDED**\n\nVision 2030\n\nThe program aims to restructure the health sector in the Kingdom to be a comprehensive, effective and integrated health system that is based on the health of the individual and society (including the citizen, the resident and the visitor).\n\nThe program depends on the principle of value-based care, which ensures transparency and financial sustainability by promoting public health and preventing diseases, in addition to applying the new model of care related to disease prevention.\n\nThe Privatization Program aims to enhance the role of the private sector in providing services and making government assets available.",
          filename: "MedicaPresentation_KSA.pptx",
          file_path:
            "/home/ganesh/poc_muneer/uploads/20250812_210839_MedicaPresentation_KSA.pptx",
          file_url:
            "http://localhost:8000/uploads/20250812_210839_MedicaPresentation_KSA.pptx",
        },
        "5": {
          document_id: 4,
          page_number: 1,
          source_location: "page_1",
          similarity: 0.8129231854768757,
          chunk_text:
            "User Receives Auto Answer Email User gets unsubscribed from the ENOCH email database (value User clicks f Unsubscribe * button becomes 0) User tries to get auto = answer after they have unsubscribed They get a pop up message saying: You Are Unsubscribed To continue receiving answers, you must be subscribed. Would you like to resubscribe? Yes No Yes a Send them Do Not Send email (Value Answer again 1)\n\nSubscribe to Brighteon.Ai list (AC)\n\n#3 FREE\n\nDatabase\n\nQuestion Received!\n\nBase model:\n\nPrimary: Qwen2.5-7B (deepinfra) backup: Qwen2.5-14B (in-house hosted)\n\nRAG-acr2\n\n1) Send answers\n\n[2] erignteon Al answer to your prompt\n\n2) Unsubscribe to Al answers emails (sent by in-house mail server)\n\nTally total # of questions asked\n\nHRS/BTS AC Subscribers/ HRS and BTS Customers\n\nGet answers via emails ——-—-——'! Upgrade= = — Pa\n\n4 levels of\n\naccess\n\nAC:\n\n[Bronze members only] HRS Subscribers BTS\n\nsubscribers\n\nAPI (syn daily)\n\n#4-VIP\n\nDatabase\n\nAPI (syne daily)\n\nBase model:\n\nPrimary: Qwen2.5-14B (in-house hosted) backup: Qwen2.5-72B (deepinfra)\n\nRAG-acr2\n\nIf unsubscribe from AC (HRS &BTS), on the next database sync they should NOT be able to login\n\nif user uses same email to subscribe to HRS newsletter that they use for HRS Store and they unsub from newsletter, they can still access VIP, because they still have store account.\n\nShopify queries",
          filename: "ENOCH dataflows.pdf",
          file_path:
            "/home/ganesh/poc_muneer/uploads/20250813_183651_ENOCH dataflows.pdf",
          file_url:
            "http://localhost:8000/uploads/20250813_183651_ENOCH dataflows.pdf",
        },
      },
    },
  },
];
