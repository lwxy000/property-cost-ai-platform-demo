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
  materialStep: 1,
  selectedCandidate: materialCandidates[0].extracted,
  confirmedCandidates: new Set(),
  selectedHeat: { region: "Region F", category: "Repair" },
  activeCostAction: costMapActions[0].action,
  contractSearch: "",
  contractRisk: "All",
  selectedContractNo: contracts[0].no,
  contractAction: "Open the risk queue, select a contract, and simulate a review action.",
  qaMode: "Local match",
  qaQuestion: "Can this demo approve an AI-extracted material price automatically?",
  qaResultIndex: 2,
  selectedRole: "HQ Cost Reviewer",
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

function riskTone(risk) {
  if (risk === "High") return "tone-danger";
  if (risk === "Medium") return "tone-warning";
  return "tone-good";
}

function percentValue(value) {
  return Number.parseInt(String(value).replace("%", ""), 10) || 0;
}

function scopeRows(rows, areaKey = "area", projectKey = "project") {
  return rows.filter((row) => {
    const rowRegion = row[areaKey] || row.city;
    const rowProject = row[projectKey];
    const regionOk = state.region === "All Regions" || !rowRegion || rowRegion === state.region;
    const projectOk = state.project === "All Projects" || !rowProject || rowProject === state.project;
    return regionOk && projectOk;
  });
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
          <span>Front-end mock only</span>
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

function selectedHeatValue() {
  const keyMap = {
    Security: "security",
    Cleaning: "cleaning",
    Landscape: "landscape",
    Elevator: "elevator",
    Repair: "repair",
  };
  const row = costMapMatrix.find((item) => item.region === state.selectedHeat.region) || costMapMatrix[0];
  const key = keyMap[state.selectedHeat.category] || "repair";
  return { row, score: row[key], key };
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
        <img src="./public/assets/design-direction.png" alt="Design mockup direction with fictional data" />
      </section>
    </div>
  `;
}

function renderCost() {
  const max = Math.max(...costTrend.flatMap((row) => [row.budget, row.actual, row.paid]));
  const scopedRows = scopeRows(costRows);
  const activeAction = state.activeCostAction;

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
          ${[
            "Review high variance subjects",
            "Compare monthly service cost map",
            "Export synthetic executive snapshot",
          ]
            .map(
              (action) => `
                <button class="${activeAction === action ? "is-active" : ""}" data-cost-action="${action}">
                  ${action}
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="action-result">
          <strong>${activeAction}</strong>
          <span>${scopedRows.length} scoped rows ready for mock review.</span>
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
        scopedRows.map((row) => [
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
  const rows = scopeRows(materials, "city", "project").filter((item) => {
    const query = state.materialQuery.trim().toLowerCase();
    return !query || `${item.name} ${item.category} ${item.supplier}`.toLowerCase().includes(query);
  });
  const selectedCandidate =
    materialCandidates.find((item) => item.extracted === state.selectedCandidate) || materialCandidates[0];
  const steps = ["Upload", "Recognize", "Review", "Confirm"];

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
        <ol class="step-list interactive-steps">
          ${steps
            .map(
              (step, index) => `
                <li class="${index + 1 <= state.materialStep ? "is-complete" : ""}">
                  <strong>${step}</strong>
                  <span>${index + 1 === state.materialStep ? "Current mock step" : index + 1 < state.materialStep ? "Completed in browser state" : "Pending"}</span>
                </li>
              `,
            )
            .join("")}
        </ol>
        <div class="inline-actions">
          <button data-material-step="reset">Reset</button>
          <button class="primary-action" data-material-step="next">${state.materialStep >= 4 ? "Run Again" : "Advance Step"}</button>
        </div>
        <div class="detail-card">
          <span>Selected Candidate</span>
          <strong>${selectedCandidate.extracted}</strong>
          <small>${selectedCandidate.source} - ${selectedCandidate.confidence} confidence</small>
        </div>
      </section>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>Recognition Candidates</h2>
          <p>No external model is called in this browser-only demo</p>
        </div>
      </div>
      ${renderTable(
        ["Source File", "Extracted Item", "Confidence", "Reviewer Action", "State"],
        materialCandidates.map((item) => [
          item.source,
          `<button class="link-button" data-candidate="${item.extracted}">${item.extracted}</button>`,
          item.confidence,
          item.action,
          state.confirmedCandidates.has(item.extracted)
            ? `<span class="badge tone-good">Confirmed</span>`
            : `<button class="mini-action" data-confirm-candidate="${item.extracted}">Confirm</button>`,
        ]),
      )}
    </section>
  `;
}

function renderCostMap() {
  const heatHeaders = ["Security", "Cleaning", "Landscape", "Elevator", "Repair"];
  const heat = selectedHeatValue();
  const activeAction =
    costMapActions.find((item) => item.action === state.activeCostAction) || costMapActions[0];

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
              <article class="${item.action === state.activeCostAction ? "is-active" : ""}">
                <span>${item.action}</span>
                <strong>${item.impact}</strong>
                <small>${item.scope} - ${item.owner}</small>
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
                <button class="${cls("heat-cell", `heat-${heatTone(row.security)}`, state.selectedHeat.region === row.region && state.selectedHeat.category === "Security" && "is-active")}" data-heat-region="${row.region}" data-heat-category="Security">${row.security}</button>
                <button class="${cls("heat-cell", `heat-${heatTone(row.cleaning)}`, state.selectedHeat.region === row.region && state.selectedHeat.category === "Cleaning" && "is-active")}" data-heat-region="${row.region}" data-heat-category="Cleaning">${row.cleaning}</button>
                <button class="${cls("heat-cell", `heat-${heatTone(row.landscape)}`, state.selectedHeat.region === row.region && state.selectedHeat.category === "Landscape" && "is-active")}" data-heat-region="${row.region}" data-heat-category="Landscape">${row.landscape}</button>
                <button class="${cls("heat-cell", `heat-${heatTone(row.elevator)}`, state.selectedHeat.region === row.region && state.selectedHeat.category === "Elevator" && "is-active")}" data-heat-region="${row.region}" data-heat-category="Elevator">${row.elevator}</button>
                <button class="${cls("heat-cell", `heat-${heatTone(row.repair)}`, state.selectedHeat.region === row.region && state.selectedHeat.category === "Repair" && "is-active")}" data-heat-region="${row.region}" data-heat-category="Repair">${row.repair}</button>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="insight-strip">
        <article>
          <span>Selected Signal</span>
          <strong>${state.selectedHeat.region} / ${state.selectedHeat.category}</strong>
          <small>Pressure score ${heat.score}, priority ${heatTone(heat.score)}</small>
        </article>
        <article>
          <span>Suggested Action</span>
          <strong>${activeAction.action}</strong>
          <small>${activeAction.impact} estimated impact, owner ${activeAction.owner}</small>
        </article>
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
        costMapActions.map((item) => [
          `<button class="link-button" data-cost-action="${item.action}">${item.action}</button>`,
          item.impact,
          item.scope,
          item.owner,
        ]),
      )}
    </section>
  `;
}

function renderContracts() {
  const rows = contracts.filter((item) => {
    const riskOk = state.contractRisk === "All" || item.risk === state.contractRisk;
    const projectOk = state.project === "All Projects" || item.project === state.project;
    const query = state.contractSearch.trim().toLowerCase();
    const queryOk =
      !query ||
      `${item.no} ${item.project} ${item.vendor} ${item.category} ${item.reason}`.toLowerCase().includes(query);
    return riskOk && projectOk && queryOk;
  });
  const selected =
    rows.find((item) => item.no === state.selectedContractNo) ||
    contracts.find((item) => item.no === state.selectedContractNo) ||
    rows[0] ||
    contracts[0];
  const paid = percentValue(selected.paid);

  return `
    ${kpiCards(contractKpis)}
    <div class="workbench-grid">
      <section class="panel panel-large">
        <div class="panel-head">
          <div>
            <h2>Payment Progress Exposure</h2>
            <p>${rows.length} mock contracts in current view</p>
          </div>
          <div class="segmented" role="group" aria-label="Risk filter">
            ${["All", "High", "Medium", "Low"]
              .map((risk) => `<button class="${state.contractRisk === risk ? "is-active" : ""}" data-risk="${risk}">${risk}</button>`)
              .join("")}
          </div>
        </div>
        <input id="contractSearch" class="search-input full-width" value="${state.contractSearch}" placeholder="Search contract, vendor or reason" />
        ${renderTable(
          ["Contract", "Project", "Vendor", "Category", "Amount", "Paid", "Risk", "Reason"],
          rows.map((item) => [
            `<button class="link-button" data-contract="${item.no}">${item.no}</button>`,
            item.project,
            item.vendor,
            item.category,
            item.amount,
            item.paid,
            `<span class="${cls("badge", riskTone(item.risk))}">${item.risk}</span>`,
            item.reason,
          ]),
        )}
      </section>
      <aside class="panel detail-panel">
        <div class="panel-head">
          <div>
            <h2>Contract Detail</h2>
            <p>Click a row to update this mock drawer</p>
          </div>
          <span class="${cls("badge", riskTone(selected.risk))}">${selected.risk}</span>
        </div>
        <div class="detail-card">
          <span>${selected.no}</span>
          <strong>${selected.project}</strong>
          <small>${selected.vendor} - ${selected.category}</small>
        </div>
        <div class="metric-line">
          <span>Amount</span>
          <strong>${selected.amount}</strong>
        </div>
        <div class="metric-line">
          <span>Paid Progress</span>
          <strong>${selected.paid}</strong>
        </div>
        ${progressBar(paid, selected.risk === "High" ? "warning" : "good")}
        <ol class="timeline">
          <li class="is-done"><strong>Signed</strong><span>Mock contract ledger created</span></li>
          <li class="is-done"><strong>Service Period</strong><span>Monthly service tracking active</span></li>
          <li class="${paid >= 70 ? "is-done" : "is-current"}"><strong>Payment Review</strong><span>${selected.reason}</span></li>
          <li><strong>Closeout</strong><span>Pending final synthetic evidence</span></li>
        </ol>
        <div class="inline-actions">
          <button data-contract-action="Create review task">Create Task</button>
          <button data-contract-action="Request evidence">Request Evidence</button>
          <button class="primary-action" data-contract-action="Simulate approval">Simulate Approval</button>
        </div>
        <div class="action-result">
          <strong>Latest Mock Action</strong>
          <span>${state.contractAction}</span>
        </div>
      </aside>
    </div>
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
  const currentCase = qaCases[state.qaResultIndex] || qaCases[0];

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
          <div class="chat user">${state.qaQuestion}</div>
          <div class="chat system">
            <strong>${currentCase.answer}</strong>
            <span>${currentCase.evidence}</span>
          </div>
        </div>
        <div class="input-row">
          <input id="qaInput" value="${state.qaQuestion}" aria-label="Mock question" />
          <button id="qaAsk">Get Answer</button>
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
                  <button class="mini-action" data-qa-case="${qaCases.indexOf(item)}">Use Case</button>
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
  const selectedRole = roles.find((item) => item.role === state.selectedRole) || roles[1];

  return `
    <div class="workbench-grid">
      <section class="panel panel-large">
        <div class="panel-head">
          <div>
            <h2>Role Matrix</h2>
            <p>Select a role to preview masked access</p>
          </div>
        </div>
        ${renderTable(
          ["Role", "Cost", "Materials", "Contracts", "Smart Q&A", "Accounts"],
          roles.map((item) => [
            `<button class="link-button" data-role="${item.role}">${item.role}</button>`,
            item.cost,
            item.materials,
            item.contracts,
            item.qa,
            item.account,
          ]),
        )}
      </section>
      <aside class="panel detail-panel">
        <div class="panel-head">
          <div>
            <h2>Permission Preview</h2>
            <p>Current selected demo role</p>
          </div>
          <span class="status-chip">${selectedRole.role}</span>
        </div>
        <div class="permission-preview">
          <article><span>Cost</span><strong>${selectedRole.cost}</strong></article>
          <article><span>Materials</span><strong>${selectedRole.materials}</strong></article>
          <article><span>Contracts</span><strong>${selectedRole.contracts}</strong></article>
          <article><span>Smart Q&A</span><strong>${selectedRole.qa}</strong></article>
          <article><span>Accounts</span><strong>${selectedRole.account}</strong></article>
        </div>
        <div class="mask-demo">
          <span>Contract Amount</span>
          <strong>${selectedRole.contracts === "Limited" || selectedRole.contracts === "None" ? "$***,***" : "$96.8M"}</strong>
          <small>${selectedRole.contracts === "Limited" || selectedRole.contracts === "None" ? "Masked by selected role" : "Visible in demo role"}</small>
        </div>
      </aside>
    </div>
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
  document.querySelectorAll("[data-cost-action]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCostAction = button.dataset.costAction;
      render();
    });
  });

  document.querySelectorAll("[data-material-step]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.materialStep === "reset") {
        state.materialStep = 1;
        state.confirmedCandidates = new Set();
      } else {
        state.materialStep = state.materialStep >= 4 ? 1 : state.materialStep + 1;
      }
      render();
    });
  });

  document.querySelectorAll("[data-candidate]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCandidate = button.dataset.candidate;
      render();
    });
  });

  document.querySelectorAll("[data-confirm-candidate]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCandidate = button.dataset.confirmCandidate;
      state.materialStep = 4;
      state.confirmedCandidates.add(button.dataset.confirmCandidate);
      render();
    });
  });

  document.querySelectorAll("[data-heat-region]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedHeat = {
        region: button.dataset.heatRegion,
        category: button.dataset.heatCategory,
      };
      render();
    });
  });

  document.querySelectorAll("[data-risk]").forEach((button) => {
    button.addEventListener("click", () => {
      state.contractRisk = button.dataset.risk;
      render();
    });
  });

  document.querySelectorAll("[data-contract]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedContractNo = button.dataset.contract;
      state.contractAction = `Selected ${button.dataset.contract} for mock review.`;
      render();
    });
  });

  document.querySelectorAll("[data-contract-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const contract = contracts.find((item) => item.no === state.selectedContractNo) || contracts[0];
      state.contractAction = `${button.dataset.contractAction} recorded for ${contract.no}.`;
      render();
    });
  });

  document.querySelectorAll("[data-qa-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.qaMode = button.dataset.qaMode;
      state.qaResultIndex =
        state.qaMode === "Vision extract" ? 1 : state.qaMode === "Deep answer" ? 2 : state.qaResultIndex;
      render();
    });
  });

  document.querySelectorAll("[data-qa-case]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number.parseInt(button.dataset.qaCase, 10);
      state.qaResultIndex = Number.isNaN(index) ? 0 : index;
      state.qaQuestion = qaCases[state.qaResultIndex].question;
      render();
    });
  });

  document.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRole = button.dataset.role;
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

  const contractSearch = document.querySelector("#contractSearch");
  if (contractSearch) {
    contractSearch.addEventListener("input", (event) => {
      state.contractSearch = event.target.value;
      render();
    });
    contractSearch.focus();
    contractSearch.setSelectionRange(contractSearch.value.length, contractSearch.value.length);
  }

  const qaInput = document.querySelector("#qaInput");
  if (qaInput) {
    qaInput.addEventListener("input", (event) => {
      state.qaQuestion = event.target.value;
    });
  }

  const qaAsk = document.querySelector("#qaAsk");
  if (qaAsk) {
    qaAsk.addEventListener("click", () => {
      const text = state.qaQuestion.toLowerCase();
      if (text.includes("material") || text.includes("price") || text.includes("import")) {
        state.qaResultIndex = 2;
      } else if (text.includes("contract") || text.includes("payment")) {
        state.qaResultIndex = 1;
      } else if (text.includes("cost") || text.includes("region") || text.includes("repair")) {
        state.qaResultIndex = 3;
      } else if (text.includes("vendor") || text.includes("role") || text.includes("permission")) {
        state.qaResultIndex = 4;
      } else {
        state.qaResultIndex = 0;
      }
      render();
    });
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
