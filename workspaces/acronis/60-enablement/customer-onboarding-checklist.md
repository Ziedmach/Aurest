# Customer onboarding checklist (Acronis Cyber Protect Cloud)

Use for every new customer tenant under the Next Step partner tenant. Owner: delivery lead.
Target: first protected workload within 5 working days of signature, full coverage within 30.

## 0. Before signature
- [ ] Sizing agreed (`40-proposals/<customer>/10-sizing.md`), data center and residency confirmed in writing.
- [ ] Licensing model chosen (solution-based bundle or service-based) and quotas defined.
- [ ] Order form signed, billing currency and cycle agreed, VAT treatment confirmed.
- [ ] Customer technical contact and change-window named.

## 1. Tenant setup (day 1)
- [ ] Create the customer tenant in the Acronis management console under the right Next Step
      partner or sub-partner tenant (for MSP channel deals, under the MSP's partner tenant).
- [ ] Set tenant mode (production or trial), storage location (Abu Dhabi, Johannesburg, G1 DC,
      or Next Step hosted storage) and the licensing model. These are hard to change later.
- [ ] Enable only the services sold; set quotas and overage policy (hard quota for fixed-price
      deals, soft quota with alerting for consumption deals).
- [ ] Apply branding (Next Step white-label: logo, support contact, custom URL if configured).
- [ ] Create customer administrator accounts with two-factor authentication enforced;
      document the admin roles granted to Next Step staff.

## 2. Deployment (days 2 to 10)
- [ ] Agents: deploy by group policy, RMM script or installer; verify agent-to-cloud connectivity
      through customer firewalls and proxies (TCP 443 to the Acronis data center and
      download URLs).
- [ ] Hypervisors: register vCenter, Hyper-V, Nutanix or Proxmox hosts for agentless backup.
- [ ] Microsoft 365: authorise the Acronis application in the tenant with a global admin;
      enable mailbox, OneDrive, SharePoint, Teams protection; set auto-protect for new users.
- [ ] Google Workspace or Entra ID: same, where sold.
- [ ] Protection plans: one plan per workload class (servers, VMs, workstations, M365) with
      agreed schedule, retention and encryption; enable immutability where supported.
- [ ] Security: enable EDR or XDR policy, URL filtering, patch management as sold; baseline
      exclusions documented and approved by the customer.
- [ ] Disaster recovery (if sold): define recovery servers, runbook, networks, public IPs;
      run one test failover and record compute-point consumption.
- [ ] Seed initial backup; for large datasets use a seeding window or physical data shipping
      (USD 99 per disk, lead time to confirm with Acronis).

## 3. Handover (days 10 to 30)
- [ ] First full backup of every workload completed; test restore of a file, a mailbox item and
      one full server or VM, signed off by the customer.
- [ ] Alerting routed to the Next Step service desk (email, webhook or PSA integration).
- [ ] Monthly report configured (protection status, storage, security incidents).
- [ ] Customer training session delivered (self-service restore, portal, how to raise tickets).
- [ ] Runbook stored in the shared drive; proposal folder updated with the as-built sizing.
- [ ] Billing reconciled: tenant usage versus contract quantities, overage policy confirmed.

## 4. Steady state
- [ ] Quarterly review: usage versus contract, storage growth, security posture, upsell
      candidates (MDR, awareness training, DR, email security).
- [ ] Annual DR test where DR is sold.
- [ ] Renewal planning 90 days before term end.
