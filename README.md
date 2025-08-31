# CrowdProof

**Tagline:** *Empowering verified citizen journalism with geo-tagged, timestamped evidence.*

---

## What Is CrowdProof?

**CrowdProof** is a mobile-first and web-enabled platform designed to empower everyday users to act as **verified citizen journalists**. Users capture and upload multimedia evidence—photos, videos, documents—with embedded metadata and trust indicators. Through community-driven verification workflows and secure audit trails, CrowdProof ensures credibility while enabling seamless sharing, especially to Facebook as a trusted “upstream evidence hub.”

**Live Demo:** [Try the CrowdProof Demo Here](https://proof-of-us.lovable.app)

### Why We Built It

* **Tackling misinformation.** Social platforms often circulate unverified content, leading to confusion or misinformation.
* **Bridging the validation gap.** Most citizen journalism tools lack features for metadata integrity or structured verification.
* **Real-world impact.** Inspired by platforms like the Philippines’ **Sumbong sa Pangulo**, which highlight infrastructure issues through citizen reports.
* **Complementing Facebook.** Designed to enhance Facebook’s ecosystem by providing structured, verified content rather than competing with it.

---

## Core Features

* **Multi-Platform Access**

  * Mobile (React Native)
  * Web Portal (React or Vue.js)

* **Robust Backend**

  * API endpoints: `/upload`, `/verify`, `/share/facebook`
  * OAuth 2.0 + JWT (with optional Facebook login)
  * Secure media storage (AES‑256) and metadata in PostgreSQL

* **Integrity & Verification**

  * Automatic metadata extraction (EXIF, GPS, timestamps)
  * SHA‑256 hashing with HMAC verification
  * Structured role-based workflows (Uploader → Verifier → Curator → Moderator)
  * Status tracking (pending → flagged → verified / rejected)

* **Security, Privacy & Transparency**

  * TLS in transit, AES‑256 encrypted storage
  * Full audit logging for traceability
  * Anonymous submissions and privacy transparency messaging

* **Facebook Integration**

  * Share verified content with “Verified Evidence” badge via Graph API

* **Optional Enhancements**

  * Blockchain anchoring for immutable data
  * Mission-based evidence capture tasks
  * Context-aware privacy consent prompts

---

## Installation & Local Setup

### Prerequisites

* Node.js (v18+)
* Docker & Docker Compose
* Git
* AWS credentials or equivalent

### Setup Steps

```bash
git clone https://github.com/your-org/crowdproof.git
cd crowdproof

cp .env.example .env
# Populate JWT_SECRET, DATABASE_URL, AWS credentials, FB_APP_ID, etc.

docker-compose up --build

docker-compose exec api npx prisma migrate deploy

open http://localhost:3000
```

---

## How to Use

1. **Sign Up / Log In** – via email or Facebook OAuth
2. **Upload Evidence** – auto-extracts metadata
3. **Verification Stage** – community voting and curation
4. **Share or Monitor** – publish verified content with trust badges on Facebook
5. **Review & Audit** – trace all actions using the audit logs

---

## Project Structure

```
/crowdproof
├── backend/              # API services
├── frontend-app/         # React Native app
├── frontend-web/         # React/Vue.js web portal
├── prisma/               # Database schema and migrations
├── docker-compose.yml    # Dev environment orchestration
├── .env.example          # Environment variables template
└── README.md             # This file
```

---

## Inspiration & Context

* **Citizen Journalism** is growing, but lacking trust frameworks. (\[Wikipedia]\[1])
* **Crowdsourced Reporting** is fast but often unverifiable. (\[EBSCO]\[2])
* CrowdProof fills the gap with **metadata, verification, and transparency.**

---

## Roadmap

* Strengthen Facebook integration and FJP partnership
* Scale infrastructure (e.g., Kubernetes, enterprise security)
* Pilot test with NGOs or civic initiatives
* Explore blockchain anchoring for immutable evidence tracking

---

## Thanks & Feedback

Your input matters! Whether it’s UI enhancements or deeper privacy controls—your feedback will shape the future of CrowdProof.

---

### References

1. Citizen Journalism – Wikipedia (definition and civic relevance) ([en.wikipedia.org](https://en.wikipedia.org/wiki/Citizen_journalism?utm_source=chatgpt.com))
2. Crowd‑sourced News – EBSCO (benefits and challenges) ([ebsco.com](https://www.ebsco.com/research-starters/social-sciences-and-humanities/crowd-sourced-news?utm_source=chatgpt.com))

<img width="1505" height="824" alt="Screenshot 2025-08-31 at 3 03 08 PM" src="https://github.com/user-attachments/assets/6b052657-6a1d-4645-91bc-ed7dd53db5f0" />
<img width="1511" height="826" alt="Screenshot 2025-08-31 at 3 03 16 PM" src="https://github.com/user-attachments/assets/aebbfcbc-bf1a-4ab9-91d1-83dd96b651b5" />
<img width="1512" height="819" alt="Screenshot 2025-08-31 at 3 39 42 PM" src="https://github.com/user-attachments/assets/482ba0e9-e5ae-43fa-b806-f787f826ad44" />
<img width="1511" height="816" alt="Screenshot 2025-08-31 at 3 39 57 PM" src="https://github.com/user-attachments/assets/506e59db-34ea-4791-8927-93ae10a56174" />
<img width="1156" height="847" alt="Screenshot 2025-08-31 at 3 40 11 PM" src="https://github.com/user-attachments/assets/2163cf4e-4841-420e-9e90-0b361828910f" />
<img width="1141" height="855" alt="Screenshot 2025-08-31 at 3 40 31 PM" src="https://github.com/user-attachments/assets/15103bcc-d8a9-4e80-ae48-997d42b46be0" />
<img width="1142" height="843" alt="Screenshot 2025-08-31 at 3 40 39 PM" src="https://github.com/user-attachments/assets/294ab2df-04d0-430f-8243-da70ad917057" />


