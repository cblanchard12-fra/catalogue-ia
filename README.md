# AI Initiatives Portfolio (Portefeuille initiatives IA)

## Description
A collaborative catalog of every AI initiative across the company — partnerships and in-house builds. It gives colleagues a fast way to find relevant AI projects when clients ask, and gives execs a live dashboard (KPIs, OKRs, CTAs) summarizing the portfolio.

Core views:
- **Dashboard** — KPI/OKR/CTA cards, read-only legend indicators, at-a-glance health of the portfolio.
- **Portfolio map** — drag-and-drop initiative cards with legend markers (emoji/icon, border, and color tags for status, France-production flag, deployment stage, etc.).
- **Catalog** — filterable/searchable list of all initiatives.
- **Initiative detail cards** — full record per initiative: description, use case, business value, target population, comments, tool users, status, ROI, responsible person, risks, and editable legend tags.

## Visuals
Open `Catalogue IA DWP.dc.html` (or the standalone build) in a browser to see the dashboard, portfolio, catalog, and detail views.

## Installation
No build step — this is a static, self-contained HTML app.
1. Open `Catalogue IA DWP - standalone.html` directly in any browser, or
2. Serve the folder from any static host / GitLab Pages.

Data is stored in the browser's `localStorage`. Each browser/device currently holds its own independent copy — nothing syncs across users yet (see Roadmap).

## Usage
- Browse the **Dashboard** for a live summary of the portfolio.
- Use the **Catalog** to search/filter initiatives by status, domain, responsible person, etc.
- Click an initiative to open its **detail card**: edit description, business value, target population, comments, tool users, status, risk level, responsible, and legend tags. Legend edits are only available here — the dashboard legend stays read-only for clarity.
- Drag cards around the **Portfolio** view to reorganize.

## Support
For bugs or requests, contact the project owner or open an issue in the internal GitLab repo (see `SPEC-Backend-Sync.md` for the technical contact points on the sync project).

## Roadmap
Current state: fully functional UI, but data is local-only (per-browser `localStorage`).

Planned steps (tracked in `SPEC-Backend-Sync.md`):
1. Deploy the standalone build to internal GitLab Pages so everyone shares one URL.
2. Build the backend API + database per the spec doc.
3. Wire the app to the API instead of `localStorage`, with polling or WebSocket sync.
4. Multi-user concurrent-edit testing.

## Contributing
This project lives as a set of Design Component HTML files (`*.dc.html`) plus a standalone static build. To modify:
- Edit the relevant `.dc.html` file for the dashboard/catalog/detail logic.
- Re-export the standalone bundle after changes so the static deployment stays in sync.
- See `SPEC-Backend-Sync.md`/`.html` before starting backend work — it defines the API contract the frontend expects.

## Authors and acknowledgment
Maintained by the AI Incubator / DWP team. Built collaboratively to inventory AI initiatives across the company.

## Project status
Active. Frontend is feature-complete; backend sync (multi-user, real-time) is the current focus — see Roadmap.
