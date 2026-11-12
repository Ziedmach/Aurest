# Acronis product catalogue (service-provider platform, 2026)

What Next Step can sell under its Acronis Cyber Protect Cloud tenant, in the vocabulary the
C26.09 price list uses. SKU families and prices are in `../30-pricing/`.

## Platform

**Acronis Cyber Protect Cloud.** One agent, one console, multi-tenant (partner → sub-partner
→ customer tenants), white-label branding, APIs and integrations (Microsoft Intune, Entra ID
single sign-on, PSA and RMM integrations, Azure Marketplace). Two licensing modes per customer
tenant: solution-based (bundles) or service-based (à la carte). They cannot be mixed inside
one customer tenant; they can coexist across tenants.

## Solution-based bundles

| Bundle | Contains | Included Acronis-hosted storage | Sell when |
|---|---|---|---|
| **Security + RMM** | EDR-class endpoint protection, patch management, URL filtering, remote monitoring and management; Microsoft 365 and Google Workspace security seats | None (no backup) | Managed IT customers who want security and RMM without backup, or who already have backup |
| **Backup + DR** | Backup for servers, VMs, workstations, M365, Google Workspace, mobile; disaster recovery | 3 TB per server, 2 TB per VM, 300 GB per workstation, unlimited per M365 and Google seat, 50 GB per mobile | Resilience-first deals (NCA ECC domain 3), storage-heavy servers |
| **Ultimate Protection** | Everything in both bundles | Same as Backup + DR | "Protect everything" SMB and mid-market deals, simplest to quote |

Add-ons for bundles: MDR by Acronis TRU (Standard or Advanced; partner-level or customer-level
reporting), third-party MDR, Security Awareness Training, additional hosted storage per GB,
geo-redundant storage, disaster-recovery compute points and public IPs.

## Service-based services

| Family | Services |
|---|---|
| Backup | Per workload (physical server, NAS, VM, workstation, hosting server, mobile) or per GB; Microsoft 365 seats (with unlimited Acronis storage, or on partner, Azure or Google storage); Entra ID seats; Google Workspace seats; Microsoft 365 Backup Storage powered by Microsoft (per GB, 10-minute backups, no API throttling); Direct Backup to Public Cloud; geo-redundant storage; storage on Acronis (G1/G2), Azure, Google, partner or customer infrastructure |
| Disaster recovery | Acronis-hosted DR storage, partner-hosted DR storage, compute points per running hour, public IPs, DR and Direct Backup to Azure |
| Endpoint security | EDR, XDR, MDR by Acronis TRU (Standard, Advanced; partner-level, customer-level), third-party MDR, GenAI Protection, Data Loss Prevention; EDR Augmentation for Microsoft Defender AV |
| SaaS security | Email Security (powered by Perception Point), Collaboration Security for Microsoft 365, Security Posture Management for Microsoft 365 |
| Awareness | Security Awareness Training per user |
| Operations | RMM per endpoint, PSA per user (3 minimum), Cyber Compliance (September 2026, CIS v8.1 continuous compliance; not yet in the C26.09 list **[verify SKU]**) |
| Archiving | Email Archiving for Microsoft 365 (per seat with unlimited Acronis storage, or per GB); Archival Storage (January 2026, S3-compatible immutable, no egress fees; **[verify SKU]**) |
| Files | Acronis Cyber Files Cloud (Files Sync & Share), per user or per GB |
| Infrastructure | Cyber Frame Local (per physical CPU core) and Cyber Frame Cloud (vCPU, RAM, block storage, public IPs, Windows licences); Acronis Cyber Infrastructure SPLA per GB (S3, iSCSI, NFS, compute) |
| AI workspace | Cyber Workspace: Cyber Employee agents and usage units (in the C26.09 list; availability by region **[verify]**) |
| Services | Physical data shipping, 99 USD per disk |

## Packaged offers Acronis markets

- **Acronis Ultimate 365** (February 2025): backup, XDR, email security, collaboration
  security, email archiving, posture management and awareness training for Microsoft 365
  tenants. The natural companion to Next Step's Microsoft CSP business.
- **Autonomous IT** (July 2026, roadmap and early access): Cyber Console, Cyber
  Intelligence, Service Desk, Cyber Studio, Cyber Employee agents.

## Proof points to quote

- MITRE ATT&CK Enterprise Evaluations 2025 participant; 100 percent step coverage on the
  Mustang Panda scenario (Acronis blog).
- AV-TEST Advanced Threat Protection 35 of 35 (mid-2025).
- MDR by Acronis TRU: 15-minute critical remediation target, patching and rollback built in.
- Leader, IDC MarketScape Worldwide Cyber Recovery 2025; Champion, Canalys Managed BDR 2025.
- Abu Dhabi data center ISO 27001 and IEC 22237 certified.

## Known weaknesses to prepare for (from public reviews)

Console complexity and occasional bugs; support responsiveness; agent load on large SQL or
multi-core servers; restore times of 30 to 60 minutes for full systems versus under 15
minutes on appliance-based BCDR; Acronis-hosted storage priced above hyperscaler object
storage per TB. Next Step's answer is the managed-service wrap (we run the console, we test
restores, we own support escalation) and storage-placement flexibility (Next Step hosted
storage where cost or residency demands it).

## End of life

Acronis Cyber Files and Files Connect (the legacy on-premises products) reached end of life
on 31 December 2025, extended support to 31 December 2026. Do not sell them; Acronis Cyber
Files Cloud is the current file service.
