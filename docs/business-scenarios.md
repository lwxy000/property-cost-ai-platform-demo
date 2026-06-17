# Business Scenarios

This demo is being upgraded from a module showcase into guided business-scenario flows.

## Scenario Paths

1. Material import to contract risk
   - AI import recognizes fictional quote rows.
   - Reviewer confirms candidate material prices.
   - Cost map detects benchmark pressure.
   - Contract ledger exposes payment and evidence risk.
   - Smart Q&A explains the rule basis.
   - Permission center masks sensitive fields for limited roles.

2. Monthly service payment review
   - Contract ledger filters high-risk monthly service items.
   - Detail drawer checks payment progress and service period.
   - Smart Q&A explains payment approval checks.
   - Permission matrix confirms scoped review boundaries.

3. Vendor access and Q&A boundary
   - Vendor role limits contract and material views.
   - Contract amounts are masked.
   - Smart Q&A refuses cross-region exposure and cites mock permission rules.

## Closed-loop Demo Engine

The scenario page now simulates a business run without adding a backend:

- each scenario keeps local progress for completed steps;
- mock actions and next-step navigation append operation-log entries;
- role view changes evidence masking for HQ reviewer, regional operator and external vendor;
- the evidence chain shows which module contributes each public-safe signal;
- the decision summary is generated from the current fictional run state.

This is still a static-hostable demo. The run state lives only in browser memory and is reset by page reload or by the scenario reset control.

## Safety Boundary

All scenario data is fictional. The scenario flows are recreated for public demonstration and do not copy production database records, uploads, contracts, screenshots, API responses or repository history.
