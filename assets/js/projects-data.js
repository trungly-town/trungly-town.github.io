/*
 * Project case studies — rendered by assets/js/project.js into projects/<id>/ (and project.html?id=<id>).
 * After editing, run `node tools/build-pages.mjs` to refresh the shareable pages and preview images.
 * Order here = order of the "Previous / Next" navigation (matches the cards on index.html).
 * All fields are plain text (no HTML).
 *
 * Fields
 *   id, title, kicker, icon (sprite id without "i-"), cats (genai | analytics | data | ml)
 *   org, unit, period, role
 *   summary            one-paragraph lead
 *   metrics[]          optional headline numbers { value, label } shown under the lead
 *   context[]          "Why it was built" paragraphs
 *   roleList[]         "My role" bullets
 *   built[]            { title, text } — key components
 *   flow               { kicker, heading, steps: [{ label, text, core?, chips?[] }] }
 *   visual             optional special illustration ("did")
 *   value[]            "Why it matters" bullets
 *   stack[]            methods & tools
 *   confidential       true → shows a note that code/data are proprietary
 */
window.PROJECTS = [
  {
    id: 'm-smart',
    title: 'M-Smart — AI Insurance Assistant',
    kicker: 'Agentic RAG in the MPA mobile app',
    icon: 'bot',
    cats: ['genai', 'data'],
    org: 'Manulife',
    unit: 'AI & Enterprise Data Office',
    period: 'May 2026 — Present',
    role: 'Agentic RAG architecture & data pipelines',
    summary: 'An AI assistant inside the MPA mobile app that lets insurance agents ask about products, get recommendations, generate quotations, turn customer data into insights and next-best-action recommendations, and look up a customer\'s policies, claims, payments and transactions — all in one conversation.',
    metrics: [
      { value: '2,000+', label: 'agents using it every month' },
      { value: '50K+', label: 'messages sent per month' },
    ],
    context: [
      'Insurance agents work across product documents, quotation tools, customer data and policy systems — often while a customer is waiting. Every question can mean switching apps or asking a colleague.',
      'M-Smart brings those workflows into a single assistant inside the MPA app agents already use, with answers grounded in Manulife\'s own product, policy and customer data.',
    ],
    roleList: [
      'Designed the Agentic RAG architecture — how the assistant reasons, routes requests and grounds its answers.',
      'Built the end-to-end data pipelines that feed the assistant with product, customer, policy, claim and payment data.',
      'Automated the six core agent workflows below.',
    ],
    built: [
      { title: 'Product Q&A', text: 'Answers product questions from approved product documentation, so agents can respond accurately on the spot.' },
      { title: 'Product Recommendations', text: 'Suggests suitable products for a customer, helping agents move from conversation to proposal.' },
      { title: 'Quotation generation', text: 'Produces quotations from inside the chat instead of a separate tool.' },
      { title: 'Customer Insights', text: 'Reads the customer\'s profile and policy data and turns it into insights agents can use before and during a meeting.' },
      { title: 'Next Best Action', text: 'Recommends the agent\'s next step with each customer — who to follow up, what to offer and when — based on those insights.' },
      { title: 'Customer Data Lookup', text: 'Pulls up a customer\'s policies, claims, payments and transaction history on request, cutting the time spent searching other systems.' },
      { title: 'End-to-end data pipelines', text: 'Keep the assistant\'s knowledge and data sources current and consistent.' },
    ],
    flow: {
      steps: [
        { label: 'Agent asks', text: 'A question or task typed in the MPA mobile app.' },
        { label: 'Understand', text: 'The assistant interprets the intent and context of the request.' },
        { label: 'Route', text: 'An agentic router picks the right capability.', core: true, chips: ['Product Q&A', 'Recommendations', 'Quotation', 'Customer Insights', 'Next Best Action', 'Policy & Claim Lookup', 'Payments & Transactions'] },
        { label: 'Retrieve & act', text: 'Pulls from documents and data via the pipelines, or runs the tool.' },
        { label: 'Answer', text: 'A grounded, agent-ready response.' },
      ],
    },
    value: [
      'Adopted at scale: 2,000+ agents use it every month, sending 50,000+ messages.',
      'One entry point for six everyday workflows instead of several separate tools.',
      'Turns raw customer data into insights and a clear next action, so agents know who to call and what to offer.',
      'Answers grounded in Manulife\'s own product, policy, claim and payment data — not the open web.',
      'Faster responses for agents while they are with customers.',
    ],
    stack: ['Agentic RAG', 'LLM tool calling', 'Retrieval-augmented generation', 'Data pipelines', 'Mobile app integration'],
    confidential: true,
  },

  {
    id: 'vea-model',
    title: 'VEA Model',
    kicker: 'Measuring the real value of GenAI',
    icon: 'trend',
    cats: ['analytics'],
    org: 'Manulife',
    unit: 'AI & Enterprise Data Office',
    period: 'May 2026 — Present',
    role: 'Model design, analysis & monthly reporting',
    summary: 'A Difference-in-Differences model that answers the question every GenAI program eventually faces: what value did it actually create?',
    context: [
      'Usage dashboards tell you who used a GenAI tool — not what changed because of it. And simply comparing users with non-users is misleading: the people who adopt new tools first are often already the strongest performers.',
      'Leadership needed a defensible, recurring estimate of GenAI\'s value for the Vietnam market.',
    ],
    roleList: [
      'Built the VEA model using Difference-in-Differences (DiD) to quantify GenAI value.',
      'Authored the monthly Vietnam market performance reports for regional stakeholders.',
    ],
    built: [
      { title: 'Causal design', text: 'Compares GenAI adopters (treatment) with a comparable group (control), before and after the rollout.' },
      { title: 'Difference-in-Differences estimate', text: 'Subtracts the control group\'s change from the treatment group\'s change, removing shared trends and pre-existing gaps.' },
      { title: 'Monthly reporting', text: 'Turns the estimate into a monthly Vietnam market performance report for regional stakeholders.' },
    ],
    visual: 'did',
    flow: {
      kicker: 'How the method works',
      heading: 'From raw activity to a causal estimate',
      steps: [
        { label: 'Define groups', text: 'Treatment: GenAI adopters. Control: comparable non-adopters.' },
        { label: 'Set windows', text: 'Measure the outcome before and after the rollout.' },
        { label: 'Check assumptions', text: 'Parallel pre-trends make the control a fair counterfactual.' },
        { label: 'Estimate', text: 'DiD = (Treated after − before) − (Control after − before).', core: true },
        { label: 'Report', text: 'Monthly performance reports for regional stakeholders.' },
      ],
    },
    value: [
      'Moves the GenAI conversation from usage to measured value.',
      'Avoids the self-selection bias of naive adopter vs. non-adopter comparisons.',
      'Gives regional leadership a consistent monthly view of the Vietnam market.',
    ],
    stack: ['Difference-in-Differences', 'Causal inference', 'Hypothesis testing', 'Panel data analysis', 'Executive reporting'],
    confidential: true,
  },

  {
    id: 'vn-knowledge-bot',
    title: 'VN Knowledge Bot',
    kicker: 'Sales enablement inside Salesforce',
    icon: 'chat',
    cats: ['genai'],
    org: 'Manulife',
    unit: 'AI & Enterprise Data Office',
    period: 'May 2026 — Present',
    role: 'Developer',
    summary: 'An internal sales-support chatbot in Salesforce that puts SOPs, Product Worksheets and customer objection-handling guidance one question away.',
    context: [
      'Sales teams depend on Standard Operating Procedures (SOPs) and Manulife Product Worksheets (PWS). They are long, updated often and spread across many documents.',
      'When a customer raises an objection mid-conversation, nobody has time to search a PDF.',
    ],
    roleList: [
      'Developed the internal sales-support chatbot.',
      'Connected it to SOPs, Product Worksheets and real-time objection-handling guidance.',
    ],
    built: [
      { title: 'SOP answers', text: 'Ask how a process works and get the answer from the official SOP.' },
      { title: 'Product Worksheet lookup', text: 'Quick access to product details from Manulife Product Worksheets (PWS).' },
      { title: 'Objection handling', text: 'Real-time guidance on responding to customer objections.' },
      { title: 'Inside Salesforce', text: 'Lives where sales teams already work — no extra app to open.' },
    ],
    flow: {
      steps: [
        { label: 'Ask in Salesforce', text: 'A salesperson types a question in the chat.' },
        { label: 'Retrieve', text: 'Finds the relevant SOP, PWS or guidance passages.' },
        { label: 'Generate', text: 'An LLM composes an answer grounded in those passages.', core: true },
        { label: 'Respond', text: 'A concise answer the salesperson can use immediately.' },
      ],
    },
    value: [
      'Less time searching documents, more time with customers.',
      'Consistent answers drawn from the same official sources.',
      'No context switching out of Salesforce.',
    ],
    stack: ['RAG', 'Document retrieval', 'LLM', 'Salesforce', 'Knowledge management'],
    confidential: true,
  },

  {
    id: 'rtrack-ai',
    title: 'RTrack AI',
    kicker: 'Requirement engineering for IC design',
    icon: 'cpu',
    cats: ['genai'],
    org: 'Renesas Electronics',
    unit: 'AI Department',
    period: 'Nov 2024 — May 2026',
    role: 'Architect — chat agent & batch systems',
    summary: 'A Requirement Engineering creation & verification suite for IC design — AI agents that help write, validate and audit specifications and verification code.',
    context: [
      'In IC design, requirements must be precise and verification code (UVM, SystemC) must follow strict standards. Reviewing all of it by hand is slow and error-prone.',
      'The knowledge involved is split between technical documents and large codebases, so the system first has to understand both.',
    ],
    roleList: [
      'Architected the Chat Agent and the batch system for creating and validating requirements.',
      'Developed the rule-check batch system for UVM and SystemC compliance.',
      'Built the AI document-review agent and designed the unified ingestion pipeline.',
    ],
    built: [
      { title: 'Chat Agent', text: 'An interactive assistant for creating and validating requirements, streamlining technical specification analysis.' },
      { title: 'Batch validation', text: 'Runs requirement creation and validation at scale instead of one document at a time.' },
      { title: 'Automated auditing', text: 'Rule-check batches for UVM and SystemC codebases, enforcing hardware-verification standards.' },
      { title: 'Document review agent', text: 'Batch-processes documents to catch typographical errors.' },
      { title: 'Unified ingestion', text: 'A Dynamic Intelligence Pipeline that ingests both technical documentation and complex source code.' },
    ],
    flow: {
      steps: [
        { label: 'Docs + code', text: 'Specifications, technical documents and verification codebases.' },
        { label: 'Ingest', text: 'The Dynamic Intelligence Pipeline normalizes documents and source code.' },
        { label: 'Agents', text: 'Chat and batch agents create, validate and audit.', core: true, chips: ['Requirement creation', 'Validation', 'UVM / SystemC checks', 'Typo review'] },
        { label: 'Report', text: 'Validated requirements and compliance findings for engineers.' },
      ],
    },
    value: [
      'Faster requirement creation and review for IC-design teams.',
      'Consistent compliance checks for UVM and SystemC code.',
      'One pipeline that understands both documents and source code.',
    ],
    stack: ['AI agents', 'LLM batch processing', 'RAG', 'UVM', 'SystemC', 'Code analysis'],
    confidential: true,
  },

  {
    id: 'rendi',
    title: 'RenDI',
    kicker: 'Renesas Document Intelligence',
    icon: 'file',
    cats: ['genai', 'data'],
    org: 'Renesas Electronics',
    unit: 'AI Department',
    period: 'Nov 2024 — May 2026',
    role: 'Built the core library & universal parser',
    summary: 'The in-house RAG library behind domain-specific LLM applications — it turns almost any file or codebase into structured, searchable knowledge.',
    context: [
      'Every LLM application needs the same foundation: parse files, chunk them, embed them, index them.',
      'Engineering knowledge comes in many formats and source code in many languages — and generic parsers flatten away the structure that gives it meaning.',
    ],
    roleList: [
      'Built the core library for multi-format parsing, chunking, embedding and indexing.',
      'Developed the universal parsing model that converts files and source code into structured Markdown.',
    ],
    built: [
      { title: 'Multi-format parsing', text: 'Reads a wide range of document formats through one interface.' },
      { title: 'Universal code parser', text: 'Transforms raw files and nearly all programming languages into structured Markdown.' },
      { title: 'Structure preservation', text: 'Keeps folder hierarchies and logical relationships, so retrieved content keeps its context.' },
      { title: 'Chunk → embed → index', text: 'A reusable pipeline that makes content retrieval-ready for any LLM app.' },
    ],
    flow: {
      steps: [
        { label: 'Raw files & code', text: 'Documents in many formats; source code in many languages.' },
        { label: 'Parse', text: 'Convert to structured Markdown, preserving hierarchy.', core: true },
        { label: 'Chunk', text: 'Split content into retrievable units.' },
        { label: 'Embed', text: 'Turn each chunk into a vector.' },
        { label: 'Index', text: 'Searchable knowledge for domain-specific LLM apps.' },
      ],
    },
    value: [
      'One shared foundation instead of rebuilding ingestion for every LLM app.',
      'Better retrieval, because document and code structure survive parsing.',
      'Works across nearly all programming languages and many file formats.',
    ],
    stack: ['RAG', 'Document parsing', 'Chunking', 'Embeddings', 'Vector indexing', 'Reusable library'],
    confidential: true,
  },

  {
    id: 'market-intelligence',
    title: 'Market & Customer Intelligence',
    kicker: 'Insights for the Strategy Department',
    icon: 'pin',
    cats: ['analytics'],
    org: 'Manulife',
    unit: 'AI & Enterprise Data Office',
    period: 'May 2026 — Present',
    role: 'Data analysis, reporting & dashboards',
    summary: 'Turning massive raw datasets into decisions for the Strategy Department — which leads to prioritize, which policyholders to re-assign, and which provinces deserve more investment.',
    context: [
      'Leads, policies and geographic data arrive in large, raw volumes. The Strategy Department needed them distilled into clear, actionable answers.',
      'Alongside these deep dives, I run end-to-end reporting for the Vietnam market and maintain the dashboards business units rely on.',
    ],
    roleList: [
      'Processed and analyzed large raw datasets to produce actionable intelligence.',
      'Deliver monthly strategic insights and performance metrics to the Regional Leadership Team.',
      'Maintain and optimize 10+ operational and executive dashboards.',
    ],
    built: [
      { title: 'Lead Scoring & Analytics', text: 'Ranks leads so effort goes where conversion is most likely.' },
      { title: 'Orphan Policyholder Identification', text: 'Finds policyholders without an active agent, to support re-assignment strategies.' },
      { title: 'Geographic Investment Analysis', text: 'Pinpoints high-potential provinces that warrant increased capital allocation.' },
      { title: 'Enterprise dashboards', text: '10+ dashboards for Agency, Digital Leads, Growth Marketing and New Business Underwriting (NBUW).' },
    ],
    flow: {
      steps: [
        { label: 'Raw data', text: 'Leads, policies, agents and geography.' },
        { label: 'Clean & shape', text: 'Turn messy sources into analysis-ready tables.' },
        { label: 'Analyze & score', text: 'Scoring, identification and geographic analysis.', core: true, chips: ['Lead scoring', 'Orphan policies', 'Geo investment'] },
        { label: 'Decide', text: 'Recommendations for Strategy, tracked in dashboards.' },
      ],
    },
    value: [
      'Effort focused on the leads most likely to convert.',
      'Policyholders without an active agent identified for re-assignment.',
      'Capital directed to the provinces with the highest potential.',
      'A consistent monthly view for regional leadership.',
    ],
    stack: ['Lead scoring', 'Customer segmentation', 'Geographic analysis', 'Data wrangling', 'Dashboards', 'Executive reporting'],
    confidential: true,
  },

  {
    id: 'colossus',
    title: 'Colossus',
    kicker: 'Big-data keyword miner',
    icon: 'search',
    cats: ['data'],
    org: 'Renesas Electronics',
    unit: 'AI Department',
    period: 'Nov 2024 — May 2026',
    role: 'Search engine & CLI architecture',
    summary: 'A search engine that mines keywords across hundreds of gigabytes of unstructured data — plus a CLI that makes uploading massive datasets painless.',
    context: [
      'Teams needed to find keywords across hundreds of gigabytes of unstructured data. Ad-hoc scripts do not scale to that size, and getting the data into a searchable system was a bottleneck of its own.',
    ],
    roleList: [
      'Engineered the keyword-mining search engine.',
      'Architected the CLI for the high-throughput big-data uploader.',
    ],
    built: [
      { title: 'High-scale mining', text: 'Extracts keywords across hundreds of GBs of unstructured data.' },
      { title: 'Uploader CLI', text: 'A command-line tool for high-throughput uploads of massive datasets.' },
      { title: 'Developer workflow', text: 'Designed around how engineers actually move and search large datasets.' },
    ],
    flow: {
      steps: [
        { label: 'CLI upload', text: 'Developers push large datasets from the command line.' },
        { label: 'Ingest', text: 'High-throughput loading of unstructured data.' },
        { label: 'Mine', text: 'Keyword extraction across hundreds of GBs.', core: true },
        { label: 'Results', text: 'Matches developers can act on.' },
      ],
    },
    value: [
      'Search that keeps up with data measured in hundreds of gigabytes.',
      'A simpler, faster path from raw dataset to searchable data.',
    ],
    stack: ['Search engine', 'Big data', 'Unstructured data', 'High-throughput ingestion', 'CLI design'],
    confidential: true,
  },

  {
    id: 'ai-usage-platform',
    title: 'AI Usage Data Platform',
    kicker: 'Observability for AI services',
    icon: 'db',
    cats: ['data', 'analytics'],
    org: 'Renesas Electronics',
    unit: 'AI Department',
    period: 'Nov 2024 — May 2026',
    role: 'Data pipeline & Databricks dashboards',
    summary: 'A pipeline that syncs AI application usage data into the Modern Data Platform, with Databricks dashboards that show how AI and Data Intelligence services perform.',
    context: [
      'As more AI applications went live, teams needed one reliable place to see how they were being used and how they performed.',
    ],
    roleList: [
      'Built the data sync pipeline into the Modern Data Platform (Azure Databricks).',
      'Managed the Databricks dashboards for AI and Data Intelligence services.',
    ],
    built: [
      { title: 'Data sync pipeline', text: 'Reliably moves AI application usage data into the Modern Data Platform.' },
      { title: 'Databricks dashboards', text: 'Monitor and visualize performance metrics across AI and Data Intelligence services.' },
      { title: 'Governance', text: 'Keeps usage data consistent and trustworthy for reporting.' },
    ],
    flow: {
      steps: [
        { label: 'AI apps', text: 'Applications generate usage data.' },
        { label: 'Sync pipeline', text: 'Robust sync into the platform.', core: true },
        { label: 'Modern Data Platform', text: 'Usage data lands in Azure Databricks.' },
        { label: 'Dashboards', text: 'Performance metrics for every AI service.' },
      ],
    },
    value: [
      'One source of truth for AI usage across services.',
      'Adoption trends and performance issues visible at a glance.',
    ],
    stack: ['Azure Databricks', 'Data pipelines', 'ETL', 'Dashboards', 'Data governance'],
    confidential: true,
  },

  {
    id: 'wellora',
    title: 'Personalization & Predictive Maintenance',
    kicker: 'Data science for a two-sided platform',
    icon: 'wrench',
    cats: ['ml', 'analytics'],
    org: 'Wellora Click',
    unit: 'Philadelphia, PA · Remote',
    period: 'May 2024 — Aug 2025',
    role: 'Data Scientist (equity-based)',
    summary: 'Data science for both sides of a nail-salon business: what customers see in the booking app, and how equipment and technicians are kept running.',
    context: [
      'Wellora Click runs a fast-growing nail-booking app and an equipment service platform. The two sides have very different problems — converting users on one, minimizing downtime on the other — and both needed data science to drive decisions.',
    ],
    roleList: [
      'Built ML and statistical models for app personalization and service optimization.',
      'Translated model output into business strategy.',
      'Collaborated with AI Engineers on the in-house agentic RAG system.',
    ],
    built: [
      { title: 'Recommendation engines', text: 'Personalize what users see in the booking app.' },
      { title: 'Booking & pricing optimization', text: 'Strategies aimed at higher user conversion and revenue.' },
      { title: 'Predictive maintenance', text: 'Models that anticipate equipment issues to minimize downtime.' },
      { title: 'Technician logistics', text: 'Optimizing technician logistics to support faster service.' },
    ],
    flow: {
      steps: [
        { label: 'App & service data', text: 'Bookings, users, equipment and service history.' },
        { label: 'Features', text: 'Signals engineered for each problem.' },
        { label: 'Models', text: 'ML and statistical models per use case.', core: true, chips: ['Recommendations', 'Pricing', 'Failure prediction', 'Logistics'] },
        { label: 'Actions', text: 'Personalized offers, smarter prices, proactive maintenance.' },
      ],
    },
    value: [
      'Personalization and pricing aimed at higher conversion and revenue.',
      'Less equipment downtime through proactive maintenance.',
      'Data science tied directly to business strategy.',
    ],
    stack: ['Recommender systems', 'Pricing optimization', 'Predictive maintenance', 'Statistical modeling', 'Logistics optimization'],
    confidential: true,
  },

  {
    id: 'flipjungle',
    title: 'Multi-LLM Learning Platform',
    kicker: 'EdTech + LLM evaluation',
    icon: 'layers',
    cats: ['genai', 'ml'],
    org: 'Flipjungle AI',
    unit: 'EdTech',
    period: 'Sep 2023 — Nov 2024',
    role: 'AI Software Engineer → Team Lead (3 engineers)',
    summary: 'An EdTech platform powered by multiple LLMs — with RAG, fine-tuning, math reasoning and a proper evaluation loop, shipped on AWS and GCP.',
    context: [
      'Personalized learning for children needs AI that is accurate (especially in math), affordable to run and continuously evaluated — not just a single model behind an API.',
    ],
    roleList: [
      'Built backend systems for the app and admin panel on AWS, GCP and REST APIs.',
      'Integrated and managed multiple LLMs with RAG and fine-tuning; developed logical reasoning for math practice tests.',
      'Led a team of 3 engineers: GitHub Actions CI/CD, Pytest, code reviews, documentation and AWS/GCP cost-performance.',
    ],
    built: [
      { title: 'Multi-LLM integration', text: 'GPT, Gemini, Claude and Llama, combined with RAG and fine-tuning.' },
      { title: 'Math reasoning', text: 'Logical reasoning for math practice tests.' },
      { title: 'Evaluation platform', text: 'MLflow-based evaluation to compare and track model quality.' },
      { title: 'Development-skills prototype', text: 'A prototype model to assess children\'s development skills.' },
      { title: 'Backend & infrastructure', text: 'APIs, database optimization, CI/CD and cost-aware AWS/GCP infrastructure.' },
    ],
    flow: {
      steps: [
        { label: 'Learner', text: 'Requests from the app and admin panel.' },
        { label: 'Backend API', text: 'FastAPI / Flask services on AWS and GCP.' },
        { label: 'LLMs', text: 'Multiple models with RAG and fine-tuning.', core: true, chips: ['GPT', 'Gemini', 'Claude', 'Llama'] },
        { label: 'Evaluate', text: 'Model quality tracked in MLflow.' },
        { label: 'Ship', text: 'GitHub Actions CI/CD with Pytest.' },
      ],
    },
    value: [
      'Multiple LLMs available behind one platform.',
      'Model quality measured, not assumed, through MLflow evaluation.',
      'Reliable releases through CI/CD and automated tests.',
      'Infrastructure balanced for cost and performance.',
    ],
    stack: ['Python', 'FastAPI', 'Flask', 'PostgreSQL', 'SQLAlchemy', 'Docker', 'AWS', 'GCP', 'MLflow', 'GitHub Actions', 'Pytest', 'Selenium', 'OpenAI fine-tuning', 'RAG'],
    confidential: true,
  },

  {
    id: 'admissions-qa',
    title: 'Admissions QA System',
    kicker: 'NLP research',
    icon: 'cap',
    cats: ['ml'],
    org: 'International University — VNU-HCM',
    unit: 'Research',
    period: 'Jan 2023 — Oct 2023',
    role: 'Deep Learning Research Assistant',
    summary: 'A deep-learning Question Answering system that supports university admissions consulting.',
    context: [
      'Admissions consulting handles many recurring questions from prospective students. A QA system can answer common ones instantly and leave consultants more time for complex cases.',
    ],
    roleList: [
      'Researched natural language processing approaches for question answering.',
      'Built the Question Answering system for admissions consulting support.',
    ],
    built: [
      { title: 'NLP research', text: 'Explored question-answering approaches for the admissions domain.' },
      { title: 'QA model', text: 'A deep-learning model built with TensorFlow.' },
      { title: 'Admissions support', text: 'Designed to support the university\'s admissions consultants.' },
    ],
    flow: {
      steps: [
        { label: 'Question', text: 'A prospective student asks about admissions.' },
        { label: 'Preprocess', text: 'Text is cleaned and encoded.' },
        { label: 'QA model', text: 'Deep-learning model finds the answer.', core: true },
        { label: 'Answer', text: 'Returned to support the consultation.' },
      ],
    },
    value: [
      'Instant answers to common admissions questions.',
      'A research foundation in NLP that carried into later production RAG work.',
    ],
    stack: ['Python', 'TensorFlow', 'Deep learning', 'NLP', 'Question answering'],
    confidential: false,
  },

  {
    id: 'stock-forecasting',
    title: 'Stock Forecasting & Sentiment',
    kicker: 'Fintech ML',
    icon: 'activity',
    cats: ['ml'],
    org: 'Phu Hung Securities',
    unit: 'Internship',
    period: 'Jun 2023 — Sep 2023',
    role: 'Data Science Intern',
    summary: 'LSTM-based stock price forecasting, sentiment analysis of securities articles, and image processing for Invest Payment.',
    context: [
      'A securities firm runs on signals: price movements, market news and operational data. This internship applied deep learning to each of them.',
    ],
    roleList: [
      'Built an LSTM model to predict future stock prices.',
      'Researched and built sentiment-analysis models for securities articles.',
      'Applied image processing to Invest Payment.',
    ],
    built: [
      { title: 'Price forecasting', text: 'An LSTM sequence model trained on historical prices.' },
      { title: 'Sentiment analysis', text: 'NLP models that classify the sentiment of securities articles.' },
      { title: 'Image processing', text: 'Computer-vision processing for the Invest Payment product.' },
    ],
    flow: {
      steps: [
        { label: 'Prices & articles', text: 'Historical prices and securities news.' },
        { label: 'Prepare', text: 'Time-series windows and cleaned text.' },
        { label: 'Models', text: 'Deep learning for each signal.', core: true, chips: ['LSTM', 'Sentiment'] },
        { label: 'Signals', text: 'Price forecasts and article sentiment.' },
      ],
    },
    value: [
      'Hands-on deep learning across time series, NLP and computer vision.',
    ],
    stack: ['Python', 'LSTM', 'Deep learning', 'NLP', 'Image processing', 'Data analysis'],
    confidential: true,
  },
];
