import {
  modules,
  portfolio,
  portalStats,
  commandCenter,
  moduleHealth,
  operationsFeed,
  costKpis,
  costTrend,
  costRows,
  materials,
  materialCandidates,
  costMapRegions,
  costMapItems,
  costMapMatrix,
  costMapActions,
  contractKpis,
  contracts,
  qaCases,
  qaAudit,
  roles,
  safetyRules,
} from "./data.js";

const app = document.querySelector("#app");

const state = {
  active: "portal",
  region: "All Regions",
  project: "All Projects",
  materialQuery: "",
  contractRisk: "All",
  qaMode: "Local match",
};

function cls(...parts) {
  return parts.filter(Boolean).join(" ");
}

function toneClass(tone) {
  return tone ? `tone-${tone.toLowerCase()}` : "";
}

function activeModule() {
  return modules.find((module) => module.id === state.active) || modules[0];
}

function setActive(id) {
  state.active = id;
  window.location.hash = id;
  render();
}

function optionList(options, current) {
  return options
    .map((option) => `<option ${option === current ? "selected" : ""}>${option}</option>`)
    .join("");
}

function renderShell(content) {
  const module = activeModule();

  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">PC</div>
          <div>
            <strong>Property Cost AI</strong>
            <span>Open Demo</span>
          </div>
        </div>
        <nav class="nav-list" aria-label="Demo modules">
          ${modules
            .map(
              (item) => `
                <button class="${cls("nav-item", item.id === state.active && "is-active")}" data-nav="${item.id}">
                  <span class="nav-icon">${item.short}</span>
                  <span>${item.label}</span>
                </button>
              `,
            )
            .join("")}
        </nav>
        <div class="safety-box">
          <strong>Demo Boundary</strong>
          <span>Static mock only</span>
          <span>No database</span>
          <span>No secrets</span>
        </div>
      </aside>
      <main class="workspace">
        <header class="topbar">
          <div>
            <p class="eyebrow">${module.summary}</p>
            <h1>${module.label}</h1>
          </div>
          <div class="topbar-actions">
            <label>
              <span>Region</span>
              <select id="regionSelect">${optionList(portfolio.regions, state.region)}</select>
            </label>
            <label>
              <span>Project</span>
              <select id="projectSelect">${optionList(portfolio.projects, state.project)}</select>
            </label>
            <span class="mock-pill">Mock Data</span>
          </div>
        </header>
        <section class="content">${content}</section>
      </main>
    </div>
  `;

  bindShell();
}

function bindShell() {
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.addEventListener("click", () => setActive(button.dataset.nav));
  });

  const regionSelect = document.querySelector("#regionSelect");
  const projectSelect = document.querySelector("#projectSelect");

  regionSelect.addEventListener("change", (event) => {
    state.region = event.target.value;
    render();
  });

  projectSelect.addEventListener("change", (event) => {
    state.project = event.target.value;
    render();
  });
}

function kpiCards(items) {
  return `
    <div class="kpi-grid">
      ${items
        .map(
          (item) => `
            <article class="${cls("kpi-card", toneClass(item.tone))}">
              <span>${item.label}</span>
              <strong>${item.value}</strong>
              <small>${item.delta}</small>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function progressBar(value, tone = "neutral") {
  return `<span class="progress"><i class="${tone}" style="width:${value}%"></i></span>`;
}

function heatTone(score) {
  if (score >= 90) return "critical";
  if (score >= 80) return "high";
  if (score >= 65) return "watch";
  return "good";
}

function renderPortal() {
  return `
    ${kpiCards(portalStats)}
    <section class="command-grid" aria-label="Portfolio command center">
      ${commandCenter
        .map(
          (item) => `
            <article class="${cls("command-card", toneClass(item.tone))}">
              <span>${item.label}</span>
              <strong>${item.value}</strong>
              <small>${item.meta}</small>
            </article>
          `,
        )
        .join("")}
    </section>
    <div class="portal-grid">
      <section class="panel panel-large">
        <div class="panel-head">
          <div>
            <h2>Operations Portal</h2>
            <p>${portfolio.asOf}</p>
          </div>
          <span class="status-chip">Local Preview</span>
        </div>
        <div class="module-grid">
          ${modules
            .filter((item) => item.id !== "portal")
            .map(
              (item) => `
                <button class="module-card" data-nav="${item.id}">
                  <span class="module-icon">${item.short}</span>
                  <strong>${item.label}</strong>
                  <small>${item.summary}</small>
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Module Health</h2>
            <p>Portfolio-scale public demo snapshot</p>
          </div>
        </div>
        ${renderTable(
          ["Module", "Coverage", "Signal", "Health"],
          moduleHealth.map((item) => [
            item.module,
            item.coverage,
            item.signal,
            `<span class="${cls("badge", item.health === "Good" ? "tone-good" : "tone-warning")}">${item.health}</span>`,
          ]),
        )}
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Sanitization Rules</h2>
            <p>Public-safe demo guardrails</p>
          </div>
        </div>
        <ul class="rule-list">
          ${safetyRules.map((rule) => `<li>${rule}</li>`).join("")}
        </ul>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Operations Feed</h2>
            <p>Fictional control-center activity</p>
          </div>
        </div>
        <div class="feed-list">
          ${operationsFeed
            .map(
              (item) => `
                <article>
                  <time>${item.time}</time>
                  <strong>${item.event}</strong>
                  <span>${item.owner}</span>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="panel panel-image">
        <div class="panel-head">
          <div>
            <h2>Design Direction</h2>
            <p>IMAGE-2 visual advisor output</p>
          </div>
        </div>
        <img src="./public/assets/design-direction.png" alt="Static mockup design direction with fictional data" />
      </section>
    </div>
  `;
}

function renderCost() {
  const max = Math.max(...costTrend.flatMap((row) => [row.budget, row.actual, row.paid]));

  return `
    ${kpiCards(costKpis)}
    <div class="two-column">
      <section class="panel panel-large">
        <div class="panel-head">
          <div>
            <h2>Monthly Cost Execution</h2>
            <p>Budget, actual and paid values are fictional</p>
          </div>
        </div>
        <div class="chart-scroll">
          <div class="bar-chart">
            ${costTrend
              .map(
                (row) => `
                  <div class="bar-group">
                    <div class="bar-stack">
                      <i class="budget" style="height:${(row.budget / max) * 100}%"></i>
                      <i class="actual" style="height:${(row.actual / max) * 100}%"></i>
                      <i class="paid" style="height:${(row.paid / max) * 100}%"></i>
                    </div>
                    <span>${row.month}</span>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="legend">
          <span><i class="budget"></i>Budget</span>
          <span><i class="actual"></i>Actual</span>
          <span><i class="paid"></i>Paid</span>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Action Queue</h2>
            <p>Variance review workflow</p>
          </div>
        </div>
        <div class="action-list">
          <button>Review high variance subjects</button>
          <button>Compare monthly service cost map</button>
          <button>Export synthetic executive snapshot</button>
        </div>
      </section>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Cost Subjects</h2>
          <p>Scoped by ${state.region} / ${state.project}</p>
        </div>
      </div>
      ${renderTable(
        ["Area", "Project", "Subject", "Budget", "Actual", "Variance", "Owner"],
        costRows.map((row) => [
          row.area,
          row.project,
          row.subject,
          row.budget,
          row.actual,
          `<span class="${cls("badge", toneClass(row.tone))}">${row.variance}</span>`,
          row.owner,
        ]),
      )}
    </section>
  `;
}

function renderMaterials() {
  const rows = materials.filter((item) => {
    const query = state.materialQuery.trim().toLowerCase();
    return !query || `${item.name} ${item.category} ${item.supplier}`.toLowerCase().includes(query);
  });

  return `
    <div class="two-column">
      <section class="panel panel-large">
        <div class="panel-head">
          <div>
            <h2>Material Price Library</h2>
            <p>Reviewer-confirmed synthetic prices</p>
          </div>
          <input id="materialSearch" class="search-input" value="${state.materialQuery}" placeholder="Search material or supplier" />
        </div>
        ${renderTable(
          ["Material", "Category", "Unit", "City", "Supplier", "Current", "Tax", "Change", "Status"],
          rows.map((item) => [
            item.name,
            item.category,
            item.unit,
            item.city,
            item.supplier,
            item.current,
            item.tax,
            item.change,
            `<span class="${cls("badge", item.status === "Confirmed" ? "tone-good" : "tone-warning")}">${item.status}</span>`,
          ]),
        )}
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>AI Import Mock</h2>
            <p>Candidate generation, edit and confirm</p>
          </div>
        </div>
        <ol class="step-list">
          <li><strong>Upload</strong><span>Mock Excel file selected</span></li>
          <li><strong>Recognize</strong><span>Static demo simulates extracted rows</span></li>
          <li><strong>Review</strong><span>Human reviewer edits candidates</span></li>
          <li><strong>Confirm</strong><span>Only confirmed rows enter library</span></li>
        </ol>
      </section>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Recognition Candidates</h2>
          <p>No external model is called in this static demo</p>
        </div>
      </div>
      ${renderTable(
        ["Source File", "Extracted Item", "Confidence", "Reviewer Action"],
        materialCandidates.map((item) => [item.source, item.extracted, item.confidence, item.action]),
      )}
    </section>
  `;
}

function renderCostMap() {
  const heatHeaders = ["Security", "Cleaning", "Landscape", "Elevator", "Repair"];

  return `
    <section class="panel cost-command-panel">
      <div class="panel-head">
        <div>
          <h2>Regional Cost Command Center</h2>
          <p>12-region synthetic benchmark model with prioritized action value</p>
        </div>
        <span class="status-chip">$4.30M demo savings pool</span>
      </div>
      <div class="action-impact-grid">
        ${costMapActions
          .slice(0, 4)
          .map(
            (item) => `
              <article>
                <span>${item.action}</span>
                <strong>${item.impact}</strong>
                <small>${item.scope} · ${item.owner}</small>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
    <section class="panel panel-large">
      <div class="panel-head">
        <div>
          <h2>Cost Pressure Heat Matrix</h2>
          <p>Fictional score by region and major operating category</p>
        </div>
      </div>
      <div class="heatmap" role="table" aria-label="Cost pressure heat matrix">
        <div class="heat-row heat-head" role="row">
          <span role="columnheader">Region</span>
          ${heatHeaders.map((header) => `<span role="columnheader">${header}</span>`).join("")}
        </div>
        ${costMapMatrix
          .map(
            (row) => `
              <div class="heat-row" role="row">
                <strong role="rowheader">${row.region}</strong>
                <span class="heat-cell heat-${heatTone(row.security)}">${row.security}</span>
                <span class="heat-cell heat-${heatTone(row.cleaning)}">${row.cleaning}</span>
                <span class="heat-cell heat-${heatTone(row.landscape)}">${row.landscape}</span>
                <span class="heat-cell heat-${heatTone(row.elevator)}">${row.elevator}</span>
                <span class="heat-cell heat-${heatTone(row.repair)}">${row.repair}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
    <div class="region-grid">
      ${costMapRegions
        .map(
          (item) => `
            <article class="panel region-card">
              <div class="panel-head">
                <div>
                  <h2>${item.region}</h2>
                  <p>Benchmark ${item.benchmark}</p>
                </div>
                <span class="${cls("badge", item.grade === "A" ? "tone-good" : item.grade === "B" ? "tone-warning" : "tone-danger")}">Grade ${item.grade}</span>
              </div>
              <div class="metric-line">
                <span>Variance</span>
                <strong>${item.variance}</strong>
              </div>
              <div class="driver-list">
                ${item.drivers.map((driver) => `<span>${driver}</span>`).join("")}
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Standard Item Benchmarks</h2>
          <p>Current effective price only, no historical source files</p>
        </div>
      </div>
      ${renderTable(
        ["Cost Item", "Demo Standard", "Current Price", "State", "Progress"],
        costMapItems.map((item, index) => [
          item.item,
          item.standard,
          item.current,
          `<span class="${cls("badge", item.state === "Normal" ? "tone-good" : "tone-warning")}">${item.state}</span>`,
          progressBar(72 - index * 8, item.state === "Normal" ? "good" : "warning"),
        ]),
      )}
    </section>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Prioritized Action Pool</h2>
          <p>Demo recommendations for procurement, contract and engineering follow-up</p>
        </div>
      </div>
      ${renderTable(
        ["Action", "Estimated Impact", "Scope", "Owner"],
        costMapActions.map((item) => [item.action, item.impact, item.scope, item.owner]),
      )}
    </section>
  `;
}

function renderContracts() {
  const rows = contracts.filter((item) => state.contractRisk === "All" || item.risk === state.contractRisk);

  return `
    ${kpiCards(contractKpis)}
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Payment Progress Exposure</h2>
          <p>Monthly services and cumulative contracts use mock tracking logic</p>
        </div>
        <div class="segmented" role="group" aria-label="Risk filter">
          ${["All", "High", "Medium", "Low"]
            .map((risk) => `<button class="${state.contractRisk === risk ? "is-active" : ""}" data-risk="${risk}">${risk}</button>`)
            .join("")}
        </div>
      </div>
      ${renderTable(
        ["Contract", "Project", "Vendor", "Category", "Amount", "Paid", "Risk", "Reason"],
        rows.map((item) => [
          item.no,
          item.project,
          item.vendor,
          item.category,
          item.amount,
          item.paid,
          `<span class="${cls("badge", item.risk === "High" ? "tone-danger" : item.risk === "Medium" ? "tone-warning" : "tone-good")}">${item.risk}</span>`,
          item.reason,
        ]),
      )}
    </section>
    <div class="two-column">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Risk Logic</h2>
            <p>First-stage public demo rules</p>
          </div>
        </div>
        <ul class="rule-list">
          <li>Monthly service contracts track paid-through month.</li>
          <li>Other contracts track cumulative payment ratio.</li>
          <li>Risk labels are generated from fake amounts and dates.</li>
        </ul>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Audit Boundary</h2>
            <p>What this demo does not include</p>
          </div>
        </div>
        <ul class="rule-list">
          <li>No real contract files.</li>
          <li>No real payment ledger.</li>
          <li>No production attachment workflow.</li>
        </ul>
      </section>
    </div>
  `;
}

function renderSmartQA() {
  const currentCase = qaCases[state.qaMode === "Vision extract" ? 1 : state.qaMode === "Deep answer" ? 2 : 0];

  return `
    <div class="qa-layout">
      <section class="panel panel-large">
        <div class="panel-head">
          <div>
            <h2>Smart Q&A Workbench</h2>
            <p>Local match first; vision and deep answer are explicit actions</p>
          </div>
          <div class="segmented">
            ${["Local match", "Vision extract", "Deep answer"]
              .map((mode) => `<button class="${state.qaMode === mode ? "is-active" : ""}" data-qa-mode="${mode}">${mode}</button>`)
              .join("")}
          </div>
        </div>
        <div class="chat-panel">
          <div class="chat user">Can this demo approve an AI-extracted material price automatically?</div>
          <div class="chat system">
            <strong>${currentCase.answer}</strong>
            <span>${currentCase.evidence}</span>
          </div>
        </div>
        <div class="input-row">
          <input value="${currentCase.question}" aria-label="Mock question" />
          <button data-qa-mode="Local match">Get Answer</button>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Knowledge Cases</h2>
            <p>Fictional examples only</p>
          </div>
        </div>
        <div class="case-list">
          ${qaCases
            .map(
              (item) => `
                <article>
                  <span>${item.flow}</span>
                  <strong>${item.question}</strong>
                  <small>${item.evidence}</small>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>AI Audit Trail</h2>
          <p>Shows cost-control behavior without real model calls</p>
        </div>
      </div>
      ${renderTable(
        ["Action", "State", "Note"],
        qaAudit.map((item) => [
          item.type,
          `<span class="badge tone-neutral">${item.state}</span>`,
          item.note,
        ]),
      )}
    </section>
  `;
}

function renderAccounts() {
  return `
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Role Matrix</h2>
          <p>Back-end permission checks are represented as demo rules</p>
        </div>
      </div>
      ${renderTable(
        ["Role", "Cost", "Materials", "Contracts", "Smart Q&A", "Accounts"],
        roles.map((item) => [item.role, item.cost, item.materials, item.contracts, item.qa, item.account]),
      )}
    </section>
    <div class="two-column">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Approval Flow</h2>
            <p>Mock account governance</p>
          </div>
        </div>
        <ol class="step-list">
          <li><strong>Request</strong><span>Operator submits scoped access</span></li>
          <li><strong>Review</strong><span>HQ reviewer validates role and project scope</span></li>
          <li><strong>Activate</strong><span>Admin grants demo access</span></li>
        </ol>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>Visitor Masking</h2>
            <p>Numbers and sensitive details can be hidden by role</p>
          </div>
        </div>
        <div class="mask-demo">
          <span>Contract Amount</span>
          <strong>$***,***</strong>
          <small>Displayed to limited users</small>
        </div>
      </section>
    </div>
  `;
}

function renderTable(headers, rows) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function render() {
  const views = {
    portal: renderPortal,
    cost: renderCost,
    materials: renderMaterials,
    costMap: renderCostMap,
    contracts: renderContracts,
    smartQA: renderSmartQA,
    accounts: renderAccounts,
  };

  renderShell((views[state.active] || renderPortal)());
  bindPage();
}

function bindPage() {
  document.querySelectorAll("[data-risk]").forEach((button) => {
    button.addEventListener("click", () => {
      state.contractRisk = button.dataset.risk;
      render();
    });
  });

  document.querySelectorAll("[data-qa-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.qaMode = button.dataset.qaMode;
      render();
    });
  });

  const materialSearch = document.querySelector("#materialSearch");
  if (materialSearch) {
    materialSearch.addEventListener("input", (event) => {
      state.materialQuery = event.target.value;
      render();
    });
    materialSearch.focus();
    materialSearch.setSelectionRange(materialSearch.value.length, materialSearch.value.length);
  }
}

function boot() {
  const hash = window.location.hash.replace("#", "");
  if (modules.some((module) => module.id === hash)) {
    state.active = hash;
  }
  render();
}

window.addEventListener("hashchange", boot);
boot();
