# Demo scripts

Three demos, each under 20 minutes, run from the demo customer tenant. Open with the
customer's own numbers (workloads, data, last restore test), close with the pack and the
next step (the one-week protection assessment).

## Demo 1: Backup you can prove (12 minutes)

1. Console overview (1 minute): one tenant, all workloads, protection status by colour.
   Say: "This is what your monthly report is built from."
2. Protection plan (2 minutes): show schedule, retention, encryption, immutability. Say:
   "Immutable copies are what make ransomware recoverable."
3. File restore (3 minutes): restore a deleted folder from the workstation to an alternate
   location. Show the point-in-time picker.
4. Microsoft 365 restore (3 minutes): restore a deleted mailbox item and a SharePoint
   document. Say: "Microsoft keeps the service running; this is what they do not keep."
5. Full server recovery (3 minutes, pre-recorded or started earlier): bare-metal or VM
   restore to the recovery server. Show the restore test report that results.

## Demo 2: Detection that responds (10 minutes)

1. Endpoint policy (2 minutes): EDR or XDR, patch management, URL filtering in the same
   agent that backs up.
2. Incident (4 minutes): trigger the safe simulator on the demo workstation; show the
   incident, the attack chain, isolation of the endpoint.
3. Rollback (2 minutes): roll the affected files back from backup. Say: "Detection and
   recovery in one console, with no second vendor to call."
4. MDR by Acronis TRU (2 minutes): show the MDR view and the 24/7 service description;
   explain the 15-minute critical remediation target and how Next Step communicates incidents.

## Demo 3: Recovery you have tested (8 minutes)

1. DR configuration (2 minutes): recovery server for the demo Windows server, cloud
   network, public IP, runbook.
2. Test failover (4 minutes): run the test failover, show the server booting in the Acronis
   cloud, open the application. Say: "This is a scheduled test; the report goes to your
   auditor."
3. Compute points (2 minutes): show consumption for the test and explain the cost model
   (points per hour, tests per month). Tie it to the Resilience Evidence pack.

## Closing (2 minutes)

- Restate the customer's framework and the controls shown (ECC 3-1, SAMA business
  continuity, ISO 27001 A.8.13).
- Offer the one-week protection assessment: inventory, residency decision, sizing, written
  gap report, proposal.
- Agree the date.

## Before every demo

Check that the demo tenant is healthy, that the sample data is restored to its starting
state, that the DR recovery server is powered off, and that the simulator is safe to run on
the demo workstation only.
