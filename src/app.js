import {
  modules,
  portfolio,
  portalStats,
  commandCenter,
  moduleHealth,
  operationsFeed,
  scenarioJourneys,
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

const scenarioRoles = ["HQ Cost Reviewer", "Regional Operator", "External Vendor"];

function createScenarioRuns() {
  return Object.fromEntries(
    scenarioJourneys.map((scenario) => [
      scenario.id,
      {
        completedSteps: scenario.steps
          .map((step, index) => (step.state === "Done" ? index : null))
          .filter((index) => index !== null),
        log: [
          {
            time: scenario.steps[0]?.time === "Pending" ? "09:00" : scenario.steps[0]?.time || "09:00",
            actor: scenario.owner,
            step: scenario.steps[0]?.label || "Scenario",
            action: "Scenario loaded",
            result: scenario.summary,
          },
        ],
        decision: "",
      },
    ]),
  );
}

const state = {
  active: "scenarios",
  language: localStorage.getItem("demo-language") || "zh",
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
  scenarioRole: "HQ Cost Reviewer",
  activeScenario: scenarioJourneys[0].id,
  activeScenarioStep: scenarioJourneys[0].currentStep,
  scenarioAction: "Open a scenario, pick a step, and simulate the next business action.",
  scenarioRuns: createScenarioRuns(),
};

const zh = {
  Portal: "门户首页",
  Scenarios: "业务场景",
  "Guided workflows from import to decision": "从导入到决策的业务链路演示",
  "Cost Overview": "成本总览",
  "Material Library": "材料库",
  "Cost Map": "成本地图",
  Contracts: "合同管理",
  "Smart Q&A": "智能问答",
  Accounts: "账号权限",
  "Unified entry and module routing": "统一入口与模块导航",
  "Budget, actuals, variance and actions": "预算、实际、偏差与动作闭环",
  "Price library and AI import review": "价格库与 AI 导入复核",
  "Regional standards and benchmark pricing": "区域标准与成本基准",
  "Payment progress and risk exposure": "付款进度与风险敞口",
  "Local matching, OCR mock and AI answer flow": "本地匹配、识别模拟与 AI 问答流程",
  "Roles, access and approval boundaries": "角色、访问与审批边界",
  Region: "区域",
  Project: "项目",
  "Mock Data": "演示数据",
  "Demo Boundary": "演示边界",
  "Front-end mock only": "仅前端模拟",
  "No database": "不连接数据库",
  "No secrets": "无密钥",
  "Open Demo": "开源演示版",
  "Managed Projects": "在管项目",
  "Annual Cost Scope": "年度成本口径",
  "Material Prices": "材料价格",
  "Contract Exposure": "合同敞口",
  "AI Review Tasks": "AI 复核任务",
  "Permission Events": "权限事件",
  "12 demo regions": "12 个演示区域",
  "Synthetic portfolio": "模拟组合口径",
  "Mock library rows": "模拟价格库行",
  "312 demo contracts": "312 份演示合同",
  "Static simulations": "浏览器模拟任务",
  "Role audit mock": "角色审计模拟",
  "Cost variance under review": "成本偏差待复核",
  "Contract payment lag": "合同付款滞后",
  "Material price opportunities": "材料价格机会",
  "Permission anomalies blocked": "权限异常拦截",
  "Across 41 projects": "覆盖 41 个项目",
  "26 demo items": "26 个演示事项",
  "143 benchmark gaps": "143 个基准差异",
  "No privileged bypass": "无越权绕过",
  "Operations Portal": "运营门户",
  "Local Preview": "本地预览",
  "Module Health": "模块健康度",
  "Portfolio-scale public demo snapshot": "集团级公开演示快照",
  Module: "模块",
  Coverage: "覆盖范围",
  Signal: "信号",
  Health: "状态",
  Watch: "关注",
  Good: "正常",
  "Sanitization Rules": "脱敏规则",
  "Public-safe demo guardrails": "公开版安全边界",
  "Operations Feed": "运营动态",
  "Fictional control-center activity": "虚构的总控台动作",
  "Design Direction": "设计方向",
  "IMAGE-2 visual advisor output": "IMAGE-2 视觉顾问输出",
  "Annual Budget": "年度预算",
  "Actual Cost": "实际成本",
  Forecast: "预测金额",
  "Open Actions": "待办动作",
  "AI Matched Issues": "AI 匹配事项",
  "Savings Pipeline": "节降机会池",
  "86 projects": "86 个项目",
  "47.6% used": "已使用 47.6%",
  "+3.7% vs budget": "较预算 +3.7%",
  "42 high priority": "42 个高优先级",
  "mock knowledge hits": "模拟知识命中",
  "review in progress": "复核中",
  "Monthly Cost Execution": "月度成本执行",
  "Budget, actual and paid values are fictional": "预算、实际与已付均为虚构数据",
  "Action Queue": "动作队列",
  "Variance review workflow": "偏差复核流程",
  "Review high variance subjects": "复核高偏差科目",
  "Compare monthly service cost map": "对比月度服务成本地图",
  "Export synthetic executive snapshot": "导出演示经营快照",
  "Cost Subjects": "成本科目",
  "Scoped by": "当前范围",
  Area: "区域",
  Subject: "科目",
  Budget: "预算",
  Actual: "实际",
  Variance: "偏差",
  Owner: "负责人",
  "Material Price Library": "材料价格库",
  "Reviewer-confirmed synthetic prices": "经复核的模拟价格",
  "Search material or supplier": "搜索材料或供应商",
  Material: "材料",
  Category: "品类",
  Unit: "单位",
  City: "区域",
  Supplier: "供应商",
  Current: "当前价",
  Tax: "税率",
  Change: "变动",
  Status: "状态",
  Confirmed: "已确认",
  Review: "待复核",
  "AI Import Mock": "AI 导入模拟",
  "Candidate generation, edit and confirm": "候选生成、编辑与确认",
  Upload: "上传",
  Recognize: "识别",
  Confirm: "确认",
  "Current mock step": "当前模拟步骤",
  "Completed in browser state": "浏览器状态已完成",
  Pending: "待处理",
  Reset: "重置",
  "Run Again": "重新演示",
  "Advance Step": "推进步骤",
  "Selected Candidate": "当前候选",
  "Recognition Candidates": "识别候选",
  "No external model is called in this browser-only demo": "浏览器演示不调用外部模型",
  "Source File": "来源文件",
  "Extracted Item": "识别条目",
  Confidence: "置信度",
  "Reviewer Action": "复核动作",
  State: "状态",
  "Regional Cost Command Center": "区域成本指挥中心",
  "12-region synthetic benchmark model with prioritized action value": "12 区域模拟基准模型与动作价值排序",
  "$4.30M demo savings pool": "$4.30M 演示节降池",
  "Cost Pressure Heat Matrix": "成本压力热力矩阵",
  "Fictional score by region and major operating category": "按区域与主类展示虚构压力分",
  "Selected Signal": "选中信号",
  "Pressure score": "压力分",
  priority: "优先级",
  critical: "严重",
  high: "高",
  watch: "关注",
  good: "正常",
  "Suggested Action": "建议动作",
  "estimated impact, owner": "预计影响，负责人",
  "Standard Item Benchmarks": "标准项基准",
  "Current effective price only, no historical source files": "仅展示当前有效价，不含历史源文件",
  "Cost Item": "成本项",
  "Demo Standard": "演示标准",
  "Current Price": "当前价格",
  Progress: "进度",
  Normal: "正常",
  "Prioritized Action Pool": "优先动作池",
  "Demo recommendations for procurement, contract and engineering follow-up": "用于采购、合同与工程跟进的演示建议",
  Action: "动作",
  "Estimated Impact": "预计影响",
  Scope: "范围",
  "Ledger Contracts": "台账合同",
  "Contract Amount": "合同金额",
  "Pending Payment": "待付款",
  "Due Soon": "即将到期",
  "High Risk": "高风险",
  "AI Flags": "AI 标记",
  "Mock batch 2026-Q2": "2026-Q2 模拟批次",
  "Fictional ledger": "虚构台账",
  "26 items": "26 个事项",
  "Next 45 days": "未来 45 天",
  "Needs review": "需要复核",
  "Rule-based mock": "规则模拟",
  "Payment Progress Exposure": "付款进度敞口",
  "mock contracts in current view": "份合同在当前视图",
  "Risk filter": "风险筛选",
  All: "全部",
  High: "高",
  Medium: "中",
  Low: "低",
  "Search contract, vendor or reason": "搜索合同、供应商或原因",
  Contract: "合同",
  Vendor: "供应商",
  Amount: "金额",
  Paid: "已付",
  Risk: "风险",
  Reason: "原因",
  "Contract Detail": "合同详情",
  "Click a row to update this mock drawer": "点击行更新此模拟抽屉",
  "Paid Progress": "付款进度",
  Signed: "已签署",
  "Mock contract ledger created": "已创建模拟合同台账",
  "Service Period": "服务周期",
  "Monthly service tracking active": "月度服务跟踪中",
  "Payment Review": "付款复核",
  Closeout: "结算归档",
  "Pending final synthetic evidence": "等待最终模拟凭证",
  "Create Task": "创建任务",
  "Request Evidence": "索要资料",
  "Request evidence": "索要资料",
  "Simulate Approval": "模拟审批",
  "Simulate approval": "模拟审批",
  "Latest Mock Action": "最近模拟动作",
  "Risk Logic": "风险逻辑",
  "First-stage public demo rules": "公开版首阶段规则",
  "Monthly service contracts track paid-through month.": "月度服务合同跟踪已付至月份。",
  "Other contracts track cumulative payment ratio.": "其他合同跟踪累计付款比例。",
  "Risk labels are generated from fake amounts and dates.": "风险标签由虚构金额与日期生成。",
  "Audit Boundary": "审计边界",
  "What this demo does not include": "本演示不包含的内容",
  "No real contract files.": "不包含真实合同文件。",
  "No real payment ledger.": "不包含真实付款台账。",
  "No production attachment workflow.": "不包含生产附件流程。",
  "Smart Q&A Workbench": "智能问答工作台",
  "Local match first; vision and deep answer are explicit actions": "优先本地匹配，识别与深度回答为显式动作",
  "Local match": "本地匹配",
  "Vision extract": "识别提取",
  "Deep answer": "深度回答",
  "Get Answer": "获取回答",
  "Knowledge Cases": "知识案例",
  "Fictional examples only": "仅虚构示例",
  "Use Case": "使用案例",
  "AI Audit Trail": "AI 审计轨迹",
  "Shows cost-control behavior without real model calls": "展示成本管控行为，但不调用真实模型",
  Note: "说明",
  "Role Matrix": "角色矩阵",
  "Select a role to preview masked access": "选择角色预览脱敏访问",
  "Permission Preview": "权限预览",
  "Current selected demo role": "当前选中演示角色",
  Cost: "成本",
  Materials: "材料",
  "Smart Q&A": "智能问答",
  "Visible in demo role": "当前角色可见",
  "Masked by selected role": "按当前角色脱敏",
  "Approval Flow": "审批流程",
  "Mock account governance": "模拟账号治理",
  Request: "申请",
  "Operator submits scoped access": "运营人员提交范围化权限申请",
  "HQ reviewer validates role and project scope": "总部复核角色与项目范围",
  Activate: "启用",
  "Admin grants demo access": "管理员授予演示权限",
  "Business Scenario Demo": "业务场景演示",
  "Guided scenario paths": "业务链路路径",
  "Module views remain available, but the demo now leads with end-to-end work scenes.": "模块视图仍然保留，但演示现在优先呈现端到端业务场景。",
  "Start scenario": "进入场景",
  "Continue scenario": "继续场景",
  "Scenario command": "场景指令",
  "Scenario steps": "场景步骤",
  "Step detail": "步骤详情",
  "Evidence": "依据",
  "Mock actions": "模拟动作",
  "Linked modules": "关联模块",
  "Scenario metrics": "场景指标",
  "Current business action": "当前业务动作",
  "Previous step": "上一步",
  "Next step": "下一步",
  "Open linked module": "打开关联模块",
  "Closed-loop engine": "业务闭环引擎",
  "Closed-loop progress": "闭环进度",
  "Completed steps": "已完成步骤",
  "Run status": "运行状态",
  "Role View": "角色视角",
  "Role perspective": "角色视角",
  "Visible modules": "可见模块",
  "Evidence Chain": "证据链",
  "Current step evidence": "当前步骤依据",
  "Public-safe evidence chain": "公开安全证据链",
  "Operation Log": "操作日志",
  "Last actions": "最近动作",
  "Decision Summary": "决策摘要",
  "Generate decision summary": "生成决策摘要",
  "Generate management summary": "生成管理摘要",
  "Reset scenario run": "重置场景运行",
  "Clear run state": "清空运行状态",
  "No decision summary generated yet.": "尚未生成决策摘要。",
  "Decision draft is generated from completed mock steps only.": "决策草案仅基于已完成的模拟步骤生成。",
  "Decision summary uses fictional metrics and sanitized evidence only.": "决策摘要仅使用虚构指标和脱敏依据。",
  "Run an action or advance a step to build the audit trail.": "执行动作或推进步骤后会生成审计轨迹。",
  "Evidence masked for selected role": "依据已按当前角色脱敏",
  "Current role can inspect cross-region benchmark and contract amount details.": "当前角色可查看跨区域基准与合同金额细节。",
  "Current role sees project-scoped cost, contract and material details.": "当前角色可查看项目范围内成本、合同与材料细节。",
  "Current role sees only vendor-safe records; amounts and cross-region signals are masked.": "当前角色仅可查看供应商安全记录，金额和跨区域信号已脱敏。",
  "Scenario loaded": "场景已载入",
  "Step completed": "步骤已完成",
  "Decision draft generated": "决策草案已生成",
  "Scenario run reset": "场景运行已重置",
  "Role view switched": "角色视角已切换",
  "Action registered": "动作已登记",
  "Marked complete": "已标记完成",
  "Ready for management review": "可提交管理复核",
  "Requires more evidence": "仍需补充依据",
  "In progress": "进行中",
  Ready: "就绪",
  Done: "已完成",
  Current: "当前",
  "Material import to contract risk": "材料导入到合同风险",
  "Quote recognition, price confirmation, benchmark anomaly and payment-risk follow-up.": "报价识别、价格确认、基准异常与付款风险跟进。",
  "Monthly service payment review": "月度服务付款复核",
  "Contract ledger, service-period check, missing evidence and approval simulation.": "合同台账、服务期间核验、缺失凭证与审批模拟。",
  "Vendor access and Q&A boundary": "供应商访问与问答边界",
  "Role switch, amount masking, scoped material view and safe Q&A response.": "角色切换、金额脱敏、范围化材料视图与安全问答。",
  "Recognized rows": "识别行数",
  "New library items": "新增入库项",
  "Anomaly regions": "异常区域",
  "Linked contracts": "关联合同",
  "Payment lag cases": "付款滞后案例",
  "High risk contracts": "高风险合同",
  "Due soon": "即将到期",
  "Evidence gaps": "凭证缺口",
  "Blocked events": "拦截事件",
  Roles: "角色",
  "Masked amount": "脱敏金额",
  "Q&A rules": "问答规则",
  "AI import": "AI 导入",
  "Price library": "价格库",
  "Cost anomaly": "成本异常",
  "Contract risk": "合同风险",
  "Permission masking": "权限脱敏",
  "Contract filter": "合同筛选",
  "Payment review": "付款复核",
  "Policy question": "制度问答",
  "Role check": "角色检查",
  "Role switch": "角色切换",
  "Masked ledger": "脱敏台账",
  "Scoped material view": "范围化材料视图",
  "Safe answer": "安全回答",
  "386 candidate rows recognized from fictional quote files.": "从虚构报价文件中识别 386 条候选记录。",
  "278 rows entered the mock price library after reviewer confirmation.": "经复核确认后，278 条记录进入模拟价格库。",
  "Cost map flags repair and security pressure above the synthetic benchmark band.": "成本地图标记维修与安保压力高于模拟基准区间。",
  "Linked contracts include payment lag, missing evidence and unit-price deviation signals.": "关联合同包含付款滞后、凭证缺失与单价偏差信号。",
  "Operator asks why this item is prioritized and receives a rule-based mock answer.": "运营人员询问为何优先处理该事项，并获得规则模拟回答。",
  "Switching to vendor role hides cross-region exposure and contract amount details.": "切换到供应商角色后，跨区域敞口和合同金额细节被隐藏。",
  "Risk queue filters high-risk monthly service contracts.": "风险队列筛选高风险月度服务合同。",
  "Detail drawer checks paid progress, service period and missing acceptance evidence.": "详情抽屉检查付款进度、服务期间和缺失验收资料。",
  "Smart Q&A explains what should be checked before payment approval.": "智能问答说明付款审批前应检查的内容。",
  "Role matrix confirms operators can review scoped contracts without account admin rights.": "角色矩阵确认运营人员可复核范围内合同，但无账号管理权限。",
  "External vendor role limits contracts and material library access.": "外部供应商角色限制合同与材料库访问范围。",
  "Contract exposure is masked for limited users.": "受限用户的合同敞口会被脱敏。",
  "Vendor can only see limited material context in the mock scenario.": "供应商在模拟场景中只能看到受限材料上下文。",
  "Smart Q&A refuses cross-region exposure and cites permission rule AC-03.": "智能问答拒绝跨区域敞口查询，并引用权限规则 AC-03。",
  "Open import center": "打开导入中心",
  "Confirm candidates": "确认候选项",
  "Review duplicate prices": "复核重复价格",
  "Compare supplier band": "对比供应商区间",
  "Open heat matrix": "打开热力矩阵",
  "Generate saving action": "生成节降动作",
  "Ask linked question": "询问关联问题",
  "Generate answer": "生成回答",
  "Open contract list": "打开合同清单",
  "Filter high risk": "筛选高风险",
  "Ask contract question": "询问合同问题",
  "Trace evidence": "追踪依据",
  "Preview operator role": "预览运营角色",
  "Check permissions": "检查权限",
  "Preview vendor role": "预览供应商角色",
  "Check masking": "检查脱敏",
  "View masked amount": "查看脱敏金额",
  "Compare reviewer role": "对比复核角色",
  "Open material library": "打开材料库",
  "Search scoped item": "搜索范围内条目",
  "Ask permission question": "询问权限问题",
  "Role-scoped answer": "角色范围回答",
  "43% paid": "已付 43%",
  "High risk": "高风险",
  "Region C / Repair score 94": "区域 C / 维修分 94",
  "Region F / Security score 95": "区域 F / 安保分 95",
  "Open a scenario, pick a step, and simulate the next business action.": "打开一个场景，选择步骤，并模拟下一项业务动作。",
  "No production repository history": "不包含生产仓库历史",
  "No real database connection": "不连接真实数据库",
  "No real uploads or contract files": "不包含真实上传或合同文件",
  "No secrets, domains, IP addresses or accounts": "不包含密钥、域名、IP 或账号",
  "All records are fictional mock data": "所有记录均为虚构演示数据",
  "18,420 prices": "18,420 条价格",
  "42 high-priority actions": "42 个高优先级动作",
  "143 benchmark opportunities": "143 个基准机会",
  "12 regions": "12 个区域",
  "31 standards above band": "31 个标准项高于区间",
  "26 payment lag cases": "26 个付款滞后案例",
  "3,842 matches": "3,842 次匹配",
  "1,284 AI tasks simulated": "1,284 个 AI 模拟任务",
  "4 roles": "4 个角色",
  "37 blocked demo events": "37 个演示拦截事件",
  "AI import recognized 42 candidate material rows": "AI 导入识别出 42 条材料候选记录",
  "Cost map found 9 security benchmarks above demo band": "成本地图发现 9 个安保基准高于演示区间",
  "Contract risk queue grouped 6 high-risk payment lags": "合同风险队列归集 6 个高风险付款滞后项",
  "Smart Q&A matched policy case CT-02 for payment review": "智能问答命中付款复核规则 CT-02",
  "Permission center blocked external full-library access": "权限中心拦截外部角色访问全量库",
  "Cost Ops": "成本运营",
  "Material Desk": "材料台",
  "Contract Desk": "合同台",
  "AI Assistant": "AI 助手",
  "Access Control": "权限控制",
  "Site Ops": "现场运营",
  Engineering: "工程",
  "Energy Desk": "能源台",
  "Asset Desk": "资产台",
  Procurement: "采购",
  "Commercial Ops": "商业运营",
  "Security Service": "安保服务",
  "Cleaning Service": "保洁服务",
  Maintenance: "维保",
  Utilities: "能耗",
  "Elevator Maintenance": "电梯维保",
  Landscape: "绿化",
  "Public Area Repair": "公区维修",
  Consumables: "耗材",
  "Fire System Testing": "消防系统检测",
  "Parking Operation": "停车运营",
  "Energy Inspection": "能源巡检",
  "Pest Control": "消杀服务",
  Construction: "工程材料",
  Electrical: "电气",
  Operations: "运营物料",
  Repair: "维修",
  Security: "安保",
  Cleaning: "保洁",
  Elevator: "电梯",
  Benchmark: "基准",
  "Demo Concrete C30": "演示混凝土 C30",
  "Demo LED Panel": "演示 LED 面板",
  "Demo Cleaning Agent": "演示清洁剂",
  "Demo Elevator Part": "演示电梯配件",
  "Demo Planting Soil": "演示种植土",
  "Demo Fire Pump Seal": "演示消防泵密封件",
  "Demo Access Card": "演示门禁卡",
  "Demo Waterproof Coating": "演示防水涂料",
  "Demo Gate Motor": "演示道闸电机",
  "Demo Meter Cabinet": "演示表箱",
  "Demo Patrol Device": "演示巡更设备",
  "Demo Filter Cartridge": "演示滤芯",
  "Demo Pipe DN50": "演示管材 DN50",
  "Demo Sensor Kit": "演示传感器套件",
  "Demo Valve Assembly": "演示阀门组件",
  "Needs unit check": "需核对单位",
  "Ready to confirm": "可确认",
  "Supplier review": "供应商复核",
  "Tax rate check": "税率核对",
  "Category review": "品类复核",
  "Security staffing": "安保排班",
  "Cleaning frequency": "保洁频次",
  "Lift count": "电梯数量",
  "Energy savings": "节能收益",
  "Shared vendor pool": "共享供应商池",
  "Compact layout": "紧凑业态",
  "Aging assets": "老旧资产",
  "Emergency repair": "应急维修",
  "Seasonal landscaping": "季节性绿化",
  "Lift maintenance": "电梯维保",
  "Fire system": "消防系统",
  "Weekend staffing": "周末排班",
  "Vendor pooling": "供应商集采",
  "Energy controls": "能耗控制",
  "Low repair rate": "低维修率",
  "Waterproof repair": "防水维修",
  "Aging pumps": "老旧水泵",
  "Small contract base": "小合同基数",
  "Parking operation": "停车运营",
  "Gate systems": "道闸系统",
  "Night patrol": "夜间巡逻",
  "Fire testing": "消防检测",
  "High-rise assets": "高层资产",
  "Repair backlog": "维修积压",
  "Security Post": "安保岗位",
  "Cleaning Labor": "保洁人工",
  "Green Care": "绿化养护",
  "Elevator Maint.": "电梯维保",
  "Fire Pump Maint.": "消防泵维保",
  "Public Repair": "公区维修",
  "Energy Inspection": "能源巡检",
  "Normalize security staffing model": "统一安保排班模型",
  "Retender cleaning consumables bundle": "重采保洁耗材包",
  "Review elevator maintenance unit price": "复核电梯维保单价",
  "Merge small repair contracts by region": "按区域合并小额维修合同",
  "Lock fire-system testing package price": "锁定消防检测打包价格",
  "Benchmark waterproof repair unit rates": "对标防水维修单价",
  "18 projects": "18 个项目",
  "9 suppliers": "9 家供应商",
  "42 lifts": "42 台电梯",
  "31 contracts": "31 份合同",
  "27 projects": "27 个项目",
  "Fire System": "消防系统",
  Energy: "能源",
  "Security Device": "安防设备",
  "Payment lag": "付款滞后",
  "Due date approaching": "即将到期",
  "Missing service period": "缺少服务期间",
  "On track": "正常推进",
  "Acceptance evidence pending": "验收资料待补",
  "Unit price above benchmark": "单价高于基准",
  "Within payment plan": "符合付款计划",
  "Warranty clause review": "质保条款复核",
  "Supplier onboarding": "供应商准入",
  "Contract review": "合同复核",
  "Material import": "材料导入",
  "Cost map": "成本地图",
  "Permission center": "权限中心",
  "Can a vendor be approved without complete tax information?": "供应商税务信息不完整时能否通过准入？",
  "What should be checked before approving a monthly service payment?": "审批月度服务付款前应检查什么？",
  "Can AI recognition write directly into the price library?": "AI 识别结果能否直接写入价格库？",
  "Which regions should be reviewed first for repair cost variance?": "哪些区域应优先复核维修成本偏差？",
  "Can an external vendor see cross-region contract exposure?": "外部供应商能否查看跨区域合同敞口？",
  "Can this demo approve an AI-extracted material price automatically?": "这个演示能否自动审批 AI 识别出的材料价格？",
  "No. The demo rule requires tax identity, contact details, and category scope before approval.": "不能。演示规则要求先补齐税务身份、联系人与品类范围后才能准入。",
  "Verify service period, contract coverage, payment lag, and variance against the monthly accrual.": "需要核验服务期间、合同覆盖范围、付款滞后情况，并与月度计提偏差对比。",
  "No. Recognition only creates candidates; a reviewer must confirm each item before it enters the library.": "不能。识别只生成候选项，每条记录必须经复核人确认后才能入库。",
  "The demo prioritizes regions with high repair score, high benchmark variance, and open contract actions.": "演示会优先推送维修压力高、基准偏差高且存在合同动作的区域。",
  "No. The demo role matrix limits vendors to scoped contract and material views only.": "不能。演示角色矩阵将供应商限制在范围内合同与材料视图。",
  "Matched 3 fictional prior cases": "命中 3 条虚构历史案例",
  "Matched demo rule group CT-02": "命中演示规则组 CT-02",
  "Matched demo rule group ML-01": "命中演示规则组 ML-01",
  "Matched demo rule group CM-04": "命中演示规则组 CM-04",
  "Matched demo rule group AC-03": "命中演示规则组 AC-03",
  "Local match": "本地匹配",
  "Vision extract": "识别提取",
  "Deep answer": "深度回答",
  "Permission check": "权限检查",
  "Evidence trace": "证据追踪",
  Completed: "已完成",
  Optional: "可选",
  "Mock only": "仅模拟",
  "No external model call": "不调用外部模型",
  "Synthetic document preview": "模拟文档预览",
  "Disabled in browser-only demo": "浏览器演示中禁用",
  "Role-scoped mock answer": "按角色范围模拟回答",
  "Links to fictional rule groups only": "仅链接到虚构规则组",
  "All Regions": "全部区域",
  "All Projects": "全部项目",
  "Region A": "区域 A",
  "Region B": "区域 B",
  "Region C": "区域 C",
  "Region D": "区域 D",
  "Region E": "区域 E",
  "Region F": "区域 F",
  "Region G": "区域 G",
  "Region H": "区域 H",
  "Region I": "区域 I",
  "Region J": "区域 J",
  "Region K": "区域 K",
  "Project Alpha": "项目 Alpha",
  "Project Beta": "项目 Beta",
  "Project Gamma": "项目 Gamma",
  "Project Delta": "项目 Delta",
  "Project Echo": "项目 Echo",
  "Project Foxtrot": "项目 Foxtrot",
  "Project Harbor": "项目 Harbor",
  "Project Iota": "项目 Iota",
  "Project Jade": "项目 Jade",
  "Project Kappa": "项目 Kappa",
  "Project Lumen": "项目 Lumen",
  "Project Metro": "项目 Metro",
  "Supplier Alpha": "供应商 Alpha",
  "Supplier Beta": "供应商 Beta",
  "Supplier Gamma": "供应商 Gamma",
  "Supplier Delta": "供应商 Delta",
  "Supplier Echo": "供应商 Echo",
  "Supplier Fox": "供应商 Fox",
  "Supplier Grid": "供应商 Grid",
  "Supplier Halo": "供应商 Halo",
  "Supplier Ion": "供应商 Ion",
  "Supplier Juno": "供应商 Juno",
  "Supplier Kite": "供应商 Kite",
  "Supplier Loom": "供应商 Loom",
  "System Admin": "系统管理员",
  "HQ Cost Reviewer": "总部成本复核人",
  "Regional Operator": "区域运营人员",
  "External Vendor": "外部供应商",
  Full: "全部",
  Approve: "审批",
  Scoped: "范围内",
  Submit: "提交",
  None: "无",
  Configure: "配置",
  Read: "只读",
  Limited: "受限",
  Review: "复核",
  "Ask only": "仅提问",
};

function t(value) {
  if (value == null) return "";
  return state.language === "zh" ? zh[value] || value : value;
}

function formatJoin(parts, separator = " / ") {
  return parts.map((part) => t(part)).join(separator);
}

function cls(...parts) {
  return parts.filter(Boolean).join(" ");
}

function toneClass(tone) {
  return tone ? `tone-${tone.toLowerCase()}` : "";
}

function activeModule() {
  return modules.find((module) => module.id === state.active) || modules[0];
}

function activeScenario() {
  return scenarioJourneys.find((scenario) => scenario.id === state.activeScenario) || scenarioJourneys[0];
}

function activeScenarioStep(scenario = activeScenario()) {
  return scenario.steps[state.activeScenarioStep] || scenario.steps[0];
}

function scenarioRun(scenario = activeScenario()) {
  if (!state.scenarioRuns[scenario.id]) {
    state.scenarioRuns[scenario.id] = createScenarioRuns()[scenario.id];
  }
  return state.scenarioRuns[scenario.id];
}

function scenarioStepState(step, index, run = scenarioRun()) {
  if (run.completedSteps.includes(index)) return "Done";
  if (index === state.activeScenarioStep) return "Current";
  return "Pending";
}

function scenarioProgress(scenario = activeScenario(), run = scenarioRun(scenario)) {
  const completed = scenario.steps.filter((step, index) => scenarioStepState(step, index, run) === "Done").length;
  const total = scenario.steps.length;
  const percent = Math.round((completed / total) * 100);
  return {
    completed,
    total,
    percent,
    status: completed === total ? "Ready for management review" : "Requires more evidence",
  };
}

function demoClock() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function completeScenarioStep(index = state.activeScenarioStep) {
  const run = scenarioRun();
  if (!run.completedSteps.includes(index)) {
    run.completedSteps = [...run.completedSteps, index].sort((a, b) => a - b);
  }
}

function addScenarioLog(action, result) {
  const scenario = activeScenario();
  const step = activeScenarioStep(scenario);
  const run = scenarioRun(scenario);
  run.log = [
    {
      time: demoClock(),
      actor: state.scenarioRole,
      step: step.label,
      action,
      result: result || step.result,
    },
    ...run.log,
  ].slice(0, 7);
}

function roleScopeText() {
  if (state.scenarioRole === "External Vendor") {
    return "Current role sees only vendor-safe records; amounts and cross-region signals are masked.";
  }
  if (state.scenarioRole === "Regional Operator") {
    return "Current role sees project-scoped cost, contract and material details.";
  }
  return "Current role can inspect cross-region benchmark and contract amount details.";
}

function maskedEvidence(item) {
  const text = t(item);
  if (state.scenarioRole !== "External Vendor") return text;
  return text
    .replace(/\$[\d.,A-Z]+/g, "$***")
    .replace(/DEMO-CT-\d{4}-\d{3}/g, "DEMO-CT-****")
    .replace(/Region [A-Z]/g, "Scoped Region")
    .replace(/区域 [A-Z]/g, "授权区域")
    .replace(/Project [A-Za-z]+/g, "Scoped Project")
    .replace(/项目 [A-Za-z]+/g, "授权项目");
}

function scenarioDecisionText(scenario, progress) {
  if (state.language === "zh") {
    const suffix = `当前闭环完成 ${progress.completed}/${progress.total} 步，依据均为公开版虚构样例。`;
    if (scenario.id === "material-to-risk") {
      return `建议：继续推进材料异常到合同风险复核，先补齐关联合同凭证，再进入模拟审批。${suffix}`;
    }
    if (scenario.id === "contract-payment") {
      return `建议：暂缓付款审批，先核验服务期间、付款进度和验收依据，再由总部复核人确认。${suffix}`;
    }
    return `建议：保持供应商受限访问，跨区域敞口与金额继续脱敏，问答仅返回权限范围内答案。${suffix}`;
  }

  const suffix = `The run has completed ${progress.completed}/${progress.total} steps using fictional public-demo evidence only.`;
  if (scenario.id === "material-to-risk") {
    return `Recommendation: continue material anomaly review into contract-risk follow-up, request linked evidence before any simulated approval. ${suffix}`;
  }
  if (scenario.id === "contract-payment") {
    return `Recommendation: hold payment approval until service period, paid progress and acceptance evidence are reviewed by the HQ cost role. ${suffix}`;
  }
  return `Recommendation: keep vendor access limited; cross-region exposure and amount details remain masked while Q&A stays role-scoped. ${suffix}`;
}

function moduleLabel(id) {
  return t(modules.find((module) => module.id === id)?.label || id);
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
    .map((option) => `<option value="${option}" ${option === current ? "selected" : ""}>${t(option)}</option>`)
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
            <span>${t("Open Demo")}</span>
          </div>
        </div>
        <nav class="nav-list" aria-label="Demo modules">
          ${modules
            .map(
              (item) => `
                <button class="${cls("nav-item", item.id === state.active && "is-active")}" data-nav="${item.id}">
                  <span class="nav-icon">${item.short}</span>
                  <span>${t(item.label)}</span>
                </button>
              `,
            )
            .join("")}
        </nav>
        <div class="safety-box">
          <strong>${t("Demo Boundary")}</strong>
          <span>${t("Front-end mock only")}</span>
          <span>${t("No database")}</span>
          <span>${t("No secrets")}</span>
        </div>
      </aside>
      <main class="workspace">
        <header class="topbar">
          <div>
            <p class="eyebrow">${t(module.summary)}</p>
            <h1>${t(module.label)}</h1>
          </div>
          <div class="topbar-actions">
            <label>
              <span>${t("Region")}</span>
              <select id="regionSelect">${optionList(portfolio.regions, state.region)}</select>
            </label>
            <label>
              <span>${t("Project")}</span>
              <select id="projectSelect">${optionList(portfolio.projects, state.project)}</select>
            </label>
            <div class="language-toggle" role="group" aria-label="Language">
              <button class="${state.language === "zh" ? "is-active" : ""}" data-lang="zh">中文</button>
              <button class="${state.language === "en" ? "is-active" : ""}" data-lang="en">EN</button>
            </div>
            <span class="mock-pill">${t("Mock Data")}</span>
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
              <span>${t(item.label)}</span>
              <strong>${item.value}</strong>
              <small>${t(item.delta || item.trend || "")}</small>
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

function renderScenarioCards() {
  return `
    <div class="scenario-card-grid">
      ${scenarioJourneys
        .map(
          (scenario) => {
            const run = scenarioRun(scenario);
            const progress = scenarioProgress(scenario, run);
            return `
              <article class="${cls("scenario-card", scenario.id === state.activeScenario && "is-active")}">
                <div class="scenario-card-head">
                  <span>${t(progress.status)}</span>
                  <strong>${scenario.impact}</strong>
                </div>
                <h3>${t(scenario.title)}</h3>
                <p>${t(scenario.summary)}</p>
                ${progressBar(progress.percent, progress.percent === 100 ? "good" : "warning")}
                <div class="scenario-card-meta">
                  <span>${t("Owner")}: ${t(scenario.owner)}</span>
                  <span>${progress.completed}/${progress.total} ${t("Completed steps")}</span>
                </div>
                <button class="primary-action" data-scenario="${scenario.id}">${t(scenario.id === state.activeScenario ? "Continue scenario" : "Start scenario")}</button>
              </article>
            `;
          },
        )
        .join("")}
    </div>
  `;
}

function contractActionText() {
  if (state.language === "en") return state.contractAction;
  const contract = state.contractAction.match(/DEMO-CT-\d{4}-\d{3}/)?.[0] || state.selectedContractNo;
  if (state.contractAction.startsWith("Selected")) {
    return `已选择 ${contract} 进行模拟复核。`;
  }
  if (state.contractAction.startsWith("Create review task")) {
    return `已为 ${contract} 记录创建复核任务。`;
  }
  if (state.contractAction.startsWith("Request evidence")) {
    return `已为 ${contract} 记录索要资料动作。`;
  }
  if (state.contractAction.startsWith("Simulate approval")) {
    return `已为 ${contract} 记录模拟审批动作。`;
  }
  return "打开风险队列，选择合同，并模拟复核动作。";
}

function scenarioActionText() {
  if (state.language === "en") return state.scenarioAction;
  const scenario = activeScenario();
  const step = activeScenarioStep(scenario);
  if (state.scenarioAction.startsWith("Selected")) {
    return `已切换到「${t(scenario.title)}」业务场景。`;
  }
  if (state.scenarioAction.startsWith("Step")) {
    return `已定位到「${t(step.label)}」步骤。`;
  }
  if (state.scenarioAction.startsWith("Action")) {
    const action = state.scenarioAction.replace(/^Action "/, "").replace(/" simulated\.$/, "");
    return `已模拟「${t(action)}」动作。`;
  }
  if (state.scenarioAction.startsWith("Moved")) {
    return `已推进到「${t(step.label)}」步骤。`;
  }
  return t(state.scenarioAction);
}

function scenarioTone(stateText) {
  if (stateText === "Done") return "tone-good";
  if (stateText === "Current") return "tone-warning";
  if (stateText === "Ready for management review") return "tone-good";
  if (stateText === "Requires more evidence") return "tone-warning";
  return "tone-neutral";
}

function renderPortal() {
  return `
    ${kpiCards(portalStats)}
    <section class="command-grid" aria-label="Portfolio command center">
      ${commandCenter
        .map(
          (item) => `
            <article class="${cls("command-card", toneClass(item.tone))}">
              <span>${t(item.label)}</span>
              <strong>${item.value}</strong>
              <small>${t(item.meta)}</small>
            </article>
          `,
        )
        .join("")}
    </section>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>${t("Guided scenario paths")}</h2>
          <p>${t("Module views remain available, but the demo now leads with end-to-end work scenes.")}</p>
        </div>
        <button class="primary-action" data-nav="scenarios">${t("Business Scenario Demo")}</button>
      </div>
      ${renderScenarioCards()}
    </section>
    <div class="portal-grid">
      <section class="panel panel-large">
        <div class="panel-head">
          <div>
            <h2>${t("Operations Portal")}</h2>
            <p>${portfolio.asOf}</p>
          </div>
          <span class="status-chip">${t("Local Preview")}</span>
        </div>
        <div class="module-grid">
          ${modules
            .filter((item) => item.id !== "portal")
            .map(
              (item) => `
                <button class="module-card" data-nav="${item.id}">
                  <span class="module-icon">${item.short}</span>
                  <strong>${t(item.label)}</strong>
                  <small>${t(item.summary)}</small>
                </button>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>${t("Module Health")}</h2>
            <p>${t("Portfolio-scale public demo snapshot")}</p>
          </div>
        </div>
        ${renderTable(
          ["Module", "Coverage", "Signal", "Health"],
          moduleHealth.map((item) => [
            t(item.module),
            t(item.coverage),
            t(item.signal),
            `<span class="${cls("badge", item.health === "Good" ? "tone-good" : "tone-warning")}">${t(item.health)}</span>`,
          ]),
        )}
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>${t("Sanitization Rules")}</h2>
            <p>${t("Public-safe demo guardrails")}</p>
          </div>
        </div>
        <ul class="rule-list">
          ${safetyRules.map((rule) => `<li>${t(rule)}</li>`).join("")}
        </ul>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>${t("Operations Feed")}</h2>
            <p>${t("Fictional control-center activity")}</p>
          </div>
        </div>
        <div class="feed-list">
          ${operationsFeed
            .map(
              (item) => `
                <article>
                  <time>${item.time}</time>
                  <strong>${t(item.event)}</strong>
                  <span>${t(item.owner)}</span>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
      <section class="panel panel-image">
        <div class="panel-head">
          <div>
            <h2>${t("Design Direction")}</h2>
            <p>${t("IMAGE-2 visual advisor output")}</p>
          </div>
        </div>
        <img src="./public/assets/design-direction.png" alt="Design mockup direction with fictional data" />
      </section>
    </div>
  `;
}

function renderScenarios() {
  const scenario = activeScenario();
  const step = activeScenarioStep(scenario);
  const run = scenarioRun(scenario);
  const progress = scenarioProgress(scenario, run);
  const stepState = scenarioStepState(step, state.activeScenarioStep, run);
  const currentModule = modules.find((module) => module.id === step.module);

  return `
    <section class="scenario-hero panel">
      <div>
        <p class="eyebrow">${t("Closed-loop engine")}</p>
        <h2>${t("Business Scenario Demo")}</h2>
        <p>${t("Module views remain available, but the demo now leads with end-to-end work scenes.")}</p>
      </div>
      <div class="scenario-hero-metrics">
        <article class="scenario-progress-panel">
          <span>${t("Closed-loop progress")}</span>
          <strong>${progress.completed}/${progress.total}</strong>
          ${progressBar(progress.percent, progress.percent === 100 ? "good" : "warning")}
        </article>
        ${scenario.metrics
          .map(
            (metric) => `
              <article>
                <span>${t(metric.label)}</span>
                <strong>${metric.value}</strong>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
    ${renderScenarioCards()}
    <div class="scenario-workbench">
      <section class="panel panel-large">
        <div class="panel-head">
          <div>
            <h2>${t(scenario.title)}</h2>
            <p>${t(scenario.summary)}</p>
          </div>
          <span class="${cls("badge", scenarioTone(progress.status))}">${t(progress.status)}</span>
        </div>
        <div class="scenario-timeline">
          ${scenario.steps
            .map(
              (item, index) => {
                const stateText = scenarioStepState(item, index, run);
                return `
                <button class="${cls("scenario-step", index === state.activeScenarioStep && "is-active", stateText === "Done" && "is-done")}" data-scenario-step="${index}">
                  <span>${index + 1}</span>
                  <strong>${t(item.label)}</strong>
                  <small>${t(stateText)} · ${t(item.time)}</small>
                </button>
              `;
              },
            )
            .join("")}
        </div>
        <div class="scenario-detail-grid">
          <article class="scenario-detail-card">
            <span>${t("Step detail")}</span>
            <strong>${t(step.label)}</strong>
            <p>${t(step.result)}</p>
          </article>
          <article class="scenario-detail-card">
            <span>${t("Linked modules")}</span>
            <strong>${moduleLabel(step.module)}</strong>
            <p>${currentModule ? t(currentModule.summary) : ""}</p>
            <button class="mini-action" data-scenario-module="${step.module}">${t("Open linked module")}</button>
          </article>
        </div>
        <div class="scenario-chain">
          <div class="scenario-chain-head">
            <div>
              <h3>${t("Evidence Chain")}</h3>
              <p>${t("Public-safe evidence chain")}</p>
            </div>
            <span>${progress.percent}%</span>
          </div>
          <div class="evidence-chain">
            ${scenario.steps
              .map((item, index) => {
                const stateText = scenarioStepState(item, index, run);
                return `
                  <button class="${cls("chain-node", stateText === "Done" && "is-done", index === state.activeScenarioStep && "is-active")}" data-scenario-step="${index}">
                    <span>${index + 1}</span>
                    <strong>${t(item.label)}</strong>
                    <small>${moduleLabel(item.module)} · ${t(stateText)}</small>
                    <p>${item.evidence.map((evidence) => maskedEvidence(evidence)).join(" / ")}</p>
                  </button>
                `;
              })
              .join("")}
          </div>
        </div>
      </section>
      <aside class="panel detail-panel scenario-side">
        <div class="panel-head">
          <div>
            <h2>${t("Role View")}</h2>
            <p>${t("Role perspective")}</p>
          </div>
          <span class="${cls("badge", scenarioTone(stepState))}">${t(stepState)}</span>
        </div>
        <div class="role-toggle scenario-role-toggle" role="group" aria-label="Scenario role view">
          ${scenarioRoles
            .map(
              (role) => `
                <button class="${role === state.scenarioRole ? "is-active" : ""}" data-scenario-role="${role}">
                  ${t(role)}
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="action-result">
          <strong>${t("Visible modules")}</strong>
          <span>${t(roleScopeText())}</span>
        </div>
        <h3>${t("Current step evidence")}</h3>
        <div class="evidence-list">
          ${step.evidence.map((item) => `<span>${maskedEvidence(item)}</span>`).join("")}
        </div>
        <div class="module-link-row">
          ${scenario.modules
            .map(
              (moduleId) => `
                <button class="${moduleId === step.module ? "is-active" : ""}" data-scenario-module="${moduleId}">
                  ${moduleLabel(moduleId)}
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="scenario-actions">
          <h3>${t("Mock actions")}</h3>
          ${step.actions.map((action) => `<button data-scenario-action="${action}">${t(action)}</button>`).join("")}
        </div>
        <div class="inline-actions">
          <button data-scenario-prev>${t("Previous step")}</button>
          <button class="primary-action" data-scenario-next>${t("Next step")}</button>
          <button data-scenario-decision>${t("Generate decision summary")}</button>
          <button data-scenario-reset>${t("Reset scenario run")}</button>
        </div>
        <div class="action-result">
          <strong>${t("Current business action")}</strong>
          <span>${scenarioActionText()}</span>
        </div>
        <div class="scenario-log">
          <div class="scenario-chain-head">
            <div>
              <h3>${t("Operation Log")}</h3>
              <p>${t("Last actions")}</p>
            </div>
          </div>
          ${run.log
            .map(
              (entry) => `
                <article>
                  <time>${entry.time}</time>
                  <div>
                    <strong>${t(entry.action)}</strong>
                    <span>${t(entry.actor)} · ${t(entry.step)}</span>
                    <p>${t(entry.result)}</p>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
        <div class="decision-summary">
          <div class="scenario-chain-head">
            <div>
              <h3>${t("Decision Summary")}</h3>
              <p>${t("Decision draft is generated from completed mock steps only.")}</p>
            </div>
          </div>
          <p>${run.decision ? scenarioDecisionText(scenario, progress) : t("No decision summary generated yet.")}</p>
          <small>${t("Decision summary uses fictional metrics and sanitized evidence only.")}</small>
        </div>
      </aside>
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
            <h2>${t("Monthly Cost Execution")}</h2>
            <p>${t("Budget, actual and paid values are fictional")}</p>
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
            <h2>${t("Action Queue")}</h2>
            <p>${t("Variance review workflow")}</p>
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
                  ${t(action)}
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="action-result">
          <strong>${t(activeAction)}</strong>
          <span>${scopedRows.length} ${state.language === "zh" ? "条模拟记录可复核" : "scoped rows ready for mock review."}</span>
        </div>
      </section>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>${t("Cost Subjects")}</h2>
          <p>${t("Scoped by")} ${formatJoin([state.region, state.project])}</p>
        </div>
      </div>
      ${renderTable(
        ["Area", "Project", "Subject", "Budget", "Actual", "Variance", "Owner"],
        scopedRows.map((row) => [
          t(row.area),
          t(row.project),
          t(row.subject),
          row.budget,
          row.actual,
          `<span class="${cls("badge", toneClass(row.tone))}">${row.variance}</span>`,
          t(row.owner),
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
            <h2>${t("Material Price Library")}</h2>
            <p>${t("Reviewer-confirmed synthetic prices")}</p>
          </div>
          <input id="materialSearch" class="search-input" value="${state.materialQuery}" placeholder="${t("Search material or supplier")}" />
        </div>
        ${renderTable(
          ["Material", "Category", "Unit", "City", "Supplier", "Current", "Tax", "Change", "Status"],
          rows.map((item) => [
            t(item.name),
            t(item.category),
            item.unit,
            t(item.city),
            t(item.supplier),
            item.current,
            item.tax,
            item.change,
            `<span class="${cls("badge", item.status === "Confirmed" ? "tone-good" : "tone-warning")}">${t(item.status)}</span>`,
          ]),
        )}
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>${t("AI Import Mock")}</h2>
            <p>${t("Candidate generation, edit and confirm")}</p>
          </div>
        </div>
        <ol class="step-list interactive-steps">
          ${steps
            .map(
              (step, index) => `
                <li class="${index + 1 <= state.materialStep ? "is-complete" : ""}">
                  <strong>${t(step)}</strong>
                  <span>${t(index + 1 === state.materialStep ? "Current mock step" : index + 1 < state.materialStep ? "Completed in browser state" : "Pending")}</span>
                </li>
              `,
            )
            .join("")}
        </ol>
        <div class="inline-actions">
          <button data-material-step="reset">${t("Reset")}</button>
          <button class="primary-action" data-material-step="next">${t(state.materialStep >= 4 ? "Run Again" : "Advance Step")}</button>
        </div>
        <div class="detail-card">
          <span>${t("Selected Candidate")}</span>
          <strong>${t(selectedCandidate.extracted)}</strong>
          <small>${selectedCandidate.source} - ${selectedCandidate.confidence} confidence</small>
        </div>
      </section>
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>${t("Recognition Candidates")}</h2>
          <p>${t("No external model is called in this browser-only demo")}</p>
        </div>
      </div>
      ${renderTable(
        ["Source File", "Extracted Item", "Confidence", "Reviewer Action", "State"],
        materialCandidates.map((item) => [
          item.source,
          `<button class="link-button" data-candidate="${item.extracted}">${t(item.extracted)}</button>`,
          item.confidence,
          t(item.action),
          state.confirmedCandidates.has(item.extracted)
            ? `<span class="badge tone-good">${t("Confirmed")}</span>`
            : `<button class="mini-action" data-confirm-candidate="${item.extracted}">${t("Confirm")}</button>`,
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
          <h2>${t("Regional Cost Command Center")}</h2>
          <p>${t("12-region synthetic benchmark model with prioritized action value")}</p>
        </div>
        <span class="status-chip">${t("$4.30M demo savings pool")}</span>
      </div>
      <div class="action-impact-grid">
        ${costMapActions
          .slice(0, 4)
          .map(
            (item) => `
              <article class="${item.action === state.activeCostAction ? "is-active" : ""}">
                <span>${t(item.action)}</span>
                <strong>${item.impact}</strong>
                <small>${t(item.scope)} - ${t(item.owner)}</small>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
    <section class="panel panel-large">
      <div class="panel-head">
        <div>
          <h2>${t("Cost Pressure Heat Matrix")}</h2>
          <p>${t("Fictional score by region and major operating category")}</p>
        </div>
      </div>
      <div class="heatmap" role="table" aria-label="Cost pressure heat matrix">
        <div class="heat-row heat-head" role="row">
          <span role="columnheader">${t("Region")}</span>
          ${heatHeaders.map((header) => `<span role="columnheader">${t(header)}</span>`).join("")}
        </div>
        ${costMapMatrix
          .map(
            (row) => `
              <div class="heat-row" role="row">
                <strong role="rowheader">${t(row.region)}</strong>
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
          <span>${t("Selected Signal")}</span>
          <strong>${formatJoin([state.selectedHeat.region, state.selectedHeat.category])}</strong>
          <small>${t("Pressure score")} ${heat.score}, ${t("priority")} ${t(heatTone(heat.score))}</small>
        </article>
        <article>
          <span>${t("Suggested Action")}</span>
          <strong>${t(activeAction.action)}</strong>
          <small>${activeAction.impact} ${t("estimated impact, owner")} ${t(activeAction.owner)}</small>
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
                  <h2>${t(item.region)}</h2>
                  <p>${t("Benchmark")} ${item.benchmark}</p>
                </div>
                <span class="${cls("badge", item.grade === "A" ? "tone-good" : item.grade === "B" ? "tone-warning" : "tone-danger")}">Grade ${item.grade}</span>
              </div>
              <div class="metric-line">
                <span>${t("Variance")}</span>
                <strong>${item.variance}</strong>
              </div>
              <div class="driver-list">
                ${item.drivers.map((driver) => `<span>${t(driver)}</span>`).join("")}
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>${t("Standard Item Benchmarks")}</h2>
          <p>${t("Current effective price only, no historical source files")}</p>
        </div>
      </div>
      ${renderTable(
        ["Cost Item", "Demo Standard", "Current Price", "State", "Progress"],
        costMapItems.map((item, index) => [
          t(item.item),
          item.standard,
          item.current,
          `<span class="${cls("badge", item.state === "Normal" ? "tone-good" : "tone-warning")}">${t(item.state)}</span>`,
          progressBar(72 - index * 8, item.state === "Normal" ? "good" : "warning"),
        ]),
      )}
    </section>
    <section class="panel">
      <div class="panel-head">
        <div>
          <h2>${t("Prioritized Action Pool")}</h2>
          <p>${t("Demo recommendations for procurement, contract and engineering follow-up")}</p>
        </div>
      </div>
      ${renderTable(
        ["Action", "Estimated Impact", "Scope", "Owner"],
        costMapActions.map((item) => [
          `<button class="link-button" data-cost-action="${item.action}">${t(item.action)}</button>`,
          item.impact,
          t(item.scope),
          t(item.owner),
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
            <h2>${t("Payment Progress Exposure")}</h2>
            <p>${rows.length} ${t("mock contracts in current view")}</p>
          </div>
          <div class="segmented" role="group" aria-label="Risk filter">
            ${["All", "High", "Medium", "Low"]
              .map((risk) => `<button class="${state.contractRisk === risk ? "is-active" : ""}" data-risk="${risk}">${t(risk)}</button>`)
              .join("")}
          </div>
        </div>
        <input id="contractSearch" class="search-input full-width" value="${state.contractSearch}" placeholder="${t("Search contract, vendor or reason")}" />
        ${renderTable(
          ["Contract", "Project", "Vendor", "Category", "Amount", "Paid", "Risk", "Reason"],
          rows.map((item) => [
            `<button class="link-button" data-contract="${item.no}">${item.no}</button>`,
            t(item.project),
            t(item.vendor),
            t(item.category),
            item.amount,
            item.paid,
            `<span class="${cls("badge", riskTone(item.risk))}">${t(item.risk)}</span>`,
            t(item.reason),
          ]),
        )}
      </section>
      <aside class="panel detail-panel">
        <div class="panel-head">
          <div>
            <h2>${t("Contract Detail")}</h2>
            <p>${t("Click a row to update this mock drawer")}</p>
          </div>
          <span class="${cls("badge", riskTone(selected.risk))}">${t(selected.risk)}</span>
        </div>
        <div class="detail-card">
          <span>${selected.no}</span>
          <strong>${t(selected.project)}</strong>
          <small>${t(selected.vendor)} - ${t(selected.category)}</small>
        </div>
        <div class="metric-line">
          <span>${t("Amount")}</span>
          <strong>${selected.amount}</strong>
        </div>
        <div class="metric-line">
          <span>${t("Paid Progress")}</span>
          <strong>${selected.paid}</strong>
        </div>
        ${progressBar(paid, selected.risk === "High" ? "warning" : "good")}
        <ol class="timeline">
          <li class="is-done"><strong>${t("Signed")}</strong><span>${t("Mock contract ledger created")}</span></li>
          <li class="is-done"><strong>${t("Service Period")}</strong><span>${t("Monthly service tracking active")}</span></li>
          <li class="${paid >= 70 ? "is-done" : "is-current"}"><strong>${t("Payment Review")}</strong><span>${t(selected.reason)}</span></li>
          <li><strong>${t("Closeout")}</strong><span>${t("Pending final synthetic evidence")}</span></li>
        </ol>
        <div class="inline-actions">
          <button data-contract-action="Create review task">${t("Create Task")}</button>
          <button data-contract-action="Request evidence">${t("Request Evidence")}</button>
          <button class="primary-action" data-contract-action="Simulate approval">${t("Simulate Approval")}</button>
        </div>
        <div class="action-result">
          <strong>${t("Latest Mock Action")}</strong>
          <span>${contractActionText()}</span>
        </div>
      </aside>
    </div>
    <div class="two-column">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>${t("Risk Logic")}</h2>
            <p>${t("First-stage public demo rules")}</p>
          </div>
        </div>
        <ul class="rule-list">
          <li>${t("Monthly service contracts track paid-through month.")}</li>
          <li>${t("Other contracts track cumulative payment ratio.")}</li>
          <li>${t("Risk labels are generated from fake amounts and dates.")}</li>
        </ul>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>${t("Audit Boundary")}</h2>
            <p>${t("What this demo does not include")}</p>
          </div>
        </div>
        <ul class="rule-list">
          <li>${t("No real contract files.")}</li>
          <li>${t("No real payment ledger.")}</li>
          <li>${t("No production attachment workflow.")}</li>
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
            <h2>${t("Smart Q&A Workbench")}</h2>
            <p>${t("Local match first; vision and deep answer are explicit actions")}</p>
          </div>
          <div class="segmented">
            ${["Local match", "Vision extract", "Deep answer"]
              .map((mode) => `<button class="${state.qaMode === mode ? "is-active" : ""}" data-qa-mode="${mode}">${t(mode)}</button>`)
              .join("")}
          </div>
        </div>
        <div class="chat-panel">
          <div class="chat user">${t(state.qaQuestion)}</div>
          <div class="chat system">
            <strong>${t(currentCase.answer)}</strong>
            <span>${t(currentCase.evidence)}</span>
          </div>
        </div>
        <div class="input-row">
          <input id="qaInput" value="${state.qaQuestion}" aria-label="Mock question" />
          <button id="qaAsk">${t("Get Answer")}</button>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>${t("Knowledge Cases")}</h2>
            <p>${t("Fictional examples only")}</p>
          </div>
        </div>
        <div class="case-list">
          ${qaCases
            .map(
              (item) => `
                <article>
                  <span>${t(item.flow)}</span>
                  <strong>${t(item.question)}</strong>
                  <small>${t(item.evidence)}</small>
                  <button class="mini-action" data-qa-case="${qaCases.indexOf(item)}">${t("Use Case")}</button>
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
          <h2>${t("AI Audit Trail")}</h2>
          <p>${t("Shows cost-control behavior without real model calls")}</p>
        </div>
      </div>
      ${renderTable(
        ["Action", "State", "Note"],
        qaAudit.map((item) => [
          t(item.type),
          `<span class="badge tone-neutral">${t(item.state)}</span>`,
          t(item.note),
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
            <h2>${t("Role Matrix")}</h2>
            <p>${t("Select a role to preview masked access")}</p>
          </div>
        </div>
        ${renderTable(
          ["Role", "Cost", "Materials", "Contracts", "Smart Q&A", "Accounts"],
          roles.map((item) => [
            `<button class="link-button" data-role="${item.role}">${t(item.role)}</button>`,
            t(item.cost),
            t(item.materials),
            t(item.contracts),
            t(item.qa),
            t(item.account),
          ]),
        )}
      </section>
      <aside class="panel detail-panel">
        <div class="panel-head">
          <div>
            <h2>${t("Permission Preview")}</h2>
            <p>${t("Current selected demo role")}</p>
          </div>
          <span class="status-chip">${t(selectedRole.role)}</span>
        </div>
        <div class="permission-preview">
          <article><span>${t("Cost")}</span><strong>${t(selectedRole.cost)}</strong></article>
          <article><span>${t("Materials")}</span><strong>${t(selectedRole.materials)}</strong></article>
          <article><span>${t("Contracts")}</span><strong>${t(selectedRole.contracts)}</strong></article>
          <article><span>${t("Smart Q&A")}</span><strong>${t(selectedRole.qa)}</strong></article>
          <article><span>${t("Accounts")}</span><strong>${t(selectedRole.account)}</strong></article>
        </div>
        <div class="mask-demo">
          <span>${t("Contract Amount")}</span>
          <strong>${selectedRole.contracts === "Limited" || selectedRole.contracts === "None" ? "$***,***" : "$96.8M"}</strong>
          <small>${t(selectedRole.contracts === "Limited" || selectedRole.contracts === "None" ? "Masked by selected role" : "Visible in demo role")}</small>
        </div>
      </aside>
    </div>
    <div class="two-column">
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>${t("Approval Flow")}</h2>
            <p>${t("Mock account governance")}</p>
          </div>
        </div>
        <ol class="step-list">
          <li><strong>${t("Request")}</strong><span>${t("Operator submits scoped access")}</span></li>
          <li><strong>${t("Review")}</strong><span>${t("HQ reviewer validates role and project scope")}</span></li>
          <li><strong>${t("Activate")}</strong><span>${t("Admin grants demo access")}</span></li>
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
          <tr>${headers.map((header) => `<th>${t(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) =>
                `<tr>${row
                  .map((cell) => {
                    const value = String(cell ?? "");
                    return `<td>${value.includes("<") ? value : t(value)}</td>`;
                  })
                  .join("")}</tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function render() {
  const views = {
    portal: renderPortal,
    scenarios: renderScenarios,
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
  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      const scenario = scenarioJourneys.find((item) => item.id === button.dataset.scenario) || scenarioJourneys[0];
      state.activeScenario = scenario.id;
      state.activeScenarioStep = scenario.currentStep || 0;
      state.scenarioAction = `Selected "${scenario.title}" scenario.`;
      state.active = "scenarios";
      window.location.hash = "scenarios";
      render();
    });
  });

  document.querySelectorAll("[data-scenario-step]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeScenarioStep = Number.parseInt(button.dataset.scenarioStep, 10) || 0;
      const step = activeScenarioStep();
      state.scenarioAction = `Step "${step.label}" selected.`;
      render();
    });
  });

  document.querySelectorAll("[data-scenario-action]").forEach((button) => {
    button.addEventListener("click", () => {
      completeScenarioStep();
      addScenarioLog(button.dataset.scenarioAction, activeScenarioStep().result);
      state.scenarioAction = `Action "${button.dataset.scenarioAction}" simulated.`;
      render();
    });
  });

  document.querySelectorAll("[data-scenario-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const scenario = activeScenario();
      completeScenarioStep();
      addScenarioLog("Step completed", activeScenarioStep(scenario).result);
      state.activeScenarioStep = Math.min(state.activeScenarioStep + 1, scenario.steps.length - 1);
      state.scenarioAction = `Moved to "${activeScenarioStep(scenario).label}".`;
      render();
    });
  });

  document.querySelectorAll("[data-scenario-prev]").forEach((button) => {
    button.addEventListener("click", () => {
      const scenario = activeScenario();
      state.activeScenarioStep = Math.max(state.activeScenarioStep - 1, 0);
      state.scenarioAction = `Moved to "${activeScenarioStep(scenario).label}".`;
      render();
    });
  });

  document.querySelectorAll("[data-scenario-module]").forEach((button) => {
    button.addEventListener("click", () => {
      setActive(button.dataset.scenarioModule);
    });
  });

  document.querySelectorAll("[data-scenario-role]").forEach((button) => {
    button.addEventListener("click", () => {
      state.scenarioRole = button.dataset.scenarioRole;
      state.selectedRole = state.scenarioRole;
      state.scenarioAction = "Role view switched";
      addScenarioLog("Role view switched", roleScopeText());
      render();
    });
  });

  document.querySelectorAll("[data-scenario-decision]").forEach((button) => {
    button.addEventListener("click", () => {
      const scenario = activeScenario();
      const run = scenarioRun(scenario);
      completeScenarioStep();
      run.decision = true;
      addScenarioLog("Decision draft generated", scenarioDecisionText(scenario, scenarioProgress(scenario, run)));
      state.scenarioAction = "Decision draft generated";
      render();
    });
  });

  document.querySelectorAll("[data-scenario-reset]").forEach((button) => {
    button.addEventListener("click", () => {
      const scenario = activeScenario();
      state.scenarioRuns[scenario.id] = createScenarioRuns()[scenario.id];
      state.activeScenarioStep = scenario.currentStep || 0;
      state.scenarioAction = "Scenario run reset";
      render();
    });
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      state.language = button.dataset.lang;
      localStorage.setItem("demo-language", state.language);
      render();
    });
  });

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
