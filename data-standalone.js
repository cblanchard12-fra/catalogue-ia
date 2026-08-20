if (!window.__portfolioDataLoaded__) {
window.__portfolioDataLoaded__ = true;
// Données et logique métier du portefeuille d'initiatives IA
// Aucune UI ici — uniquement modèle de données, calculs ROI et scoring.

const STORAGE_KEY = 'ia-portfolio-data-v1';

const STATUS_LIST = ['Déployé', 'En test', 'À tester', 'Non évalué'];
const RISK_LIST = ['Faible', 'Moyen', 'Élevé', 'À évaluer'];
const MOSCOW_LIST = ['Must', 'Should', 'Could', "Won't", 'À qualifier'];
const LEVEL_LIST = ['L1', 'L2', 'L3', 'L4'];
const SOUVERAINETE_LIST = ['Souverain', 'Non souverain', 'Interne', 'À définir'];

const MACRO_DOMAINS = [
  { id: 'access', name: 'DWP - Accessibility', short: 'Accessibility' },
  { id: 'advisory', name: 'DWP - Advisory', short: 'Advisory' },
  { id: 'platforms', name: 'DWP - Platforms', short: 'Platforms' },
  { id: 'experience', name: 'DWP - Experience', short: 'Experience' },
  { id: 'services', name: 'DWP - Services', short: 'Services' },
  { id: 'collab', name: 'DWP - Intelligent Collaboration', short: 'Intelligent Collab.' },
  { id: 'asd', name: 'DWP - Adaptive Service Desk', short: 'Adaptive Service Desk' },
];

function uid(prefix) {
  return prefix + '-' + Math.random().toString(36).slice(2, 9);
}

const TODAY = '2026-07-07';

function mk(o) {
  const status = o.status || 'Non évalué';
  const heuristics = {
    'Déployé': { moscow: 'Must', level: 'L1', risk: 'Faible' },
    'En test': { moscow: 'Should', level: 'L2', risk: 'Moyen' },
    'À tester': { moscow: 'Could', level: 'L3', risk: 'Moyen' },
    'Non évalué': { moscow: 'À qualifier', level: 'L4', risk: 'À évaluer' },
  }[status];

  return {
    id: o.id,
    macroDomain: o.macroDomain,
    subDomain: o.subDomain || '',
    editor: o.editor || '',
    product: o.product || '',
    tool: o.tool || o.product || '',
    model: o.model || 'Éditeur',
    status,
    souverainete: o.souverainete || 'À définir',
    marker: o.marker || { symbol: '', color: '' },
    description: {
      description: o.description || '',
      useCase: o.useCase || '',
      businessValue: o.businessValue || '',
      targetPopulation: o.targetPopulation || '',
      comments: o.comments || '',
    },
    governance: {
      responsible: o.responsible || 'À définir',
      updateDate: o.updateDate || TODAY,
      source: o.source || "Recensement portefeuille IA (juillet 2026)",
      dependencies: o.dependencies || '',
      prerequisites: o.prerequisites || '',
    },
    prioritization: {
      moscow: o.moscow || heuristics.moscow,
      level: o.level || heuristics.level,
    },
    risksData: {
      level: o.riskLevel || heuristics.risk,
      blockers: o.blockers || [],
      watchPoints: o.watchPoints || [],
    },
    roi: {
      inputs: o.roiInputs || null,
      calcDate: o.roiInputs ? TODAY : null,
    },
    documentation: {
      items: o.docItems || [],
    },
  };
}

const DOC_CATEGORIES = ['Présentations', 'Cas clients', "Retours d'expérience", 'Documentation technique', 'Liens utiles'];

const PRODUCT_DOMAIN_MAP = {
  'Copilot Studio — Workflows DWP': 'DWP - Platforms',
  'ChatGPT Enterprise': 'DWP - Advisory',
  'Microsoft 365 Copilot': 'DWP - Experience',
  'Google Gemini': 'DWP - Advisory',
  'Avatar Avant-Vente Marie': 'DWP - Experience',
  'Plateforme avatars & coaching': 'DWP - Accessibility',
  'Plateforme AI Employees': 'DWP - Intelligent Collaboration',
  "L'Assistant": 'DWP - Accessibility',
  'Ticket Coach': 'DWP - Adaptive Service Desk',
  'Smart Automation': 'DWP - Adaptive Service Desk',
  'Konverso AI Agents': 'DWP - Intelligent Collaboration',
  'SmartSI': 'DWP - Platforms',
  'Nexthink': 'DWP - Experience',
  'KYP.ai Process Intelligence Platform': 'DWP - Experience',
  'Autopilot / UiPath AI': 'DWP - Services',
  'n8n': 'DWP - Platforms',
  'Pay-i ROI Optimization Platform': 'DWP - Platforms',
  'Poolside Enterprise': 'DWP - Services',
  'AutoGenAI': 'DWP - Advisory',
  'Digital Engineer': 'DWP - Intelligent Collaboration',
  'Digital Transformation Engineer': 'DWP - Services',
};

function migrateInitiativeDomain(ini) {
  const validNames = MACRO_DOMAINS.map(d => d.name);
  if (validNames.includes(ini.macroDomain)) return ini;
  const mapped = PRODUCT_DOMAIN_MAP[ini.product];
  return Object.assign({}, ini, { macroDomain: mapped || MACRO_DOMAINS[0].name });
}

function seedInitiatives() {
  const D = MACRO_DOMAINS;
  const access = D[0].name, advisory = D[1].name, platforms = D[2].name, experience = D[3].name, services = D[4].name, collab = D[5].name, asd = D[6].name;
  return [
    mk({ id: uid('ini'), macroDomain: platforms, subDomain: 'Agents & workflows utilisateurs', editor: 'Microsoft', product: 'Copilot Studio — Workflows DWP', model: 'Éditeur', status: 'Déployé', souverainete: 'Non souverain', useCase: "Création d'agents et automatisation de tâches simples par les équipes DWP", comments: "Freins DLP, sécurité et formation, complexité de création d'agent.", riskLevel: 'Moyen', blockers: ['DLP et sécurité des données', 'Montée en compétence des équipes'] }),
    mk({ id: uid('ini'), macroDomain: advisory, subDomain: 'Assistant générique entreprise', editor: 'Mistral AI', product: 'ChatGPT Enterprise', model: 'Éditeur', status: 'Non évalué', souverainete: 'Non souverain', useCase: 'Assistants génériques, rédaction, synthèse, analyse de documents et prototypage rapide.', comments: 'Benchmark utile face à Microsoft 365 Copilot.' }),
    mk({ id: uid('ini'), macroDomain: experience, subDomain: 'Assistant utilisateur M365', editor: 'Microsoft', product: 'Microsoft 365 Copilot', model: 'Éditeur', status: 'Déployé', souverainete: 'Non souverain', useCase: 'Rédaction, synthèse, recherche, réunions, agents personnels et assistance contextuelle dans M365.', comments: 'Produit cœur pour workplace AI.', riskLevel: 'Faible', moscow: 'Must' }),
    mk({ id: uid('ini'), macroDomain: advisory, subDomain: 'Assistant générique entreprise', editor: 'Google', product: 'Google Gemini', model: 'Éditeur', status: 'Non évalué', souverainete: 'Non souverain', useCase: 'Assistant IA multimodal pour rédaction, synthèse, analyse de documents, recherche et génération de contenu.', comments: 'Concurrent direct de ChatGPT Enterprise et Microsoft 365 Copilot ; intégration possible avec Google Workspace.' }),
    mk({ id: uid('ini'), macroDomain: experience, subDomain: 'Avant-vente & knowledge assistant', editor: 'Atos', product: 'Avatar Avant-Vente Marie', model: 'Éditeur', status: 'En test', souverainete: 'À définir', useCase: "Avatar IA pour interroger dossiers AVV, retrouver engagements/prix/arguments, onboarding et soutenance de dossier.", comments: 'Technologies OSCAR DC (Marie) et Microsoft Speech-to-Text identifiées.' }),
    mk({ id: uid('ini'), macroDomain: access, subDomain: 'Partenariat / avatar training / coaching', editor: 'Concorde AI', product: 'Plateforme avatars & coaching', model: 'Éditeur', status: 'À tester', souverainete: 'Non souverain', useCase: 'Entraînement via avatars IA, simulation temps réel et coaching dans banque/assurance.', comments: 'LLM + RAG + WebRTC, modes SaaS / tenant dédié / self-host.' }),
    mk({ id: uid('ini'), macroDomain: collab, subDomain: 'AI employees / agents no-code', editor: 'EMA', product: 'Plateforme AI Employees', model: 'Éditeur', status: 'À tester', souverainete: 'Non souverain', useCase: "Automatisation de workflows complexes via AI employees préconstruits et création no-code d'agents.", comments: 'Projet souverain Hermes mentionné ; budget et planning à définir.' }),
    mk({ id: uid('ini'), macroDomain: access, subDomain: 'Assistant IA souverain (secteur public)', editor: "La Suite Numérique", product: "L'Assistant", model: 'Open source', status: 'À tester', souverainete: 'Souverain', useCase: 'Assistant IA open source destiné aux agents publics, hébergement souverain.', comments: 'À qualifier pour un usage interne DWP.' }),

    mk({ id: uid('ini'), macroDomain: asd, subDomain: 'Agent augmentation Service Desk', editor: 'Atos', product: 'Ticket Coach', model: 'Interne + éditeur', status: 'À tester', souverainete: 'Souverain', useCase: 'Assistant contextuel pour agents Service Desk dans ServiceNow via extension Chrome.', comments: "Outil réalisé par l'équipe de Toulouse ; industrialisation à définir." }),
    mk({ id: uid('ini'), macroDomain: asd, subDomain: 'Automatisation tickets', editor: 'Atos (UiPath)', product: 'Smart Automation', model: 'Éditeur', status: 'Déployé', souverainete: 'Non souverain', useCase: 'Réception, qualification, dispatch et résolution automatique de tickets et incidents ; définition via IA générative.', comments: 'UiPath + IA générative ; gains annoncés -20% tickets an 1, -41% an 2.', riskLevel: 'Faible', moscow: 'Must' }),
    mk({ id: uid('ini'), macroDomain: collab, subDomain: 'Front-door support conversationnel / agent assist', editor: 'Konverso', product: 'Konverso AI Agents', model: 'Éditeur', status: 'À tester', souverainete: 'Souverain', useCase: 'Agents IA no-code pour support IT, HR et customer support, chatbot/voicebot ITSM avec intégration ServiceNow, Teams, SharePoint et base de connaissances.', comments: 'Très pertinent pour support employé et IT Service Desk, avec résidence des données en Europe et orientation conformité/GDPR.' }),

    mk({ id: uid('ini'), macroDomain: platforms, subDomain: 'Automation platform / orchestration smart operations', editor: 'Atos', product: 'SmartSI', model: 'Interne', status: 'En test', souverainete: 'Interne', useCase: 'Socle ou briques de smart operations / automatisation réutilisées pour workflows DWP, opérations SI et orchestration N0/N1.', comments: 'Déjà cité dans le catalogue existant comme brique réutilisable avec n8n, niveau de packaging à confirmer.' }),
    mk({ id: uid('ini'), macroDomain: experience, subDomain: 'DEX / endpoint analytics', editor: 'Nexthink', product: 'Nexthink', model: 'Éditeur', status: 'À tester', souverainete: 'Non souverain', useCase: "Analyse du poste de travail, détection proactive d'anomalies, pilotage expérience digitale, remédiation.", comments: 'Important pour le domaine admin workplace / DEX.' }),
    mk({ id: uid('ini'), macroDomain: experience, subDomain: 'Process intelligence / task mining / automation ROI', editor: 'KYP.ai', product: 'KYP.ai Process Intelligence Platform', model: 'Éditeur', status: 'À tester', souverainete: 'Non souverain', useCase: "Process intelligence, task mining et identification d'opportunités d'automatisation/agentic IA ; quantification du ROI et génération de rapports pour agents et workflows.", comments: "Pertinent pour l'industrialisation DWP, performance opérationnelle et ciblage des cas d'automatisation à plus forte valeur." }),
    mk({ id: uid('ini'), macroDomain: services, subDomain: 'RPA + agents', editor: 'UiPath', product: 'Autopilot / UiPath AI', model: 'Éditeur', status: 'Déployé', souverainete: 'Non souverain', useCase: "Automatisation de process IT et back-office, copilotage d'agents, orchestrations avec RPA existante.", comments: 'À lier aux cas d\'usage Smart Automation et runbook automation.', riskLevel: 'Faible' }),
    mk({ id: uid('ini'), macroDomain: platforms, subDomain: 'Workflow orchestration', editor: 'n8n', product: 'n8n', model: 'Open core', status: 'En test', souverainete: 'Interne', useCase: 'Orchestration simple de workflows DWP, automatisation N0/N1, réutilisation de briques SmartSI / SmartDesk.', comments: 'Objectif de rentabilité en 2 ans ; statut partenariat à clarifier.' }),

    mk({ id: uid('ini'), macroDomain: platforms, subDomain: 'AI FinOps / ROI governance / capacity management', editor: 'Pay-i', product: 'Pay-i ROI Optimization Platform', model: 'Éditeur', status: 'À tester', souverainete: 'Non souverain', useCase: 'Pilotage des coûts, de la capacité et du ROI des cas d\'usage GenAI/agents ; gouvernance financière multi-cas d\'usage et reporting exécutif.', comments: 'Plutôt outil transverse de gouvernance et FinOps IA que solution DWP en soi ; utile pour piloter un portefeuille d\'initiatives IA.' }),
    mk({ id: uid('ini'), macroDomain: services, subDomain: 'AI for software engineering / sovereign coding assistant', editor: 'Poolside', product: 'Poolside Enterprise', model: 'Éditeur', status: 'En test', souverainete: 'Souverain', useCase: 'Assistant de développement logiciel et agents de code déployables dans un environnement contrôlé (VPC, on-prem, air-gap) pour équipes engineering et plateformes internes.', comments: 'Positionnement fort pour cas de code sensible, environnements régulés et besoins de souveraineté forte ; pas centré DWP utilisateur final mais utile pour AI platform engineering.' }),
    mk({ id: uid('ini'), macroDomain: advisory, subDomain: 'Génération de contenu commercial (RFP/AO)', editor: 'AutoGenAI', product: 'AutoGenAI', model: 'Éditeur', status: 'En test', souverainete: 'À définir', useCase: 'À compléter.', comments: '(voir Antoine Lam)' }),
    mk({ id: uid('ini'), macroDomain: collab, subDomain: 'Agents de supervision infrastructure', editor: 'Atos', product: 'Digital Engineer', model: 'Interne', status: 'Non évalué', souverainete: 'Interne', useCase: 'Agents supervision environnement, détection anomalies, résolution auto si possible.', comments: 'Initiative interne à qualifier.' }),
    mk({ id: uid('ini'), macroDomain: services, subDomain: 'Agents de développement applicatif', editor: 'Atos', product: 'Digital Transformation Engineer', model: 'Interne', status: 'Non évalué', souverainete: 'Interne', useCase: 'Partie développement applicative (développement, débug code, etc).', comments: 'Initiative interne à qualifier.' }),
    mk({ id: uid('ini'), macroDomain: advisory, subDomain: 'À qualifier', editor: 'Mistral AI', product: 'Offre à qualifier', model: 'Éditeur', status: 'Non évalué', souverainete: 'Souverain', useCase: 'À compléter.', comments: 'Entrée à qualifier — informations manquantes.' }),
    mk({ id: uid('ini'), macroDomain: services, subDomain: 'Sécurité des plateformes IA', editor: 'Noma Security', product: 'Offre à qualifier', model: 'Éditeur', status: 'Non évalué', souverainete: 'Non souverain', useCase: 'À compléter — sécurité et gouvernance des agents/LLM.', comments: 'Entrée à qualifier — informations manquantes.' }),
  ];
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) {
        const migrated = parsed.map(migrateInitiativeDomain);
        const changed = migrated.some((m, idx) => m !== parsed[idx]);
        if (changed) saveData(migrated);
        return migrated;
      }
    }
  } catch (e) {}
  const seeded = seedInitiatives();
  saveData(seeded);
  return seeded;
}

function saveData(initiatives) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initiatives));
  } catch (e) {}
}

function newInitiative() {
  return mk({ id: uid('ini'), macroDomain: MACRO_DOMAINS[0].name, product: 'Nouvelle initiative', status: 'Non évalué' });
}

function makeId() { return uid('ini'); }

// ---------- ROI ----------
function computeROI(inputs) {
  const n = (v) => (Number.isFinite(+v) ? +v : 0);
  const U = n(inputs.U), T = n(inputs.T), M = n(inputs.M), S = n(inputs.S) / 100, H = n(inputs.H), R = n(inputs.R) / 100;
  const L = n(inputs.L), Dp = n(inputs.D), I = n(inputs.I), C = n(inputs.C), SUP = n(inputs.SUP);

  const heuresEconomisees = (U * T * M * 12 * S) / 60;
  const valeurAnnuelle = heuresEconomisees * H * R;
  const coutAnnuel = U * L * 12 + Dp;
  const coutAnnuelComplet = U * L * 12 + Dp + I + C + SUP;
  const roiNet = valeurAnnuelle - coutAnnuel;
  const roiNetComplet = valeurAnnuelle - coutAnnuelComplet;
  const roiPct = coutAnnuel > 0 ? (roiNet / coutAnnuel) * 100 : 0;
  const roiPctComplet = coutAnnuelComplet > 0 ? (roiNetComplet / coutAnnuelComplet) * 100 : 0;
  const monthlyValue = valeurAnnuelle / 12;
  const payback = monthlyValue > 0 ? coutAnnuel / monthlyValue : null;

  const monthlySeries = [];
  for (let mo = 0; mo <= 12; mo++) {
    monthlySeries.push({
      month: mo,
      cumValue: monthlyValue * mo,
      cumCost: coutAnnuelComplet, // upfront + running committed cost baseline
      cumCostSimple: coutAnnuel,
    });
  }

  return {
    heuresEconomisees, valeurAnnuelle, coutAnnuel, coutAnnuelComplet,
    roiNet, roiNetComplet, roiPct, roiPctComplet, payback, monthlySeries,
  };
}

function defaultROIInputs() {
  return { U: 100, T: 20, M: 15, S: 30, H: 45, R: 60, L: 25, D: 5000, I: 8000, C: 6000, SUP: 4000 };
}

// ---------- Priority scoring ----------
function scoreRisk(level) {
  return { 'Faible': 90, 'Moyen': 55, 'Élevé': 20, 'À évaluer': 35 }[level] ?? 35;
}
function scoreMoscow(m) {
  return { 'Must': 95, 'Should': 70, 'Could': 45, "Won't": 15, 'À qualifier': 30 }[m] ?? 30;
}
function scoreMaturity(status) {
  return { 'Déployé': 95, 'En test': 70, 'À tester': 45, 'Non évalué': 15 }[status] ?? 15;
}

function computePriority(ini) {
  const hasROI = !!(ini.roi && ini.roi.inputs);
  let roiScore = 40;
  let roiPct = null;
  if (hasROI) {
    const r = computeROI(ini.roi.inputs);
    roiPct = r.roiPctComplet;
    roiScore = Math.max(0, Math.min(100, (roiPct + 50) / 2));
  }
  const riskScore = scoreRisk(ini.risksData.level);
  const moscowScore = scoreMoscow(ini.prioritization.moscow);
  const maturityScore = scoreMaturity(ini.status);
  const hasKPI = !!(ini.description.businessValue && ini.description.businessValue.length > 0) || hasROI;
  const kpiScore = hasKPI ? 85 : 35;

  const score = Math.round(0.30 * roiScore + 0.20 * riskScore + 0.20 * moscowScore + 0.20 * maturityScore + 0.10 * kpiScore);

  const unclear = (ini.risksData.level === 'À évaluer' || ini.prioritization.moscow === 'À qualifier') && ini.status === 'Non évalué';
  let bucket = 'Basse';
  if (unclear) bucket = 'À clarifier';
  else if (score >= 75) bucket = 'Haute';
  else if (score >= 50) bucket = 'Moyenne';

  return {
    score, bucket, roiPct,
    breakdown: [
      { label: 'ROI', value: Math.round(roiScore), weight: 30 },
      { label: 'Risque (inversé)', value: riskScore, weight: 20 },
      { label: 'Priorisation MoSCoW', value: moscowScore, weight: 20 },
      { label: 'Maturité / déploiement', value: maturityScore, weight: 20 },
      { label: 'KPI documenté', value: kpiScore, weight: 10 },
    ],
  };
}

function statusColor(status) {
  return { 'Déployé': 'green', 'En test': 'blue', 'À tester': 'orange', 'Non évalué': 'gray' }[status] || 'gray';
}
function riskColor(level) {
  return { 'Faible': 'green', 'Moyen': 'orange', 'Élevé': 'red', 'À évaluer': 'gray' }[level] || 'gray';
}
function priorityColor(bucket) {
  return { 'Haute': 'blue', 'Moyenne': 'teal', 'Basse': 'gray', 'À clarifier': 'orange' }[bucket] || 'gray';
}

// ---------- Schéma portefeuille (Dashboard) ----------
const PORTFOLIO_SCHEMA_KEY = 'ia-portfolio-schema-v3';

const DEFAULT_SCHEMA_TEMPLATE = [
  { title: 'DWP - Accessibility', subtitle: 'Assistance, coaching et inclusion utilisateur', products: ['Plateforme avatars & coaching', "L'Assistant"] },
  { title: 'DWP - Advisory', subtitle: 'Conseil, veille et aide à la décision', products: ['ChatGPT Enterprise', 'Google Gemini', 'AutoGenAI', 'Offre à qualifier'] },
  { title: 'DWP - Platforms', subtitle: 'Socles techniques et briques d\u2019orchestration', products: ['Copilot Studio — Workflows DWP', 'SmartSI', 'n8n', 'Pay-i ROI Optimization Platform'] },
  { title: 'DWP - Experience', subtitle: 'Expérience utilisateur et poste de travail', products: ['Microsoft 365 Copilot', 'Avatar Avant-Vente Marie', 'Nexthink', 'KYP.ai Process Intelligence Platform'] },
  { title: 'DWP - Services', subtitle: 'Développement, ingénierie et sécurité', products: ['Poolside Enterprise', 'Digital Transformation Engineer', 'Autopilot / UiPath AI', 'Offre à qualifier'] },
  { title: 'DWP - Intelligent Collaboration', subtitle: 'Agents collaboratifs et automatisation métier', products: ['Plateforme AI Employees', 'Konverso AI Agents', 'Digital Engineer'] },
  { title: 'DWP - Adaptive Service Desk', subtitle: 'Support IT augmenté et self-service', products: ['Ticket Coach', 'Smart Automation'] },
];

function buildDefaultPortfolioSchema(initiatives) {
  return DEFAULT_SCHEMA_TEMPLATE.map(cat => {
    const items = [];
    cat.products.forEach(pname => {
      const match = initiatives.find(i => i.product === pname && !items.includes(i.id));
      if (match) items.push(match.id);
    });
    return { id: makeId(), title: cat.title, subtitle: cat.subtitle, items };
  });
}

function loadPortfolioSchema() {
  try {
    const raw = localStorage.getItem(PORTFOLIO_SCHEMA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return null;
}

function savePortfolioSchema(schema) {
  try {
    localStorage.setItem(PORTFOLIO_SCHEMA_KEY, JSON.stringify(schema));
  } catch (e) {}
}

// ---------- Widgets personnalisés (Dashboard) ----------
const CUSTOM_WIDGETS_KEY = 'ia-portfolio-custom-widgets-v1';
const WIDGET_FORMATS = ['donut', 'bar', 'kpi'];
const WIDGET_DIMENSIONS = ['status', 'risk', 'priority', 'domain', 'moscow', 'souverainete'];
const WIDGET_COLOR_THEMES = [
  ['#2454C7', '#5C8CF0', '#9FB3D9', '#E8EEFC'],
  ['#1E8E5A', '#4FAE7E', '#8FCBAB', '#E7F5EC'],
  ['#B9770E', '#D99B3E', '#EBC287', '#FBEFDD'],
  ['#7A3FC2', '#9B6CD6', '#C5A6E8', '#F1E9FB'],
  ['#C23B3B', '#DD6B6B', '#F0AFAF', '#FBEAEA'],
  ['#0B7285', '#3B9FB0', '#8CCAD4', '#E3F3F5'],
];

function loadCustomWidgets() {
  try {
    const raw = localStorage.getItem(CUSTOM_WIDGETS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function saveCustomWidgets(widgets) {
  try {
    localStorage.setItem(CUSTOM_WIDGETS_KEY, JSON.stringify(widgets));
  } catch (e) {}
}

const BADGE_PALETTE = ['#2454C7', '#1E8E5A', '#B9770E', '#7A3FC2', '#1F7A8C', '#C23B3B', '#5C6B84', '#0B7285', '#9C36B5', '#E8590C', '#2F9E44', '#1864AB', '#D6336C', '#5F3DC4', '#087F5B', '#862E9C'];
function badgePalette() { return BADGE_PALETTE; }
const MARKER_COLORS = ['#2454C7', '#1E8E5A', '#B9770E', '#C23B3B', '#7A3FC2', '#1F7A8C', '#0B7285', '#9C36B5', '#E8590C', '#2F9E44', '#1864AB', '#D6336C', '#5F3DC4', '#087F5B', '#862E9C', '#5C6B84'];
const MARKER_SYMBOLS = ['●', '■', '▲', '◆', '★', '✦', '⬟', '⬢', '✚', '✓', '!', '⚑', '⚙', '⚡', '☎', '🔒', '🌐', '🧠', '🤖', '📊'];
function editorBadgeColor(name) {
  const s = String(name || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return BADGE_PALETTE[h % BADGE_PALETTE.length];
}
function initials(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

window.PortfolioData = {
  STORAGE_KEY, STATUS_LIST, RISK_LIST, MOSCOW_LIST, LEVEL_LIST, SOUVERAINETE_LIST, DOC_CATEGORIES,
  MACRO_DOMAINS, PORTFOLIO_SCHEMA_KEY, CUSTOM_WIDGETS_KEY, WIDGET_FORMATS, WIDGET_DIMENSIONS, WIDGET_COLOR_THEMES,
  MARKER_COLORS, MARKER_SYMBOLS,
  seedInitiatives, loadData, saveData, newInitiative, makeId,
  computeROI, defaultROIInputs, computePriority,
  statusColor, riskColor, priorityColor,
  buildDefaultPortfolioSchema, loadPortfolioSchema, savePortfolioSchema, editorBadgeColor, initials,
  badgePalette, loadCustomWidgets, saveCustomWidgets,
};

}