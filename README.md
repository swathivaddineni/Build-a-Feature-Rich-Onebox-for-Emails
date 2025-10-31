**Build a Feature-Rich Onebox for Emails**
---

Assignment - Build a Feature-Rich Onebox for Emails

---

## Backend
---
## Features

### **1. Real-Time Email Synchronization**

- Sync multiple **IMAP accounts** in real-time - minimum 2
- Fetch **at least the last 30 days** of emails
- Use **persistent IMAP connections (IDLE mode)** for real-time updates (**No cron jobs!**).

### **2. Searchable Storage using Elasticsearch**

- Store emails in a **locally hosted Elasticsearch** instance (use Docker).
- Implement indexing to **make emails searchable**.
- Support filtering by **folder & account**.

### **3. AI-Based Email Categorization**

- Implement an AI model to categorize emails into the following labels:
    - **Interested**
    - **Meeting Booked**
    - **Not Interested**           
    - **Spam**
    - **Out of Office**

### **4. Slack & Webhook Integration**

- Send **Slack notifications** for every new **Interested** email.

### **5. AI-Powered Suggested Replies**

- Store the **product and outreach agenda** in a **vector database**.
- Use **RAG (Retrieval-Augmented Generation)** with any LLM to suggest replies.

### **6. Frontend Interface**
- Build a simple UI to display emails, filter by folder/account, and show AI categorization.

---
## Tech Stack :-

-- **Node.js** with **Express**
-- **TypeScript**
-- **Dotenv**
-- **LongChain + Choroma**
-- **IMAP** ("imapflow")
-- **ElasticSearch via Docker**
-- **OpenAI/Gemini API**
-- **Slack Webhooks**
-- **Mailparser**


---

## Folder Structure

backend/
── src/
   ── controllers/
   ── routes/
   ── imap/
   ── services/
   ── utils/
   ── index.ts

── .env
── package.json
── tsconfig.json
── docker-compose.yml


## .env setup
locate/create ".env" file and then add the following:-

GEMINI_API_KEY='Enter you API key'/GEMINI_API_KEY='Enter your Gemini API key here'
SlackWebhook_URL='Enter the URL'
INTERESTED_WEBHOOK_URL='Enter the URL'


## Run this Backend Project Locally...

Follow the following to run this OneBox Backend server on your system:-

###  Prerequisites required..

Carefully install the following before running the backend:-

--**Node.js**(v18)
--**API key**
--**IMAP enabled google account and app password**(After Turning on 2FA)
--**Docker**(Install Docker dekstop and set it up)
--**Postman** (For test APIs purpose..)
--Optional guide:- **use my package.json file dependencies to recheck versions**


-----------------------------------------------------------------------------------------------------------------------------------------

## Setting Up Files on you system


1. Clone the Repository

"https://github.com/swathivaddineni/Build-a-Feature-Rich-Onebox-for-Emails/new/main?readme=1"

2. Install all dependencies

**npm install**

3. Run ElasticSearch using Docker

Note: you can use my docker-compose.yml file.

On terminal:
    >Run docker --version to confirm docker is installed
    >docker-compose pull to load the docker and Kibana
    >docker-compose down to down the docker server and then again pull
    (This is personal Tip if you caught any error in ES you can do this...)

4. Start the Development server

**npm run dev**

You can see on terminal as:-

Index 'emails' already exists
Server is running on port <PORT>


-----------------------------------------------------------------------------------------------------------------------------------------
## Test the API

Recommended to use Postman

1. Create IMAP account get your key password with you
2. Use Post method http://localhost:5000/api/accounts

3. Make sure Postman read content on json format

4. on body :-
{
  "email": "your@gmail.com",
  "password": "your_app_password",
  "host": "imap.gmail.com",
  "port": 993,
  "secure": true
}


5. Search for emails:-
Use GET method http://localhost:PORT/api/account/search/category?query=demo&account=your@gmail.com&folder=INBOX

6. API 5: Suggest AI Reply (Gemini + Vector): 

POST http://localhost:5000/api/reply/suggest

BODY:
{
  "subject": "Let's schedule an interview",
  "body": "You've been shortlisted. Please share your availability.",
  "email": "hr@example.com"
}


Note:
Some issue you can tackle:-
> Gmail IMAP login failed? Make sure you use an App password.
> Have ElasticSearch Error take a look and check docker is running on port 9200.
> for categorisation issue check you API key and declaration of Key.

**link**

<img width="1056" height="532" alt="Screenshot 2025-10-31 084456" src="https://github.com/user-attachments/assets/066abaad-c774-4783-8068-6ec3f433536d" />


## Credits:
--Some Part of this Codebase is assisted by Chatgpt for some structure of tackling errors.
--SlackWebhook Documentation.
--Vectordb and Chroma documentaion.
