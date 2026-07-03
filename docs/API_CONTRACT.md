# Dubai Property Intel — Backend API Contract

Version: `v1`  
Base URL: `/api/v1`  
Format: JSON; file endpoints use `multipart/form-data`.

The current frontend runs entirely on fake data. This contract is the handoff boundary for replacing each fake interaction with a real backend without redesigning the UI.

## Shared conventions

- Authentication: short-lived bearer access token plus rotating HTTP-only refresh token.
- Tenancy: derive `workspaceId` from authenticated membership. Never authorize using only a client-provided workspace ID.
- IDs: opaque UUID/ULID strings with readable prefixes optional (`buy_`, `prop_`, `rep_`).
- Dates: ISO 8601 UTC.
- Money: integer minor units where practical, plus ISO currency code.
- Pagination: `?limit=25&cursor=<opaque>` → `{ data, page: { nextCursor, hasMore } }`.
- Errors: `{ "error": { "code": "BUYER_NOT_FOUND", "message": "...", "fieldErrors": {}, "requestId": "..." } }`.
- Long tasks: return `202 { jobId, status: "queued" }`; poll `/jobs/:jobId` or subscribe to server events later.
- Idempotency: generation, import, export and webhook POST calls accept `Idempotency-Key`.
- AI provenance: generated records store prompt version, model, input snapshot, generation time and review state.

## Authentication

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/auth/signup` | `{ name, email, password, workspaceName, workspaceType }` | `{ user, workspace, accessToken }` |
| POST | `/auth/login` | `{ email, password }` | `{ user, workspaces, accessToken }` |
| POST | `/auth/logout` | — | `204` |
| POST | `/auth/password/forgot` | `{ email }` | `202` |
| POST | `/auth/password/reset` | `{ token, password }` | `204` |
| GET | `/auth/session` | — | `{ user, activeWorkspace, permissions }` |

## Workspaces, profiles and branding

| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/workspaces` | List/create accessible workspace |
| GET/PATCH | `/workspaces/:id` | Read/update workspace metadata |
| POST | `/workspaces/:id/upgrade` | Solo → team → agency conversion |
| GET | `/workspaces/:id/usage` | Plan counters and limits |
| GET/PATCH | `/broker-profile` | Current user’s broker profile |
| POST | `/broker-profile/photo` | Upload broker photo |
| GET/PUT | `/workspaces/:id/branding` | Logo, colours, footer, cover, disclaimer |
| POST | `/workspaces/:id/branding/assets` | Upload brand assets |

Workspace write payload:

```json
{
  "name": "Zied Properties",
  "workspaceType": "solo",
  "contact": { "email": "", "phone": "", "website": "" },
  "defaults": { "language": "en", "tone": "advisory", "reportStyle": "premium" }
}
```

## Members and permissions

| Method | Path | Purpose |
|---|---|---|
| GET | `/workspaces/:id/members` | Members, roles and invitation status |
| POST | `/workspaces/:id/invitations` | `{ email, role }` |
| POST | `/invitations/:token/accept` | Join invited workspace |
| PATCH | `/workspaces/:id/members/:memberId` | Change role/status |
| DELETE | `/workspaces/:id/members/:memberId` | Revoke membership |
| GET | `/permissions` | Effective UI permission map |

Roles: `owner`, `admin`, `manager`, `broker`, `viewer`.

## Buyers

| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/buyers` | Filtered list/create |
| GET/PATCH/DELETE | `/buyers/:id` | Detail/update/soft-delete |
| POST | `/buyers/:id/persona` | Generate persona + explanation |
| POST | `/buyers/:id/summary` | Generate editable needs summary |
| PATCH | `/buyers/:id/status` | Status and optional lost reason |
| PATCH | `/buyers/:id/assignment` | Assign broker |
| GET/POST | `/buyers/:id/notes` | Buyer notes |
| GET | `/buyers/:id/timeline` | System and manual activity |
| POST | `/buyers/:id/enrichment` | Consented V2 enrichment job |
| POST | `/buyers/:id/export` | Data subject export |
| DELETE | `/buyers/:id/personal-data` | Privacy deletion workflow |

Buyer create/update body:

```json
{
  "name": "Omar Al Mansoori",
  "contact": { "phone": "", "email": "" },
  "nationality": null,
  "purpose": "buy",
  "budget": { "min": 2000000, "max": 3200000, "currency": "AED" },
  "preferredAreas": ["Dubai Marina", "Dubai Hills"],
  "propertyTypes": ["apartment"],
  "bedrooms": 2,
  "familySize": 2,
  "schoolNeeds": null,
  "workLocation": "DIFC",
  "lifestylePreferences": ["waterfront", "walkable"],
  "investmentObjective": "rental_yield_and_appreciation",
  "timeline": "0_3_months",
  "financingStatus": "cash",
  "consent": { "lawfulBasisConfirmed": true, "noticeVersion": "2026-01" },
  "notes": ""
}
```

Persona generation accepts `{ "regenerate": true, "brokerContext": "optional" }` and returns `{ persona, explanation, confidence, recommendationWeights, reportTone, generatedAt }`. A broker override is persisted through the normal buyer `PATCH` with `{ persona, personaOverridden: true, overrideReason }`.

Needs-summary generation returns editable structured fields: `{ motivation, keyRequirements, budgetSensitivity, lifestyleNeeds, investmentIntent, likelyObjections, suggestedAreas, salesAngle }`. Saving edits uses the buyer `PATCH`; report insertion references the approved summary version ID.

Status update body: `{ "status": "lost", "lostReason": "optional unless lost" }`. Timeline items return `{ id, type, title, detail, actor, occurredAt, immutable }`; manual notes are created with `{ text, visibility }` and system events remain immutable.

Enrichment request body: `{ linkedinUrl?, company?, website?, publicBio?, crmData?, conversationNotes?, consent: { lawfulBasisConfirmed: true, source, confirmedAt } }`. The response contains only buying-relevant context plus `{ excludedSensitiveSignals, auditEventId }`.

## Properties and imports

| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/properties` | Search/create property |
| GET/PATCH/DELETE | `/properties/:id` | Detail/update/archive |
| POST | `/properties/imports` | Upload JSON/CSV/PDF and create job |
| GET | `/properties/imports/:jobId` | Progress, inserted, updated, failed |
| GET | `/properties/imports/:jobId/errors` | Row-level failures |
| POST | `/properties/:id/notes` | Private/workspace note |
| GET/POST | `/property-collections` | List/create collections |
| PATCH/DELETE | `/property-collections/:id` | Update/delete collection |
| POST/DELETE | `/property-collections/:id/items/:propertyId` | Add/remove property |
| POST | `/properties/deduplicate` | Run cross-source duplicate detection |
| PATCH | `/property-duplicates/:id` | Confirm/reject duplicate candidate |
| GET | `/properties/:id/price-history` | Price snapshots |

Property filters: `purpose`, `priceMin`, `priceMax`, `area[]`, `bedrooms[]`, `bathrooms[]`, `propertyType[]`, `completionStatus[]`, `furnishing[]`, `verified`, `source[]`, `freshnessMin`, `qualityMin`, `sort`.

Normalized property shape:

```json
{
  "source": "bayut",
  "externalId": "123",
  "title": "Marina Vista · Full Sea View",
  "purpose": "sale",
  "price": { "amount": 2750000, "currency": "AED" },
  "propertyType": "apartment",
  "bedrooms": 2,
  "bathrooms": 3,
  "areaSqm": 106.65,
  "plotAreaSqm": null,
  "location": { "city": "Dubai", "neighbourhood": "Dubai Marina", "building": "Marina Vista", "lat": 0, "lng": 0 },
  "images": [{ "url": "https://...", "sortOrder": 0 }],
  "amenities": ["pool", "gym"],
  "completionStatus": "ready",
  "paymentPlan": null,
  "verified": true,
  "sourceUpdatedAt": "2026-06-24T00:00:00Z"
}
```

## Matching

| Method | Path | Purpose |
|---|---|---|
| POST | `/matching/buyer/:buyerId` | Queue recalculation against inventory |
| GET | `/matching/buyer/:buyerId/results` | Ranked paginated matches |
| GET | `/matching/buyer/:buyerId/matrix` | Category-by-category fit matrix |
| POST | `/matching/property/:propertyId` | Property-to-buyer matches |
| PATCH | `/matching/:id/override` | Hide, pin or manually score |
| POST/DELETE | `/matching/:id/shortlist` | Add/remove recommendation from buyer shortlist |
| GET | `/properties/:propertyId/deal-score` | Deal score and factor explanations |
| PATCH | `/properties/:propertyId/deal-score/visibility` | Client-output visibility preference |

Match result includes `totalScore`, factor scores, human-readable reasons, mismatches, assumptions and scoring version. Deterministic hard filters should run before optional AI explanations.

Factor scores are versioned and include `{ key, label, score, maxScore, fitLabel, explanation, inputs, assumptions }`. Broker overrides use `{ score?, hidden?, pinned?, reason }`, retain the calculated score, and create an immutable audit event.

Deal-score response includes price-vs-neighbourhood, DLD comparable price, yield estimate, freshness, verification, DLD transaction history, completion, developer reputation and payment-plan factors. Every market-derived factor includes source date and confidence; `clientVisible` defaults to the workspace report setting.

## Reports and templates

| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/reports` | Library/create draft |
| GET/PATCH/DELETE | `/reports/:id` | Read/edit/archive |
| POST | `/reports/:id/duplicate` | Duplicate editable report and sections |
| POST | `/reports/:id/properties` | Add/reorder 1–5 properties |
| POST | `/reports/:id/generate` | Generate report sections |
| POST | `/reports/:id/review` | Approve/reject AI output |
| POST | `/reports/:id/export/pdf` | Branded PDF job |
| GET | `/reports/exports/:jobId` | PDF job status and signed download URL |
| POST | `/reports/:id/public-link` | Create tokenized expiring link |
| PATCH/DELETE | `/reports/:id/public-link` | Extend/disable link |
| GET | `/public/reports/:token` | Tokenized branded web report |
| GET | `/reports/:id/analytics` | Views and client activity |
| GET/POST | `/report-templates` | Templates |
| PATCH/DELETE | `/report-templates/:id` | Template management |
| PUT | `/workspaces/:id/default-report-template` | Set workspace default template |

Report create body: `{ buyerId, type, templateId, propertyIds, brandingMode, language, tone }`. Generated content must be stored as editable structured sections, not one HTML blob.

Report library filters: `buyerId`, `createdBy`, `status`, `area`, `propertyId`, `templateId`, `from`, `to`, `limit`, `cursor`. Managers receive workspace-visible reports according to role; brokers receive owned/assigned reports.

PDF export stores the exact report revision plus branding snapshot used at generation time. Public links store only a random token hash, expiry, disabled timestamp, view count, and workspace-branded read-only revision.

## Sales content copilot

All endpoints accept `{ buyerId, propertyIds, language, tone, length, additionalContext }` and return `{ content, alternatives, generation }`.

| Method | Path |
|---|---|
| POST | `/content/whatsapp` |
| POST | `/content/email` |
| POST | `/content/call-script` |
| POST | `/content/follow-ups` |
| POST | `/content/objection-response` |

Track copy/download events separately with `POST /events` rather than assuming content was sent.

## Saved searches and alerts

| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/saved-searches` | List/create |
| GET/PATCH/DELETE | `/saved-searches/:id` | Manage |
| POST | `/saved-searches/:id/run` | Current result set |
| GET | `/match-feed` | New matches grouped by buyer |
| POST | `/match-feed/:id/dismiss` | Dismiss irrelevant match |
| GET/PUT | `/alerts/preferences` | In-app/email preferences |

## Market intelligence

| Method | Path | Purpose |
|---|---|---|
| GET | `/market/areas` | Area benchmark list |
| GET | `/market/areas/:slug` | Area detail/trends |
| GET | `/market/comparables` | DLD comparable transactions |
| POST | `/market/yield-estimate` | Expected rent, gross yield, assumptions |
| GET | `/market/nearby` | Nearby places and travel estimates |
| GET | `/market/developers/:slug` | V2 developer profile |

Every metric returns `source`, `asOf`, `sampleSize`, and `methodologyVersion` so reports never imply unsupported certainty.

## Analytics, activity and export

| Method | Path |
|---|---|
| GET | `/analytics/overview` |
| GET | `/analytics/team` |
| GET | `/analytics/areas` |
| GET | `/analytics/conversion` |
| GET | `/activity` |
| POST | `/events` |
| POST | `/exports/csv` |
| GET | `/exports/:jobId` |

Standard analytics query: `from`, `to`, `userId`, `buyerStatus`, `area`, `timezone`.

## Plans, platform admin and prompts

| Method | Path | Purpose |
|---|---|---|
| GET | `/plans` | Public plan catalogue |
| GET | `/admin/workspaces` | Platform workspace search |
| PATCH | `/admin/workspaces/:id` | Disable/plan/limit overrides |
| GET/POST | `/admin/plans` | Plan definitions |
| GET/POST | `/admin/prompts` | Prompt library/version draft |
| PATCH | `/admin/prompts/:id` | Edit/test/activate/rollback |
| GET | `/admin/jobs` | Import/generation failures |
| GET | `/admin/system-logs` | Operational logs |

## Integrations and webhooks

| Method | Path |
|---|---|
| GET | `/integrations` |
| POST | `/integrations/:provider/connect` |
| DELETE | `/integrations/:provider` |
| GET/POST | `/integrations/webhooks` |
| POST | `/integrations/webhooks/:id/test` |
| GET | `/integrations/webhooks/:id/deliveries` |

Webhook events: `buyer.created`, `buyer.status_changed`, `property.shortlisted`, `report.generated`, `report.shared`, `report.viewed`. Sign deliveries with HMAC and include event ID, timestamp and retry count.

## Core permission rules

- Solo owner: all records in own workspace.
- Broker: assigned/created buyers, allowed shared inventory, own drafts; shared visibility configurable.
- Manager: team buyers/reports/activity, no billing or platform settings by default.
- Admin/owner: members, templates, branding, exports and policies.
- Viewer: read-only permitted records.
- Platform admins use a separate audited control plane; they do not silently impersonate workspace members.

## Backend implementation order

1. Auth, workspace tenancy and row-level authorization.
2. Buyers and property import/normalization.
3. Deterministic matching with stored explanations.
4. Report drafts, AI generation jobs and PDF exports.
5. Saved searches, activity and dashboards.
6. Team roles, billing limits, DLD/nearby integrations and public links.
