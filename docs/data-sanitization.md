# Data Sanitization

The demo uses only synthetic examples. Names such as Region A, Project Alpha and Supplier Beta are intentionally generic.

## Forbidden Content

Do not add:

- Real company names from production
- Real supplier names
- Real project names
- Real contract numbers
- Real employee names
- Real costs, budgets, payment status or material prices
- Real screenshots
- `.env`, certificates, private keys or API keys
- `data/`, `uploads/`, database files, dump files or backup archives
- Spreadsheets, PDFs, Word files or scanned attachments from production

## Safe Mock Patterns

Use:

- `Region A`, `Region B`, `Region C`
- `Project Alpha`, `Project Beta`
- `Supplier Alpha`, `Supplier Beta`
- `DEMO-CT-2026-001`
- rounded fictional dollar amounts
- short synthetic rule names such as `ML-01` or `CT-02`

## Review Checklist Before Publishing

1. Search the repository for domains, IP addresses and account-like strings.
2. Search for known production organization, project and supplier names.
3. Confirm `.gitignore` blocks sensitive file types.
4. Confirm no production data folders were copied.
5. Confirm screenshots are generated from the demo itself or from sanitized mockups.

