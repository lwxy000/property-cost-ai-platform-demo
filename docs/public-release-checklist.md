# Public Release Checklist

Use this checklist before publishing the demo repository or enabling GitHub Pages.

## Repository Safety

- Confirm this repository was created independently and is not a public fork of a production repository.
- Confirm no production Git history was copied into the demo.
- Confirm no production `.env`, key, certificate, database dump, upload folder or backup file exists in the repository.
- Confirm there is no remote pointing to an internal repository.

## Data Safety

- Confirm all projects, suppliers, contracts, material prices, costs, dates and Q&A cases are fictional.
- Confirm no real company domain, server IP, account, phone number, email address or internal path appears in the code or docs.
- Confirm screenshots, if added later, are generated from the demo only.
- Confirm no spreadsheet, contract attachment, scan, quote or real uploaded file is included.

## Runtime Safety

- Confirm the app runs as a static local preview.
- Confirm there is no PostgreSQL, production API, model key or file upload integration enabled.
- Confirm any AI behavior is presented as mock, local match or explicit disabled state.
- Confirm no deployment target uses a production domain.

## Suggested Checks

```bash
npm run check
```

Run a text scan for internal names, domains, IPs, credentials and file-system paths before publishing.

