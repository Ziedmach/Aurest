# [Client] — Cyber Protection Services Proposal

Prepared by Next Step Middle East · Powered by Acronis Cyber Protect Cloud

| | |
|---|---|
| Client | [Client legal name] |
| Submitted by | Next Step Middle East |
| Reference | NS-ACR-[YYYY]-[nnn] |
| Date | [DD Month YYYY] |
| Version | 1.0 |
| Currency | [SAR / TND / EUR / USD] (USD reference rate [x.xx], fixed for the validity period) |
| Tax | VAT [15 percent KSA / 19 percent Tunisia / as applicable], shown separately |
| Validity | 90 days from the date above |
| Classification | Confidential – Commercial |

Guidance lines start with "Guidance:" and are deleted before sending. Replace every
[bracket]. Use approved Next Step figures only (2,000+ projects, 900+ clients, 150+ certified
resources, 6 offices, ISO 9001, ISO 27001, NCA ECC aligned). Keep sentence case, no emoji.

---

## Document control and confidentiality

This proposal is confidential and prepared exclusively for [Client] to evaluate cyber
protection services delivered by Next Step Middle East on the Acronis Cyber Protect Cloud
platform. It may not be reproduced or disclosed to third parties without written
authorisation, except where procurement rules or law require.

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | [date] | [name] | First issue |

## 1. Executive summary

Guidance: four short blocks. Outcome first, then our answer, then what the client gets,
then why Next Step. Half a page maximum.

**The outcome.** [Client] will have every server, endpoint and Microsoft 365 account
protected by one platform, with [RPO] recovery point and [RTO] recovery time objectives,
data held in [data center and country], and evidence ready for [NCA ECC / SAMA / PDPL /
auditor] on demand.

**Our answer.** Next Step operates [Ultimate Protection / Backup + DR / the listed services]
for [n] servers, [n] virtual machines, [n] workstations and [n] Microsoft 365 seats as a
managed service, from onboarding to monthly reporting and restore testing.

**What you get.** Backup with immutability and ransomware rollback, [EDR / XDR] security
with [MDR by Acronis TRU], disaster recovery for [n] critical servers with [n] tests a year,
Microsoft 365 backup with unlimited retention storage, a named service manager and a
monthly protection report.

**Why Next Step.** An ISO 27001-certified, NCA ECC-aligned regional provider with offices in
[Riyadh / Tunis / Kigali], 24/7 operations, 900+ active clients, and an Acronis service
provider tenant under our direct control, so your data location, quotas and support path are
ours to guarantee.

## 2. Understanding of your requirements

Guidance: restate what discovery found. Tables over prose.

### 2.1 Environment in scope

| Workload | Quantity | Notes |
|---|---|---|
| Physical servers | [n] | [OS, roles] |
| Virtual machines | [n] | [hypervisor] |
| Workstations and laptops | [n] | [OS split] |
| Microsoft 365 seats | [n] | Exchange, OneDrive, SharePoint, Teams |
| Other (NAS, mobile, Google Workspace, Entra ID) | [n] | |
| Protected data (front-end) | [n] TB | Growth [n] percent a year |

### 2.2 Objectives and constraints

- Recovery objectives: RPO [n], RTO [n] for [class]; RPO [n], RTO [n] for the rest.
- Retention: [daily n, weekly n, monthly n, yearly n]; legal hold [yes/no].
- Data residency: [in-Kingdom / in-country / in-region]; chosen location: [Abu Dhabi, UAE
  (Acronis) / Johannesburg / Next Step cloud, Tunis / other].
- Compliance drivers: [NCA ECC-2:2024 domain 3 Resilience, controls 3-1; SAMA CSF 3.3.x;
  PDPL; ISO 27001 A.8.13; sector regulator].
- Constraints: [change windows, bandwidth, legacy systems, existing contracts and dates].

### 2.3 Our reading

Guidance: two or three sentences on the real problem (for example fragmented tools, no
tested restores, ransomware exposure, audit findings) and what success looks like.

## 3. Proposed solution

### 3.1 Service overview

| Service | Scope | Platform component |
|---|---|---|
| Backup and recovery | [servers, VMs, workstations] | Acronis Cyber Protect Cloud, [Backup + DR / Ultimate Protection / Backup per workload] |
| Microsoft 365 protection | [n] seats | Microsoft 365 backup with unlimited Acronis-hosted storage [G2] |
| Endpoint security | [n] workloads | [Security + RMM bundle / EDR / XDR] |
| Managed detection and response | [n] workloads | MDR by Acronis TRU, [Standard / Advanced], 24/7 |
| Disaster recovery | [n] servers | Acronis Disaster Recovery, [n] tests a year, [n] public IPs |
| Email security | [n] users | Acronis Email Security |
| Security awareness training | [n] users | Acronis Security Awareness Training |
| Managed service | all | Next Step 24/7 operations, service desk, monthly report |

Guidance: delete rows not sold. Keep Acronis product names exact.

### 3.2 Architecture and data location

Guidance: one diagram (agents and hypervisor connectors → Next Step tenant → Acronis data
center [city] or Next Step storage; management console; SOC integration). State encryption
(AES-256 in transit and at rest, customer-held key option), immutability, and the geo-
redundancy option if sold.

### 3.3 Service levels

| Item | Commitment |
|---|---|
| Service hours | 24/7 monitoring; service desk [hours]; on-site [as agreed] |
| Incident response | P1 acknowledged in [15] minutes, restore started in [1] hour |
| Restore testing | [Quarterly] file, mailbox and full-server restore tests with signed report |
| DR testing | [Annual / semi-annual] failover test with runbook update |
| Reporting | Monthly protection and security report; quarterly service review |
| Platform availability | Per the Acronis service level agreement (reference in annex) |

### 3.4 Compliance alignment

| Framework | Requirement | How this service answers it | Evidence provided |
|---|---|---|---|
| NCA ECC-2:2024 | 3-1 Backup and recovery management | Scheduled, encrypted, immutable backups with tested restores | Backup policy export, restore test reports |
| NCA ECC-2:2024 | 2-x Endpoint and malware protection | [EDR / XDR] with [MDR] | Monthly security report, incident records |
| SAMA CSF | 3.3.x Business continuity | DR for [n] servers with tested RTO | DR test report |
| PDPL | Security of personal data, breach readiness | Encryption, access control, residency in [location] | Architecture statement, DPA |
| ISO 27001:2022 | A.8.13 Information backup | As above | Same |

Guidance: adapt rows to the client's regulator. Use only controls you can evidence.

## 4. Delivery approach

Four phases, each with an acceptance gate.

| Phase | Activities | Duration | Gate |
|---|---|---|---|
| 01 Discovery and baseline | Inventory confirmation, network and firewall checks, protection policy design | [1] week | Design sign-off |
| 02 Build | Tenant, storage location, quotas, branding; agent and connector deployment; Microsoft 365 authorisation | [2] weeks | All workloads reporting |
| 03 Protect and validate | Initial backups, security policies, DR runbook, first restore and failover tests | [2] weeks | Restore test report signed |
| 04 Operate | 24/7 operations, reporting, quarterly reviews, annual DR test | Contract term | Monthly report accepted |

Governance: named service manager; monthly service report; quarterly review with the client
sponsor; escalation path to Next Step operations lead and Acronis partner support.

## 5. Commercial offer

Guidance: recurring fee in local currency, VAT separate, one-time services separate. Pull
quantities from the sizing sheet. Mark the margin policy applied in the internal
`30-pricing.md`, never here.

### 5.1 Monthly recurring services

| Line | Quantity | Unit price per month | Monthly total |
|---|---|---|---|
| [Ultimate Protection, server] | [n] | [x] | [x] |
| [Ultimate Protection, workstation] | [n] | [x] | [x] |
| [Microsoft 365 protection, seat] | [n] | [x] | [x] |
| [MDR by Acronis TRU, Standard] | [n] | [x] | [x] |
| [Security Awareness Training, user] | [n] | [x] | [x] |
| [Additional storage beyond included quota, per GB] | [n] | [x] | [x] |
| Managed service (operations, reporting, restore tests) | 1 | [x] | [x] |
| **Subtotal excluding VAT** | | | **[x]** |
| VAT [15 percent] | | | [x] |
| **Total per month including VAT** | | | **[x]** |

Annual equivalent excluding VAT: [x]. Amount in words: [ ].

### 5.2 One-time services

| Line | Description | Price |
|---|---|---|
| Onboarding and migration | Phases 01 to 03 | [x] |
| DR runbook and first failover test | | [x] |
| Training | [n] sessions | [x] |
| **Subtotal excluding VAT** | | **[x]** |

### 5.3 Pricing basis and inclusions

- Prices are per unit per month, billed [monthly / quarterly / annually] in advance.
- Included: platform licences, Acronis-hosted storage up to the stated quotas, 24/7
  monitoring, service desk, monthly reporting, [n] restore tests a year.
- Quantities are reconciled [quarterly]; additional units are billed at the unit prices above.
- Storage beyond included quotas is billed per GB per month as stated.

### 5.4 Assumptions

- Customer provides administrator access, network paths (TCP 443 outbound) and change windows.
- Minimum term [12 / 36] months; prices fixed for the term at the USD reference rate stated.
- Microsoft 365 licences, hypervisor licences and customer hardware are outside scope.

### 5.5 Exclusions

- Recovery of data not under a protection plan at the time of loss.
- Forensic investigation beyond the MDR scope; on-site work beyond [n] days.
- Third-party software remediation.

### 5.6 Taxes, currency and validity

Prices in [currency]; VAT at [rate] shown separately; valid 90 days from the proposal date.

### 5.7 Invoicing and payment

Recurring services invoiced [monthly] in advance, net 30 days. One-time services invoiced
[40 percent on order, 30 percent at phase 02 gate, 30 percent at phase 03 gate].

### 5.8 Change control

Changes to scope, quantities beyond the reconciliation tolerance, or service levels are
agreed in writing through a change request before implementation.

## 6. About Next Step Middle East

Next Step is an EMEA cybersecurity, cloud infrastructure and managed-services group,
ISO 9001 and ISO 27001 certified and NCA ECC aligned, with offices in Riyadh, Tunis, Nice,
Kigali, Tripoli and Nouakchott. We have delivered 2,000+ projects for 900+ active clients
in government, finance, telecom, health and energy, with 150+ certified resources. We are an
Acronis service provider partner and hold Microsoft specialisations across Cloud, Security
and Modern Work, Red Hat Premier and Cisco Premier status, and MSSP capabilities with
Fortinet and Secureworks.

### About Acronis

Guidance: two sentences from `00-context/acronis-profile.md` (founded, HQ, scale, data
centers, Acronis TRU). Add the Acronis authorisation letter in the annex for tenders.

## 7. Acceptance

| Next Step Middle East | [Client] |
|---|---|
| Name, title | Name, title |
| Signature, stamp, date | Signature, stamp, date |

## Annexes

- A. Bill of materials with Acronis SKU references
- B. Acronis service description and service level agreement
- C. Data processing and residency statement
- D. Next Step certificates (ISO 9001, ISO 27001), Acronis partner authorisation
- E. Reference projects (with consent)
- F. For tenders: CR, Zakat, GOSI, Nitaqat certificates; key staff CVs; signed RFP forms

Footer on every page: Confidential | [Client] — Cyber Protection Services | Next Step Middle East
