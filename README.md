# Benefit Pathfinder Tamil

I have already created a website for my mini-project, but I am not satisfied with its design, functionality, or limited scheme database. I want to create a completely NEW website from scratch. Do not simply modify or reuse the previous website. Build a better, more complete, user-friendly, and functional application.

Project: Civic Nexus

Government Scheme & Scholarship Information Gap Detector

Team Name: Civic Nexus
Team Members: Neha, Sharin, Shreya
Department: AIML-B
College: Rajalakshmi Institute of Technology

1. Main Idea of the Website

I want to create a website where users can enter their basic details, such as age group, occupation, education, and purpose, and then discover government schemes and scholarships relevant to their profile.

The website should be extremely simple to use. The questions asked to users must not be complicated, lengthy, or confusing.

The main goal is to help people discover government benefits they may not know about, understand their eligibility, identify required documents, and learn how to obtain documents they do not have.

2. Completely Redesign the Website

Create a fresh, modern, professional, and attractive UI.

Design requirements:

- Professional civic-tech theme.
- Navy blue, white, teal, and light grey colour palette.
- Simple navigation and clean layouts.
- Attractive homepage with Civic Nexus branding.
- Responsive design for mobile phones, tablets, and desktops.
- Easy-to-understand icons and cards.
- Simple English, with Tamil language support.
- Avoid unnecessary animations and complicated layouts.

Homepage heading:

"Government Benefits Made Simple."

Subtitle:

"Discover government schemes and scholarships you may be eligible for, understand the required documents, and find out how to apply."

Add a prominent button: Find Schemes for Me

3. Simple User Questionnaire

When a user clicks "Find Schemes for Me", display a simple step-by-step questionnaire.

Ask only essential questions:

1. Which state do you live in? (Default: Tamil Nadu)
2. What is your age or age group?
3. What is your occupation? (Student, Farmer, Business Owner, Employed, Unemployed, Homemaker, or Other)
4. What is your purpose? (Education, Scholarship, Business, Agriculture, Housing, Employment, Women Welfare, Financial Assistance, or Other)
5. What is your approximate annual family income? (Optional initially; ask when relevant to eligibility)
6. What is your education level? (Ask only students or when required for a scheme)

Use simple dropdowns, buttons, and selection cards instead of long text inputs.

Do not ask all questions at once. Use conditional logic to display only relevant questions.

4. Comprehensive Government Scheme Database

The existing website contains only four schemes. I do not want a limited database.

I want to include as many verified and currently available Central Government and Tamil Nadu Government schemes as possible, covering different categories and eligible beneficiaries.

Collect and maintain information from the following official sources:

Primary Sources:

- myScheme: https://www.myscheme.gov.in/
- UMANG: https://web.umang.gov.in/
- National Scholarship Portal: https://scholarships.gov.in/
- Open Government Data Platform India: https://data.gov.in/

Additional official sources:

- Tamil Nadu Government departments and official portals.
- Tamil Nadu e-Sevai and relevant official certificate-service portals.
- Official Central and State government department websites.

Include schemes related to:

- Students and education.
- Scholarships and financial assistance.
- Women and child welfare.
- Farmers and agriculture.
- Small businesses and entrepreneurs.
- Housing and social welfare.
- Employment and skill development.
- Health and other welfare benefits.
- Senior citizens and eligible special categories.
- Other Central and Tamil Nadu Government schemes.

Do not restrict the website to only four, ten, or twenty schemes.

5. Proper Backend and Dynamic Scheme Management

Create a complete backend and database so that I can continuously add new schemes, update existing schemes, and remove expired or discontinued schemes without modifying the frontend code.

The website must not depend on a fixed, hardcoded list of schemes.

Create a secure admin dashboard where I can:

- Add new government schemes.
- Add new scholarships.
- Edit eligibility criteria.
- Update benefits and required documents.
- Add or update official application URLs.
- Add the scheme's source website.
- Specify the state and applicable beneficiaries.
- Set application deadlines when verified.
- Record the last-verified date.
- Mark schemes as active, expired, discontinued, or requiring verification.
- Import scheme data using CSV or Excel.
- Search, filter, and manage the complete database.

Whenever a new scheme is added to the backend, it should automatically become available in the appropriate category on the website without requiring frontend changes.

6. Automatic Data Collection and Updates

Design a modular data ingestion system to collect scheme information from myScheme, UMANG, National Scholarship Portal, Open Government Data Platform, and other official government sources.

Requirements:

- Check for official APIs, downloadable datasets, or permitted data-access mechanisms.
- Use supported integrations wherever available.
- If an API is unavailable, provide an admin-based manual entry and CSV import mechanism.
- Store the original official source URL for each scheme.
- Store a last-checked or last-verified date.
- Support periodic update checks when technically and legally permitted.
- Identify newly added schemes and changed scheme information.
- Flag expired, incomplete, or potentially outdated records for admin review.

IMPORTANT: Do not assume all these government portals provide public APIs or unrestricted access. Do not use unauthorized scraping. Build the system so automatic integrations can be added when supported, and manual data management works reliably in the meantime.

7. Scheme Recommendation Engine

After the user submits their details, the system should compare their profile against all relevant schemes in the database.

Use:

- Rule-based eligibility matching.
- Python-based data processing where appropriate.
- NLP or text similarity for matching user needs with scheme descriptions.
- Filtering by state, age, occupation, education, income, and other relevant conditions.

Display all potentially relevant schemes, not just the first four matches.

For each result, display:

- Scheme name.
- Scheme category.
- Benefits provided.
- Eligibility conditions.
- Why the scheme matches the user's profile.
- Required documents.
- Application deadline, if verified.
- Official source.
- Official application link.

Use these result labels:

- Potentially Eligible.
- More Information Required.
- Does Not Meet a Known Eligibility Condition.

Never guarantee eligibility or approval.

8. Required Documents Checklist

This is one of the most important features.

For every scheme or scholarship, display a complete document checklist based on its verified requirements.

Examples:

- Income Certificate.
- Community Certificate, where applicable.
- Residence Certificate, where applicable.
- Aadhaar or other identity documents, where officially required.
- Academic Marksheets.
- Bonafide or Institution Certificate.
- Bank-related documents, where required.
- Disability Certificate, where applicable.
- Other scheme-specific documents.

Allow users to mark each document:

- Available.
- Not Available.
- Not Sure.

Display the checklist separately for every scheme so users understand the specific requirements.

9. Missing Document Assistance

If the user does not possess a required document, do not simply display "Document Missing."

Instead, provide a complete "How to Obtain This Document" section.

For each missing document, show:

1. Name of the document.
2. Why it is required for the selected scheme.
3. Which government department or authority issues it.
4. Eligibility conditions for obtaining it.
5. Supporting documents needed to apply.
6. Step-by-step application procedure.
7. Official online application link.
8. Offline application process, if available.
9. Applicable fees and processing time, only when verified.
10. Alternative documents, only when officially accepted.

For Tamil Nadu users, provide relevant and verified Tamil Nadu government certificate-service procedures, including e-Sevai or other official portals where applicable.

Example:

User needs an Income Certificate for a scholarship but does not have one.

The website should explain:

- Where to apply for an Income Certificate.
- Which supporting documents are needed.
- How to apply online or offline.
- Which official government portal to visit.
- What the user should do after obtaining the certificate.

Do not provide fabricated procedures or assume all certificates follow the same process.

10. Official Scholarship Application Links

For every scholarship, provide a direct official application or scheme-information link whenever available.

Examples of sources:

- National Scholarship Portal.
- myScheme.
- Relevant Tamil Nadu Government scholarship portals.
- Official department websites.
- Verified scheme-specific application portals.

Add a button:

"Apply on Official Website"

If the direct application link is unavailable, display the verified official information page instead.

Do not redirect users to unofficial third-party websites.

Clearly explain that the actual application, verification, and approval are handled by the respective government department.

11. Information Gap Detection Module

Implement a dedicated module that identifies missing or incomplete information in the scheme database.

Check for:

- Missing eligibility criteria.
- Missing required documents.
- Missing benefits information.
- Missing application instructions.
- Missing official application links.
- Missing deadlines.
- Outdated verification dates.
- Broken links, where checking is supported.

Display clear status indicators:

- Complete Information.
- Incomplete Information.
- Needs Verification.
- Potentially Outdated.

Distinguish between information missing in our database and information missing from the actual government source.

12. Technology Stack

Use the following technologies:

Frontend:

- React.
- TypeScript.
- Tailwind CSS.

Backend:

- Supabase.
- PostgreSQL database.
- Supabase authentication for admin access.
- Secure database access and role-based permissions.

AI/ML:

- Python.
- Pandas.
- Scikit-learn.
- NLP-based matching or text similarity.
- Rule-based eligibility filtering.

Create a proper database structure for:

- Government schemes.
- Scholarships.
- Eligibility criteria.
- Required documents.
- Document application guidance.
- Official sources.
- User profiles.
- Information gap reports.
- Verification dates and status.

13. Expected User Workflow

Create this complete workflow:

User opens Civic Nexus
↓
Selects "Find Schemes for Me"
↓
Answers simple profile questions
↓
System searches the entire available verified scheme database
↓
AI/rule-based engine identifies potentially relevant schemes and scholarships
↓
User opens a scheme
↓
Views eligibility criteria and benefits
↓
Checks required documents
↓
Marks missing documents
↓
Receives step-by-step guidance to obtain them
↓
Clicks the verified official application link
↓
Applies through the relevant government portal

14. Final Requirements

Build a genuinely functional website, not just a static UI prototype.

Prioritize:

1. Fresh and professional UI.
2. Simple user questionnaire.
3. Comprehensive and dynamically expandable scheme database.
4. Proper backend and admin dashboard.
5. Scheme and scholarship recommendation.
6. Required-document checklist.
7. Missing-document application guidance.
8. Verified official application links.
9. Data source tracking and update management.
10. Information gap detection.

Start by building the frontend, backend database, admin dashboard, and core user workflow. Then integrate verified scheme data and matching logic.

Do not display fake schemes as real government schemes. Label sample data clearly. Never claim a live government integration exists until it has actually been implemented and tested.

The final result should be an accessible, user-friendly, AI/ML-assisted platform that helps citizens and students in Tamil Nadu discover government schemes and scholarships and understand exactly what to do next.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7b78a2c6-2cd1-4183-810e-8efe74967ae8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
