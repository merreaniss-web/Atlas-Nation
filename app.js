/* ATLAS NATIONS V4 — simulation présidentielle locale, autonome hors carte. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Number(n) || 0));
  const num = (n) => Number(n || 0).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
  const fmt = (n, d = 1) => Number(n || 0).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const md = (n) => { let currency = '€'; try { currency = S ? country().currency : byCode($('countrySelect')?.value || 'FR').currency; } catch (_) {} return `${num(n)} Md ${currency || '€'}`; };
  const pct = (n) => `${fmt(n, 1)} %`;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const today = () => `${S.day} ${MONTHS[S.month - 1]} ${S.year}`;
  const MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const STORAGE_KEY = 'atlas_nations_v4_current';
  const SAVES_KEY = 'atlas_nations_v4_saves';
  const PAGES = {
    overview:['Tableau de bord','PRÉSIDENCE · SITUATION NATIONALE'], society:['Pays & société','INDICATEURS SOCIAUX · SERVICES PUBLICS'], finance:['Finances publiques','TRÉSOR · BUDGET · DETTE SOUVERAINE'], taxes:['Fiscalité & recettes','POLITIQUE FISCALE · RECETTES PUBLIQUES'], laws:['Projets de loi','INITIATIVE LÉGISLATIVE · PROCÉDURE PARLEMENTAIRE'], parliament:['Parlement','ASSEMBLÉE · COALITIONS · CONFIANCE'], elections:['Élections & opinion','VIE POLITIQUE · OPINION PUBLIQUE'], cabinet:['Gouvernement','CABINET · MINISTÈRES · ARBITRAGES'], projects:['Grands projets','INVESTISSEMENT PUBLIC · PLANIFICATION'], procurement:['Achats & marchés','COMMANDE PUBLIQUE · CONTRATS'], defense:['Carte & défense','ÉTAT-MAJOR · UNITÉS · POSITIONS DE JEU'], diplomacy:['Diplomatie & commerce','RELATIONS EXTÉRIEURES · ÉCHANGES'], journal:['Journal national','ÉVÉNEMENTS · DÉCISIONS · RAPPORTS'], saves:['Sauvegardes & options','CAMPAGNE · EXPORT · PARAMÈTRES']
  };
  const COUNTRIES = [
    {code:'FR',name:'France',flag:'🇫🇷',region:'Europe',gov:'République semi-présidentielle',gdp:2900,pop:68.4,debt:112,center:[46.6,2.5],currency:'€',parties:['Union nationale','Alliance réformatrice','Coalition sociale','Mouvement populaire'],unemployment:7.4,inflation:2.1},
    {code:'US',name:'États-Unis',flag:'🇺🇸',region:'Amérique du Nord',gov:'République fédérale présidentielle',gdp:28500,pop:334,debt:123,center:[39.5,-98.35],currency:'$',parties:['Parti démocrate','Parti républicain','Coalition indépendante'],unemployment:4.1,inflation:2.8},
    {code:'GB',name:'Royaume-Uni',flag:'🇬🇧',region:'Europe',gov:'Monarchie parlementaire',gdp:3400,pop:68.2,debt:101,center:[54,-2.5],currency:'£',parties:['Parti travailliste','Parti conservateur','Libéraux-démocrates'],unemployment:4.3,inflation:2.6},
    {code:'DE',name:'Allemagne',flag:'🇩🇪',region:'Europe',gov:'République fédérale parlementaire',gdp:4500,pop:84.4,debt:64,center:[51.2,10.4],currency:'€',parties:['Union démocrate','Parti social','Coalition écologiste'],unemployment:3.2,inflation:2.2},
    {code:'IT',name:'Italie',flag:'🇮🇹',region:'Europe',gov:'République parlementaire',gdp:2300,pop:58.9,debt:138,center:[42.8,12.6],currency:'€',parties:['Coalition nationale','Alliance démocrate','Centre réformateur'],unemployment:7.2,inflation:1.9},
    {code:'ES',name:'Espagne',flag:'🇪🇸',region:'Europe',gov:'Monarchie parlementaire',gdp:1600,pop:48.6,debt:105,center:[40.2,-3.7],currency:'€',parties:['Parti social','Parti populaire','Coalition progressiste'],unemployment:11.5,inflation:2.7},
    {code:'CN',name:'Chine',flag:'🇨🇳',region:'Asie',gov:'République populaire à parti unique',gdp:17900,pop:1409,debt:84,center:[35.8,103.8],currency:'¥',parties:['Parti national','Coalition de développement'],unemployment:5.2,inflation:0.8},
    {code:'JP',name:'Japon',flag:'🇯🇵',region:'Asie',gov:'Monarchie constitutionnelle parlementaire',gdp:4200,pop:124.5,debt:255,center:[36.2,138.2],currency:'¥',parties:['Parti libéral','Parti démocrate','Coalition civique'],unemployment:2.6,inflation:2.4},
    {code:'IN',name:'Inde',flag:'🇮🇳',region:'Asie',gov:'République fédérale parlementaire',gdp:3900,pop:1428,debt:82,center:[22.8,79],currency:'₹',parties:['Alliance nationale','Congrès populaire','Front régional'],unemployment:7.8,inflation:4.2},
    {code:'BR',name:'Brésil',flag:'🇧🇷',region:'Amérique du Sud',gov:'République fédérale présidentielle',gdp:2200,pop:203,debt:84,center:[-10.8,-52],currency:'R$',parties:['Front du travail','Alliance libérale','Coalition centriste'],unemployment:7.9,inflation:4.1},
    {code:'CA',name:'Canada',flag:'🇨🇦',region:'Amérique du Nord',gov:'Monarchie parlementaire fédérale',gdp:2200,pop:40.8,debt:107,center:[56,-106],currency:'C$',parties:['Parti libéral','Parti conservateur','Nouveau parti démocrate'],unemployment:6.2,inflation:2.3},
    {code:'AU',name:'Australie',flag:'🇦🇺',region:'Océanie',gov:'Monarchie parlementaire fédérale',gdp:1700,pop:27.1,debt:50,center:[-25,134],currency:'A$',parties:['Parti travailliste','Coalition libérale','Verts'],unemployment:4.0,inflation:3.0},
    {code:'MA',name:'Maroc',flag:'🇲🇦',region:'Afrique',gov:'Monarchie constitutionnelle',gdp:145,pop:37.8,debt:70,center:[31.8,-6.2],currency:'MAD',parties:['Parti de la modernité','Parti de l’indépendance','Alliance sociale'],unemployment:13,inflation:1.5},
    {code:'CH',name:'Suisse',flag:'🇨🇭',region:'Europe',gov:'République fédérale',gdp:900,pop:8.9,debt:40,center:[46.8,8.2],currency:'CHF',parties:['Centre fédéral','Alliance libérale','Coalition sociale'],unemployment:4.4,inflation:1.4},
    {code:'PT',name:'Portugal',flag:'🇵🇹',region:'Europe',gov:'République parlementaire',gdp:300,pop:10.6,debt:97,center:[39.6,-8],currency:'€',parties:['Parti socialiste','Alliance démocratique','Coalition progressiste'],unemployment:6.5,inflation:2.3},
    {code:'TR',name:'Turquie',flag:'🇹🇷',region:'Eurasie',gov:'République présidentielle',gdp:1100,pop:85.3,debt:30,center:[39,35],currency:'₺',parties:['Alliance nationale','Parti républicain','Parti du peuple'],unemployment:9,inflation:45},
    {code:'NO',name:'Norvège',flag:'🇳🇴',region:'Europe',gov:'Monarchie parlementaire',gdp:580,pop:5.6,debt:43,center:[61,8],currency:'kr',parties:['Parti travailliste','Parti conservateur','Parti du centre'],unemployment:3.8,inflation:2.4},
    {code:'MX',name:'Mexique',flag:'🇲🇽',region:'Amérique du Nord',gov:'République fédérale présidentielle',gdp:1800,pop:129,pdebt:54,debt:54,center:[23.6,-102.5],currency:'MXN',parties:['Mouvement national','Alliance citoyenne','Parti d’action'],unemployment:2.8,inflation:4.5},
    {code:'ZA',name:'Afrique du Sud',flag:'🇿🇦',region:'Afrique',gov:'République parlementaire',gdp:400,pop:63,debt:75,center:[-29,24],currency:'ZAR',parties:['Congrès national','Alliance démocratique','Combattants de la liberté'],unemployment:32,inflation:5.2},
    {code:'NZ',name:'Nouvelle-Zélande',flag:'🇳🇿',region:'Océanie',gov:'Monarchie parlementaire',gdp:250,pop:5.3,debt:45,center:[-41,174],currency:'NZ$',parties:['Parti travailliste','Parti national','Verts'],unemployment:4.8,inflation:2.7}
  ];
  const MINISTRY_DEFS = [
    ['Finances et dette',.028],['Défense',.022],['Intérieur',.020],['Affaires étrangères',.008],['Justice',.014],['Santé',.080],['Éducation',.055],['Économie et industrie',.030],['Énergie et climat',.018],['Transports et infrastructures',.025],['Agriculture et alimentation',.014],['Travail et solidarités',.075],['Recherche et numérique',.012],['Culture et médias',.007],['Logement et territoires',.018],['Environnement',.012]
  ];
  const PROJECT_TYPES = [
    {name:'Modernisation des hôpitaux',ministry:'Santé',cost:8,duration:12,benefit:{health:7,happiness:2}},
    {name:'Plan ferroviaire national',ministry:'Transports et infrastructures',cost:16,duration:24,benefit:{infrastructure:9,growth:.4}},
    {name:'Rénovation des écoles',ministry:'Éducation',cost:7,duration:10,benefit:{education:7,happiness:2}},
    {name:'Production énergétique',ministry:'Énergie et climat',cost:12,duration:18,benefit:{energy:8,growth:.3}},
    {name:'Logement abordable',ministry:'Logement et territoires',cost:9,duration:15,benefit:{housing:8,happiness:3}},
    {name:'Réseau numérique public',ministry:'Recherche et numérique',cost:5,duration:9,benefit:{digital:8,growth:.2}},
    {name:'Soutien à la réindustrialisation',ministry:'Économie et industrie',cost:14,duration:20,benefit:{growth:.6,unemployment:-.5}}
  ];
  let S = null, currentPage = 'overview', mapInstance = null, mapLayers = [], selectedUnitId = null, mapClickHandler = null, toastTimer = null;

  function byCode(code) { return COUNTRIES.find(c => c.code === code) || COUNTRIES[0]; }
  function country() { return byCode(S.country); }
  function dateLabel() { return `${S.day} ${MONTHS[S.month - 1]} ${S.year}`; }
  function annualRevenue() {
    const c = country();
    const rate = .10 + S.taxes.income * .006 + S.taxes.vat * .007 + S.taxes.corporate * .003 + S.taxes.carbon * .0007;
    return Math.max(0, S.gdp * rate);
  }
  function annualInterest() { return S.debt * S.interestRate / 100; }
  function annualSpending() { return Object.values(S.ministries).reduce((sum, m) => sum + Number(m.budget || 0), 0) + annualInterest(); }
  function balance() { return annualRevenue() - annualSpending(); }
  function debtRatio() { return S.gdp > 0 ? S.debt / S.gdp * 100 : 0; }
  function countryMoney(n) { return `${num(n)} Md ${country().currency || '€'}`; }
  function pushNews(title, body, type = 'info') {
    S.news.unshift({id:uid(),date:dateLabel(),title,body,type});
    S.news = S.news.slice(0, 80);
  }
  function uid() { return `${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`; }
  function toast(message) {
    const el = $('toast'); el.textContent = message; el.classList.remove('hidden');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.add('hidden'), 3200);
  }
  function saveAuto() {
    if (!S) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); $('saveMessage').textContent = 'Sauvegarde automatique active'; }
    catch (_) { $('saveMessage').textContent = 'Stockage local indisponible'; }
  }
  function saveState(label) {
    saveAuto();
    const saves = getSaves();
    const name = label || `${country().name} · ${dateLabel()}`;
    saves.unshift({id:uid(),name,updated:new Date().toISOString(),state:JSON.parse(JSON.stringify(S))});
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves.slice(0,10)));
    toast(`Campagne sauvegardée : ${name}`); renderPage();
  }
  function getSaves() { try { const v = JSON.parse(localStorage.getItem(SAVES_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (_) { return []; } }
  function exportSave() {
    const blob = new Blob([JSON.stringify({product:'ATLAS NATIONS',version:4,exportedAt:new Date().toISOString(),state:S},null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `atlas-nations-${S.country}-${S.year}-${String(S.month).padStart(2,'0')}.json`; a.click(); URL.revokeObjectURL(url); toast('Export de la partie préparé.');
  }
  function initPicker() {
    $('countrySelect').innerHTML = COUNTRIES.map(c => `<option value="${c.code}">${c.flag} ${esc(c.name)}</option>`).join('');
    updatePreview();
  }
  function updatePreview() {
    const c = byCode($('countrySelect').value);
    $('previewFlag').textContent = c.flag; $('previewCountry').textContent = c.name;
    $('previewMeta').textContent = `${c.region} · ${c.gov}`; $('previewGDP').textContent = md(c.gdp);
  }
  function createGame() {
    const c = byCode($('countrySelect').value), difficulty = $('difficulty').value, scenario = $('scenarioSelect').value;
    $('resumeGame')?.remove(); selectedUnitId = null;
    const first = $('leaderFirst').value.trim() || 'Alexandre', last = $('leaderLast').value.trim() || 'Moreau';
    const startingGDP = c.gdp * (scenario === 'recovery' ? .96 : 1);
    const party = $('partyInput').value.trim() || c.parties[0];
    const baseDebt = startingGDP * c.debt / 100;
    const scale = startingGDP;
    const ministryNames = MINISTRY_DEFS;
    const approval = difficulty === 'easy' ? 70 : difficulty === 'hard' ? 46 : 59;
    S = {
      version:4,country:c.code,first,last,title:$('leaderTitle').value,party,difficulty,scenario,
      year:2026,month:1,day:1,daysElapsed:0,monthsElapsed:0,paused:true,
      gdp:startingGDP,growth:scenario === 'recovery' ? -1.4 : 1.3,unemployment:c.unemployment,inflation:c.inflation,reputation:60,
      population:c.pop,poverty:17,inequality:38,health:64,education:67,infrastructure:60,security:60,happiness:61,stability:65,legitimacy:67,approval,
      debt:baseDebt,treasury:Math.max(6,scale*.018),interestRate:c.code==='TR'?8.5:c.code==='MA'?4.2:3.2,
      taxes:{income:20,vat:20,corporate:25,carbon:10},
      parliament:{government: difficulty==='hard'?43:(difficulty==='easy'?62:55),opposition: difficulty==='hard'?42:(difficulty==='easy'?25:32),other: difficulty==='hard'?15:(difficulty==='easy'?13:13),confidence:60},
      ministries:{},bills:[],projects:[],contracts:[],units:[],tradeDeals:[],relations:{},news:[],events:[],electionYear:2030,term:1,electionHistory:[],priority:'Croissance, pouvoir d’achat et services publics',flags:{carbonTax:false,automaticDeficit:false},
      createdAt:new Date().toISOString()
    };
    ministryNames.forEach(([name,share],i)=>{
      const people=['Camille Laurent','Thomas Bernard','Sarah Morel','Nicolas Petit','Lina Robert','Julien Simon','Maya Dubois','Antoine Garcia','Nora Petit','Louis Garnier','Amira Benali','Hugo Fontaine','Inès Marchand','Paul Chevalier','Emma Faure','Yanis Lambert'];
      S.ministries[name]={name,minister:people[i % people.length],skill:58 + ((i*7)%29),trust:57 + ((i*11)%31),budget:Math.round(scale*share*10)/10};
    });
    if (scenario === 'recovery') { S.growth=-2.8; S.unemployment+=2.1; S.treasury*=.6; S.approval-=7; S.inflation+=1.3; }
    if (scenario === 'tension') { S.stability-=8; S.security-=9; S.reputation-=2; S.interestRate+=.7; }
    if (scenario === 'reform') { S.parliament.government=51; S.legitimacy+=2; }
    const center=c.center;
    S.units = [
      {id:uid(),name:'Commandement terrestre',type:'Terre',strength:100,readiness:72,lat:center[0]+.7,lng:center[1]-.9,dest:null,status:'En garnison',owner:c.name},
      {id:uid(),name:'Force aérienne',type:'Air',strength:84,readiness:79,lat:center[0]-.6,lng:center[1]+.8,dest:null,status:'En alerte',owner:c.name},
      {id:uid(),name:'Groupe naval',type:'Mer',strength:76,readiness:67,lat:center[0]-1.7,lng:center[1]+2.3,dest:null,status:'En patrouille',owner:c.name}
    ];
    const initialRelations={}; COUNTRIES.forEach(other=>{if(other.code!==c.code)initialRelations[other.code]={score:45+Math.floor(Math.random()*26),status:'Relations normales',trade:Math.round(scale*.00025*10)/10};});
    S.relations=initialRelations;
    pushNews('Formation du gouvernement',`${S.title} ${S.first} ${S.last} prend ses fonctions à la tête de ${c.name}.`,'system');
    pushNews('Briefing économique initial',`PIB estimé : ${md(S.gdp)}. Dette publique : ${md(S.debt)} (${pct(debtRatio())} du PIB). Les données sont celles du scénario de jeu.`);
    $('setupScreen').classList.add('hidden'); $('gameApp').classList.remove('hidden');
    currentPage='overview'; renderShell(); renderPage(); saveAuto(); toast(`La partie ${c.name} commence.`);
  }
  function loadState(state) {
    if (!state || !state.country || !state.ministries || !state.taxes) throw new Error('Fichier de sauvegarde invalide.');
    S = state; selectedUnitId = null; S.version = 4; S.news ||= []; S.events ||= []; S.bills ||= []; S.projects ||= []; S.contracts ||= []; S.units ||= []; S.tradeDeals ||= []; S.relations ||= {};
    $('setupScreen').classList.add('hidden'); $('gameApp').classList.remove('hidden'); currentPage='overview'; renderShell(); renderPage(); saveAuto();
  }
  function renderShell() {
    $('sideFlag').textContent=country().flag; $('sideCountry').textContent=country().name; $('sideLeader').textContent=`${S.title} · ${S.year}`;
    $('simDate').textContent=dateLabel(); $('lawBadge').textContent=S.bills.filter(b=>!['Promulguée','Rejetée','Retirée'].includes(b.status)).length;
  }
  function go(page) {
    if (!PAGES[page]) return; currentPage=page; document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
    $('pageTitle').textContent=PAGES[page][0]; $('pageEyebrow').textContent=PAGES[page][1]; $('sidebar').classList.remove('open'); renderPage();
  }
  function pageHead(title,desc,actions='') { return `<div class="page-head"><div><h2>${title}</h2><p>${desc}</p></div><div class="page-actions">${actions}</div></div>`; }
  function cardTitle(title,sub='',actions='') { return `<div class="card-title"><div><h3>${title}</h3>${sub?`<p>${sub}</p>`:''}</div><div class="actions">${actions}</div></div>`; }
  function kpi(title,value,delta='',type='') { return `<div class="kpi"><small>${title}</small><strong>${value}</strong>${delta?`<div class="delta ${type}">${delta}</div>`:''}</div>`; }
  function barRow(title,value,max=100,fmtValue=null) { const v=clamp(Number(value),0,max); return `<div class="bar-row"><div class="bar-meta"><span>${title}</span><b>${fmtValue?fmtValue(value):`${num(value)}/100`}</b></div><div class="progress ${v<35?'red':v<55?'gold':''}"><i style="width:${v/max*100}%"></i></div></div>`; }
  function newsMarkup(items) { return items.length ? items.map(n=>`<div class="feed-item"><h4>${esc(n.title)} <span class="pill ${n.type==='good'?'good':n.type==='bad'?'bad':n.type==='system'?'gold':''}">${esc(n.type==='good'?'Décision favorable':n.type==='bad'?'Alerte':n.type==='system'?'Institution':'Journal')}</span></h4><p>${esc(n.body)}</p><small>${esc(n.date)}</small></div>`).join('') : '<div class="empty">Aucun événement enregistré.</div>'; }
  function field(id,label,value,opts={}) { const type=opts.type||'text'; return `<label class="field">${label}<input id="${id}" type="${type}" value="${esc(value)}" ${opts.min!=null?`min="${opts.min}"`:''} ${opts.max!=null?`max="${opts.max}"`:''} ${opts.step!=null?`step="${opts.step}"`:''} ${opts.required?'required':''}></label>`; }
  function selectField(id,label,options,value) { return `<label class="field">${label}<select id="${id}">${options.map(x=>`<option value="${esc(x.value??x)}" ${String(x.value??x)===String(value)?'selected':''}>${esc(x.label??x)}</option>`).join('')}</select></label>`; }
  function renderPage() {
    if (!S) return;
    renderShell();
    const views={overview:renderOverview,society:renderSociety,finance:renderFinance,taxes:renderTaxes,laws:renderLaws,parliament:renderParliament,elections:renderElections,cabinet:renderCabinet,projects:renderProjects,procurement:renderProcurement,defense:renderDefense,diplomacy:renderDiplomacy,journal:renderJournal,saves:renderSaves};
    $('pageContent').innerHTML=(views[currentPage]||renderOverview)();
    saveAuto();
    if(currentPage==='defense') initMap();
  }
  function renderOverview() {
    const rev=annualRevenue(), spend=annualSpending(), bal=rev-spend;
    return pageHead(`Bonjour ${esc(S.first)} ${esc(S.last)}`,`Point de situation du ${dateLabel()}. Les chiffres ci-dessous sont des estimations de la simulation.`,`<button class="button secondary" data-action="council">Convoquer le conseil</button><button class="button primary" data-action="advance-month">Clore le mois →</button>`)+
      `<div class="grid cols-4">${kpi('PIB annuel',md(S.gdp),`${S.growth>=0?'+':''}${pct(S.growth)} de croissance`,S.growth>=0?'good':'bad')}${kpi('Solde budgétaire annuel',md(bal),bal>=0?'Excédent prévisionnel':'Déficit prévisionnel',bal>=0?'good':'bad')}${kpi('Dette publique',md(S.debt),`${pct(debtRatio())} du PIB`,debtRatio()>100?'bad':'')}${kpi('Popularité',pct(S.approval),'Soutien de l’opinion',S.approval>=50?'good':'bad')}</div>
      <div class="section-label">SITUATION DE L'ÉTAT</div><div class="grid main-side"><div class="stack"><div class="card">${cardTitle('Indicateurs macroéconomiques','Tendance mensuelle simulée')}<div class="grid cols-3">${kpi('Chômage',pct(S.unemployment),'Marché du travail',S.unemployment<7?'good':'bad')}${kpi('Inflation',pct(S.inflation),'Indice des prix',S.inflation<3?'good':'bad')}${kpi('Trésorerie',md(S.treasury),'Liquidités du Trésor')}</div><div class="section-label">CAPACITÉ DE L'ÉTAT</div>${barRow('Stabilité institutionnelle',S.stability)}${barRow('Satisfaction publique',S.happiness)}${barRow('Qualité des services de santé',S.health)}${barRow('Éducation',S.education)}</div>
      <div class="card">${cardTitle('Décisions prioritaires','Les actions ont un coût et des conséquences réelles dans la partie.',`<button class="button secondary" data-page="finance">Ouvrir le budget</button>`)}<div class="action-row"><div><b>Arbitrer le budget</b><small>Vérifiez les recettes, les dépenses et le déficit.</small></div><button class="button" data-page="finance">Consulter</button></div><div class="action-row"><div><b>Déposer un projet de loi</b><small>Définissez le texte et faites-le passer au vote.</small></div><button class="button" data-action="new-bill">Rédiger</button></div><div class="action-row"><div><b>Lancer un grand projet</b><small>Financer un investissement sur plusieurs mois.</small></div><button class="button" data-page="projects">Créer</button></div><div class="action-row"><div><b>État-major</b><small>Consulter la carte et donner un ordre à une unité.</small></div><button class="button" data-page="defense">Ouvrir la carte</button></div></div>
      <div class="card">${cardTitle('Prévisions financières','Recettes et dépenses annualisées')}<div class="ledger-totals"><div><small>Recettes</small><b>${md(rev)}</b></div><div><small>Dépenses</small><b>${md(spend)}</b></div><div><small>Solde</small><b style="color:${bal<0?'var(--red)':'var(--green)'}">${md(bal)}</b></div></div>${barRow('Recettes rapportées au PIB',rev/S.gdp*100,100,v=>pct(v))}${barRow('Dépenses rapportées au PIB',spend/S.gdp*100,100,v=>pct(v))}</div></div>
      <div class="stack"><div class="card">${cardTitle('Rapport du Parlement','Répartition politique')}<div class="bar-row"><div class="bar-meta"><span>Groupe gouvernemental</span><b>${pct(S.parliament.government)}</b></div><div class="progress gold"><i style="width:${clamp(S.parliament.government)}%"></i></div></div><div class="bar-row"><div class="bar-meta"><span>Opposition</span><b>${pct(S.parliament.opposition)}</b></div><div class="progress red"><i style="width:${clamp(S.parliament.opposition)}%"></i></div></div><div class="bar-row"><div class="bar-meta"><span>Autres groupes</span><b>${pct(S.parliament.other)}</b></div><div class="progress"><i style="width:${clamp(S.parliament.other)}%"></i></div></div><div class="notice">Majorité ${S.parliament.government>=50?'disponible':'fragile'}. ${S.parliament.government>=50?'Le gouvernement dispose d’une base pour faire adopter ses textes.':'Une coalition ou des compromis seront probablement nécessaires.'}</div><button class="button secondary full" data-page="parliament">Gérer les rapports de force</button></div>
      <div class="card">${cardTitle('Agenda et alertes','Les sujets qui nécessitent une décision')}<div class="action-row"><div><b>Projets de loi en cours</b><small>${S.bills.filter(b=>!['Promulguée','Rejetée','Retirée'].includes(b.status)).length} texte(s) à traiter</small></div><button class="button" data-page="laws">Voir</button></div><div class="action-row"><div><b>Projets nationaux actifs</b><small>${S.projects.filter(p=>p.status==='En cours').length} chantier(s) ouverts</small></div><button class="button" data-page="projects">Suivre</button></div><div class="action-row"><div><b>Contrats en cours</b><small>${S.contracts.filter(c=>c.status!=='Livré').length} engagement(s) de commande publique</small></div><button class="button" data-page="procurement">Gérer</button></div><div class="action-row"><div><b>Prochaine échéance électorale</b><small>Année ${S.electionYear}</small></div><button class="button" data-page="elections">Consulter</button></div></div>
      <div class="card">${cardTitle('Dernières dépêches','Décisions et événements récents')}<div>${newsMarkup(S.news.slice(0,5))}</div><button class="button secondary full" data-page="journal">Ouvrir le journal complet</button></div></div></div>`;
  }
  function renderSociety() {
    return pageHead('Pays & société','Les politiques publiques influencent les indicateurs sociaux. Modifiez les priorités du gouvernement puis observez leur évolution avec le temps.',`<button class="button primary" data-action="apply-social">Appliquer les objectifs</button>`)+
      `<form id="societyForm"><div class="grid cols-3">${kpi('Population',`${num(S.population)} M`,'Population du scénario')}${kpi('Pauvreté estimée',pct(S.poverty),'Part de la population',S.poverty<15?'good':'bad')}${kpi('Inégalités',`${num(S.inequality)}/100`,'Indice synthétique')}</div><div class="grid cols-2" style="margin-top:12px"><div class="card">${cardTitle('Services publics','Les objectifs guident l’allocation et les effets des dépenses.')}<div class="form-grid">${rangeControl('health','Santé',S.health)}${rangeControl('education','Éducation',S.education)}${rangeControl('infrastructure','Infrastructures',S.infrastructure)}${rangeControl('security','Sécurité intérieure',S.security)}</div></div><div class="card">${cardTitle('Cohésion et conditions de vie','Les résultats évoluent au fil des mois.')}<div class="form-grid">${rangeControl('happiness','Satisfaction publique',S.happiness)}${rangeControl('stability','Stabilité institutionnelle',S.stability)}${rangeControl('poverty','Réduction de la pauvreté',100-S.poverty,'Part de réduction cible')}${rangeControl('inequality','Indice d’égalité',100-S.inequality,'Indice cible')}</div><div class="notice">Les objectifs n’ont pas d’effet rétroactif : ils définissent une priorité. Les résultats évolueront progressivement et dépendront aussi du budget, de la croissance et de l’emploi.</div></div></div></form>
      <div class="card" style="margin-top:12px">${cardTitle('Situation sociale')}<div class="grid cols-4">${kpi('Santé',`${num(S.health)}/100`)}${kpi('Éducation',`${num(S.education)}/100`)}${kpi('Infrastructures',`${num(S.infrastructure)}/100`)}${kpi('Sécurité',`${num(S.security)}/100`)}</div></div>`;
  }
  function rangeControl(id,label,value,sub='Objectif cible') { return `<label class="field">${label}<input type="range" name="${id}" min="0" max="100" value="${clamp(value)}" data-social-range="${id}"><span class="hint">${sub} : <b id="value-${id}">${num(value)}/100</b></span></label>`; }
  function renderFinance() {
    const rev=annualRevenue(), spend=annualSpending(), bal=rev-spend, interest=annualInterest();
    const rows=Object.values(S.ministries).map(m=>`<tr><td><b>${esc(m.name)}</b><div class="hint">Ministre : ${esc(m.minister)}</div></td><td>${md(m.budget)}</td><td><form class="inline-budget" data-ministry-form="${esc(m.name)}"><input aria-label="Budget annuel ${esc(m.name)}" name="budget" type="number" min="0" step=".1" value="${Number(m.budget).toFixed(1)}"><button class="button" type="submit">Appliquer</button></form></td></tr>`).join('');
    return pageHead('Finances publiques','Tableau de bord du Trésor : recettes et dépenses annualisées, solde, dette souveraine, liquidités et arbitrages des ministères.',`<button class="button secondary" data-action="report-finance">Rapport financier</button><button class="button primary" data-action="borrow">Demander un emprunt</button>`)+
      `<div class="grid cols-4">${kpi('Recettes annuelles',md(rev),'Prévision selon la fiscalité')}${kpi('Dépenses annuelles',md(spend),'Ministères + intérêts')}${kpi('Solde annuel',md(bal),bal<0?'Déficit à financer':'Excédent budgétaire',bal<0?'bad':'good')}${kpi('Trésorerie disponible',md(S.treasury),'Liquidités du Trésor')}</div>
      <div class="grid main-side" style="margin-top:12px"><div class="card">${cardTitle('Budget par ministère','Modifiez chaque enveloppe annuelle. Les changements affectent le déficit dès leur application.')}<div class="table-wrap"><table><thead><tr><th>Ministère</th><th>Budget actuel</th><th>Nouveau budget annuel (Md)</th></tr></thead><tbody>${rows}</tbody></table></div><div class="button-row"><button class="button secondary" data-action="budget-reset">Restaurer les enveloppes initiales</button><button class="button primary" data-action="budget-equalize">Réduire les budgets de 2 %</button></div></div>
      <div class="stack"><div class="card">${cardTitle('Dette souveraine','Emprunts et charge d’intérêt')}<div class="ledger-totals"><div><small>Dette</small><b>${md(S.debt)}</b></div><div><small>Dette / PIB</small><b>${pct(debtRatio())}</b></div><div><small>Intérêts annuels</small><b>${md(interest)}</b></div></div><div class="form-grid">${field('interestRate','Taux moyen de la dette (%)',S.interestRate,{type:'number',min:0,max:30,step:.1})}<div class="field">Nouvelle prévision<div class="control" id="interestPreview">${md(interest)}</div></div></div><div class="button-row"><button class="button primary" data-action="apply-interest">Modifier le taux</button><button class="button secondary" data-action="repay-debt">Rembourser la dette</button></div><div class="notice">Un emprunt augmente les liquidités mais aussi le stock de dette. Le taux d’intérêt est appliqué à la dette totale au calcul annuel.</div></div>
      <div class="card">${cardTitle('Plan de financement','Équilibre prévisionnel')}<div class="bar-row"><div class="bar-meta"><span>Recettes</span><b>${pct(rev/S.gdp*100)} du PIB</b></div><div class="progress"><i style="width:${clamp(rev/S.gdp*100)}%"></i></div></div><div class="bar-row"><div class="bar-meta"><span>Dépenses totales</span><b>${pct(spend/S.gdp*100)} du PIB</b></div><div class="progress red"><i style="width:${clamp(spend/S.gdp*100)}%"></i></div></div><div class="notice ${bal<0?'warning':'success'}">${bal<0?`Le budget présente un déficit annuel de ${md(-bal)}. Il sera financé progressivement par l’émission de dette.`:`Le budget prévoit un excédent de ${md(bal)}. Vous pouvez réduire la dette ou augmenter l’investissement.`}</div></div></div></div>`;
  }
  function renderTaxes() {
    const rev=annualRevenue();
    return pageHead('Fiscalité & recettes','Fixez les principaux taux d’imposition. Le modèle estime les recettes, la consommation, l’activité économique et les effets politiques.',`<button class="button secondary" data-action="tax-reset">Rétablir les taux initiaux</button><button class="button primary" data-action="apply-taxes">Adopter le barème</button>`)+
      `<form id="taxForm"><div class="grid main-side"><div class="card">${cardTitle('Barème fiscal','Les changements sont appliqués après validation.')}<div class="form-grid">${taxControl('income','Impôt sur le revenu',S.taxes.income,'%','0','60','1')}${taxControl('vat','TVA',S.taxes.vat,'%','0','35','1')}${taxControl('corporate','Impôt sur les sociétés',S.taxes.corporate,'%','0','50','1')}${taxControl('carbon','Contribution carbone',S.taxes.carbon,'€/unité de jeu','0','100','1')}</div><div class="notice">Ce modèle est une mécanique de jeu : les taux n’imitent pas exactement le droit fiscal réel du pays choisi. Les conséquences économiques sont simplifiées.</div></div><div class="stack"><div class="card">${cardTitle('Simulation de recettes','Estimation annuelle à barème actuel')}<div class="kpi"><small>RECETTES PUBLIQUES ESTIMÉES</small><strong id="taxRevenuePreview">${md(rev)}</strong><div class="delta">${pct(rev/S.gdp*100)} du PIB</div></div><div class="section-label">EFFETS ATTENDUS</div><div id="taxEffects" class="feed-item"><h4>Équilibre budgétaire</h4><p>Solde estimé : ${md(rev-annualSpending())} par an.</p></div></div><div class="card">${cardTitle('Mesures complémentaires')}<div class="action-row"><div><b>Réduire les niches fiscales</b><small>Augmenter les recettes et la contestation.</small></div><button class="button" data-action="tax-loopholes">Appliquer</button></div><div class="action-row"><div><b>Renforcer la lutte anti-fraude</b><small>Coût de contrôle et recettes supplémentaires.</small></div><button class="button" data-action="tax-audit">Lancer</button></div><div class="action-row"><div><b>Allégement ciblé des bas revenus</b><small>Soutien à la consommation, moindre recette.</small></div><button class="button" data-action="tax-relief">Adopter</button></div></div></div></div></form>`;
  }
  function taxControl(id,label,value,unit,min,max,step) { return `<label class="field">${label}<div class="row-inline"><input type="number" name="${id}" min="${min}" max="${max}" step="${step}" value="${value}"><span>${unit}</span></div><span class="hint">Barème du jeu</span></label>`; }
  function renderLaws() {
    const statuses=['En rédaction','En commission','À l’ordre du jour','Adoptée','Promulguée','Rejetée','Retirée'];
    return pageHead('Projets de loi','Rédigez vos textes, fixez leur coût estimé, suivez la procédure et soumettez-les au vote. Les lois promulguées modifient les indicateurs du pays.',`<button class="button primary" data-action="new-bill">＋ Rédiger un texte</button>`)+
      `<div class="grid cols-4">${kpi('Textes en cours',S.bills.filter(b=>!['Promulguée','Rejetée','Retirée'].includes(b.status)).length,'Hors textes clos')}${kpi('Lois promulguées',S.bills.filter(b=>b.status==='Promulguée').length,'Mesures en vigueur')}${kpi('Coût potentiel',md(S.bills.filter(b=>!['Rejetée','Retirée'].includes(b.status)).reduce((a,b)=>a+b.cost,0)),'Coût cumulé des textes')}${kpi('Majorité actuelle',pct(S.parliament.government),S.parliament.government>=50?'Majorité absolue':'Coalition à négocier',S.parliament.government>=50?'good':'bad')}</div>
      <div class="card" style="margin-top:12px">${cardTitle('Registre législatif','Cliquez sur une action pour faire évoluer la procédure.')} ${S.bills.length?`<div class="table-wrap"><table><thead><tr><th>Texte</th><th>Domaine</th><th>Coût</th><th>Soutien estimé</th><th>Statut</th><th>Procédure</th></tr></thead><tbody>${S.bills.slice().reverse().map(b=>`<tr><td><b>${esc(b.title)}</b><div class="hint">${esc(b.description)}</div></td><td>${esc(b.domain)}</td><td>${md(b.cost)}</td><td>${pct(b.support)}</td><td><span class="pill ${b.status==='Promulguée'?'good':b.status==='Rejetée'?'bad':'gold'}">${esc(b.status)}</span></td><td><div class="table-actions">${b.status==='En rédaction'?`<button class="button" data-action="submit-bill" data-id="${b.id}">Déposer</button>`:''}${b.status==='En commission'?`<button class="button" data-action="agenda-bill" data-id="${b.id}">Inscrire au vote</button>`:''}${b.status==='À l’ordre du jour'?`<button class="button primary" data-action="vote-bill" data-id="${b.id}">Voter</button>`:''}${b.status==='Adoptée'?`<button class="button primary" data-action="promulgate-bill" data-id="${b.id}">Promulguer</button>`:''}${!['Promulguée','Rejetée','Retirée'].includes(b.status)?`<button class="button ghost" data-action="withdraw-bill" data-id="${b.id}">Retirer</button>`:''}</div></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Aucun projet de loi. Rédigez un texte pour lancer la procédure parlementaire.</div>'}</div>`;
  }
  function renderParliament() {
    return pageHead('Parlement','Gérez les rapports de force, négociez une coalition, testez le soutien à votre gouvernement et soumettez les lois au vote.',`<button class="button secondary" data-action="negotiate">Négocier une coalition</button><button class="button primary" data-action="confidence">Question de confiance</button>`)+
      `<div class="grid cols-4">${kpi('Gouvernement',pct(S.parliament.government),'Sièges estimés',S.parliament.government>=50?'good':'bad')}${kpi('Opposition',pct(S.parliament.opposition),'Sièges estimés')}${kpi('Autres groupes',pct(S.parliament.other),'Indépendants et petits groupes')}${kpi('Confiance',pct(S.parliament.confidence),'Soutien au cabinet',S.parliament.confidence>=50?'good':'bad')}</div>
      <div class="grid main-side" style="margin-top:12px"><div class="card">${cardTitle('Répartition des groupes','Les pourcentages sont une mécanique de jeu, modifiable au fil des négociations.')}<div class="bar-row"><div class="bar-meta"><span>Coalition gouvernementale</span><b>${pct(S.parliament.government)}</b></div><div class="progress gold"><i style="width:${clamp(S.parliament.government)}%"></i></div></div><div class="bar-row"><div class="bar-meta"><span>Opposition</span><b>${pct(S.parliament.opposition)}</b></div><div class="progress red"><i style="width:${clamp(S.parliament.opposition)}%"></i></div></div><div class="bar-row"><div class="bar-meta"><span>Autres groupes</span><b>${pct(S.parliament.other)}</b></div><div class="progress"><i style="width:${clamp(S.parliament.other)}%"></i></div></div><div class="button-row"><button class="button" data-action="negotiate">Négocier des soutiens</button><button class="button" data-action="opposition-talks">Dialoguer avec l’opposition</button><button class="button danger" data-action="censure">Simuler une motion de censure</button></div></div>
      <div class="card">${cardTitle('Textes en attente')}<p class="muted">Les textes déposés peuvent être inscrits à l’ordre du jour puis votés.</p>${S.bills.filter(b=>['En commission','À l’ordre du jour','Adoptée'].includes(b.status)).length?S.bills.filter(b=>['En commission','À l’ordre du jour','Adoptée'].includes(b.status)).map(b=>`<div class="action-row"><div><b>${esc(b.title)}</b><small>${esc(b.status)} · Soutien estimé ${pct(b.support)}</small></div><button class="button" data-page="laws">Ouvrir</button></div>`).join(''):'<div class="empty">Aucun texte en procédure.</div>'}</div></div>`;
  }
  function renderElections() {
    const electionOpen=S.year>=S.electionYear-1;
    return pageHead('Élections & opinion','Suivez la popularité et la légitimité du mandat. Les campagnes, le bilan économique et les crises font évoluer le soutien.',`<button class="button secondary" data-action="poll">Commander un sondage</button><button class="button primary" data-action="campaign">Lancer une campagne</button>`)+
      `<div class="grid cols-4">${kpi('Popularité',pct(S.approval),'Soutien national',S.approval>=50?'good':'bad')}${kpi('Légitimité',pct(S.legitimacy),'Confiance institutionnelle',S.legitimacy>=50?'good':'bad')}${kpi('Prochaine élection',String(S.electionYear),'Mandat actuel : '+S.term)}${kpi('Stabilité',pct(S.stability),'Climat politique',S.stability>=50?'good':'bad')}</div><div class="grid main-side" style="margin-top:12px"><div class="card">${cardTitle('Opinion publique','Indicateurs influencés par la conjoncture et vos arbitrages.')}<div class="section-label">TENDANCES</div>${barRow('Soutien à l’exécutif',S.approval)}${barRow('Confiance dans les institutions',S.legitimacy)}${barRow('Satisfaction sur les services publics',S.happiness)}${barRow('Stabilité nationale',S.stability)}<div class="notice ${S.approval<35?'warning':'success'}">${S.approval<35?'Le soutien est critique : les choix budgétaires et la communication vont peser fortement.':S.approval<50?'L’opinion est divisée. Cherchez des résultats visibles et des compromis parlementaires.':'Le soutien est majoritaire dans le modèle de jeu. Il peut baisser en cas de crise ou de détérioration économique.'}</div></div><div class="stack"><div class="card">${cardTitle('Actions politiques')}<div class="action-row"><div><b>Campagne de terrain</b><small>Mobiliser les soutiens, coût budgétaire faible.</small></div><button class="button" data-action="campaign">Lancer</button></div><div class="action-row"><div><b>Consultation nationale</b><small>Mesurer l’opinion et les priorités sociales.</small></div><button class="button" data-action="poll">Commander</button></div><div class="action-row"><div><b>Élections anticipées</b><small>${electionOpen?'La fenêtre électorale est ouverte.':'Le résultat est incertain, même hors calendrier.'}</small></div><button class="button danger" data-action="early-election">Déclencher</button></div></div><div class="card">${cardTitle('Historique électoral')}${S.electionHistory.length?S.electionHistory.map(e=>`<div class="feed-item"><h4>Élection ${e.year} · ${pct(e.result)}</h4><p>${esc(e.outcome)}</p></div>`).join(''):'<div class="empty">Aucun scrutin organisé depuis le début de cette partie.</div>'}</div></div></div>`;
  }
  function renderCabinet() {
    const rows=Object.values(S.ministries).map(m=>`<tr><td><b>${esc(m.name)}</b></td><td>${esc(m.minister)}</td><td>${num(m.skill)}/100</td><td>${num(m.trust)}/100</td><td>${md(m.budget)}</td><td><div class="table-actions"><button class="button" data-action="manage-minister" data-id="${esc(m.name)}">Gérer</button><button class="button ghost" data-action="change-minister" data-id="${esc(m.name)}">Remplacer</button></div></td></tr>`).join('');
    return pageHead('Gouvernement','Arbitrez les enveloppes, nommez les ministres et consultez leur niveau de confiance et de compétence.',`<button class="button secondary" data-action="reshuffle">Remaniement ciblé</button><button class="button primary" data-action="council">Convoquer le conseil</button>`)+
      `<div class="grid cols-3">${kpi('Ministères',Object.keys(S.ministries).length,'Portefeuilles gérés')}${kpi('Compétence moyenne',`${num(Object.values(S.ministries).reduce((a,m)=>a+m.skill,0)/Object.keys(S.ministries).length)}/100`,'Score du cabinet')}${kpi('Confiance moyenne',`${num(Object.values(S.ministries).reduce((a,m)=>a+m.trust,0)/Object.keys(S.ministries).length)}/100`,'Confiance interne')}</div><div class="card" style="margin-top:12px">${cardTitle('Composition du cabinet','Les compétences influencent l’efficacité des mesures et les rapports peuvent restaurer la confiance.')}<div class="table-wrap"><table><thead><tr><th>Portefeuille</th><th>Ministre</th><th>Compétence</th><th>Confiance</th><th>Budget annuel</th><th>Gestion</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
  }
  function renderProjects() {
    return pageHead('Grands projets','Lancez des investissements nationaux, réservez leur financement et suivez le calendrier jusqu’à leur livraison.',`<button class="button primary" data-action="new-project">＋ Créer un projet</button>`)+
      `<div class="grid cols-4">${kpi('Projets actifs',S.projects.filter(p=>p.status==='En cours').length,'Chantiers en cours')}${kpi('Crédits engagés',md(S.projects.filter(p=>p.status==='En cours').reduce((a,p)=>a+p.cost,0)),'Budget réservé')}${kpi('Projets livrés',S.projects.filter(p=>p.status==='Livré').length,'Réalisations')}${kpi('Trésorerie',md(S.treasury),'Financement disponible')}</div><div class="card" style="margin-top:12px">${cardTitle('Portefeuille national','La dépense est engagée à la création du projet. La progression est calculée à chaque fin de mois.')}${S.projects.length?`<div class="table-wrap"><table><thead><tr><th>Projet</th><th>Ministère pilote</th><th>Coût total</th><th>Progression</th><th>Échéance estimée</th><th>Statut</th><th></th></tr></thead><tbody>${S.projects.slice().reverse().map(p=>`<tr><td><b>${esc(p.name)}</b><div class="hint">${esc(p.description||'Investissement public')}</div></td><td>${esc(p.ministry)}</td><td>${md(p.cost)}</td><td><div class="progress" style="width:110px"><i style="width:${clamp(p.progress)}%"></i></div><small>${num(p.progress)} %</small></td><td>${p.remaining} mois</td><td><span class="pill ${p.status==='Livré'?'good':'gold'}">${p.status}</span></td><td>${p.status==='En cours'?`<button class="button danger" data-action="cancel-project" data-id="${p.id}">Annuler</button>`:'—'}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Aucun projet lancé. Créez un investissement pour démarrer.</div>'}</div>`;
  }
  function renderProcurement() {
    return pageHead('Achats & marchés','Achetez du matériel et attribuez des marchés publics. Les contrats sont payés à l’engagement puis livrés après un délai.',`<button class="button primary" data-action="new-contract">＋ Lancer un marché</button>`)+
      `<div class="grid cols-4">${kpi('Contrats actifs',S.contracts.filter(c=>c.status!=='Livré'&&c.status!=='Annulé').length,'Commandes en cours')}${kpi('Valeur engagée',md(S.contracts.filter(c=>!['Livré','Annulé'].includes(c.status)).reduce((a,c)=>a+c.cost,0)),'Engagements ouverts')}${kpi('Achats livrés',S.contracts.filter(c=>c.status==='Livré').length,'Contrats exécutés')}${kpi('Trésorerie',md(S.treasury),'Disponibilité du Trésor')}</div><div class="card" style="margin-top:12px">${cardTitle('Registre des marchés','La valeur du contrat est déduite du Trésor à la signature.')} ${S.contracts.length?`<div class="table-wrap"><table><thead><tr><th>Objet</th><th>Fournisseur</th><th>Valeur</th><th>Délai</th><th>Statut</th><th>Action</th></tr></thead><tbody>${S.contracts.slice().reverse().map(c=>`<tr><td><b>${esc(c.name)}</b><div class="hint">${esc(c.category)}</div></td><td>${esc(c.supplier)}</td><td>${md(c.cost)}</td><td>${c.remaining} mois</td><td><span class="pill ${c.status==='Livré'?'good':'gold'}">${esc(c.status)}</span></td><td>${c.status==='En cours'?`<button class="button danger" data-action="cancel-contract" data-id="${c.id}">Résilier</button>`:'—'}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Aucun contrat. Lancez un marché pour engager une dépense.</div>'}</div>`;
  }
  function renderDefense() {
    return pageHead('Carte mondiale & défense','Carte interactive basée sur OpenStreetMap. Sélectionnez une unité puis cliquez sur la carte pour lui assigner une nouvelle position de jeu.',`<button class="button secondary" data-action="exercise">Exercice de préparation</button><button class="button primary" data-action="replenish">Maintenir les forces</button>`)+
      `<div class="grid cols-4">${kpi('Unités suivies',S.units.length,'Forces enregistrées')}${kpi('Disponibilité moyenne',`${num(S.units.reduce((a,u)=>a+u.readiness,0)/(S.units.length||1))}/100`,'État de préparation')}${kpi('Effectifs / capacité',`${num(S.units.reduce((a,u)=>a+u.strength,0))}`,'Indice de force')}${kpi('Crédits défense',md(S.ministries['Défense'].budget),'Budget annuel')}</div><div class="map-layout" style="margin-top:12px"><div class="card">${cardTitle('Carte des unités','Les marqueurs et positions sont des données de jeu ; les fonds cartographiques nécessitent Internet.')}<div class="map-frame"><div id="worldMap" aria-label="Carte mondiale interactive"></div></div><div class="map-footnote" id="mapStatus">Chargement de la carte…</div></div><div class="stack"><div class="card">${cardTitle('Unités disponibles','Sélectionnez une unité avant de choisir sa destination.')}<div class="map-unit-list">${S.units.map(u=>`<button class="unit-card ${u.id===selectedUnitId?'selected':''}" data-action="select-unit" data-id="${u.id}"><b>${u.type==='Air'?'✈':u.type==='Mer'?'⚓':'◆'} ${esc(u.name)}</b><small>${esc(u.status)} · Disponibilité ${num(u.readiness)}/100</small><small>Position : ${fmt(u.lat,2)}, ${fmt(u.lng,2)}</small>${u.dest?`<small class="good">Destination : ${fmt(u.dest[0],2)}, ${fmt(u.dest[1],2)}</small>`:''}</button>`).join('')}</div><div class="button-row"><button class="button" data-action="rename-unit">Renommer</button><button class="button" data-action="stand-down">Mettre au repos</button></div></div><div class="card">${cardTitle('Ordres et disponibilité')}<div id="unitDetail">${selectedUnitId?renderUnitDetail(selectedUnitId):'<div class="empty">Sélectionnez une unité pour afficher ses détails et ses ordres.</div>'}</div><div class="notice">La progression des déplacements est simulée à chaque fin de mois. Cette carte n’affiche aucun suivi militaire réel.</div></div></div></div>`;
  }
  function renderUnitDetail(id) {
    const u=S.units.find(x=>x.id===id); if(!u)return '<div class="empty">Unité introuvable.</div>';
    return `<b>${esc(u.name)}</b><p class="muted">Type : ${esc(u.type)} · Force : ${num(u.strength)}/100</p>${barRow('Disponibilité opérationnelle',u.readiness)}<div class="button-row"><button class="button" data-action="unit-patrol" data-id="${u.id}">Patrouille</button><button class="button" data-action="unit-rest" data-id="${u.id}">Repos</button><button class="button danger" data-action="unit-recall" data-id="${u.id}">Retour à la base</button></div><p class="hint">Cliquez sur la carte pour assigner une destination au marqueur sélectionné.</p>`;
  }
  function renderDiplomacy() {
    const others=COUNTRIES.filter(c=>c.code!==S.country);
    return pageHead('Diplomatie & commerce','Gérez les relations bilatérales, négociez les échanges et engagez des initiatives diplomatiques. Les accords modifient les relations et les recettes de jeu.',`<button class="button secondary" data-action="diplomatic-brief">Briefing diplomatique</button>`)+
      `<div class="grid cols-4">${kpi('Partenaires suivis',others.length,'Pays dans le répertoire')}${kpi('Accords commerciaux',S.tradeDeals.filter(d=>d.status==='Actif').length,'Accords actifs')}${kpi('Relation moyenne',`${num(others.reduce((sum,c)=>sum+(S.relations[c.code]?.score||50),0)/others.length)}/100`,'Indice bilatéral')}${kpi('Flux commerciaux annuels',md(S.tradeDeals.filter(d=>d.status==='Actif').reduce((a,d)=>a+d.value,0)),'Valeur de jeu')}</div>
      <div class="card" style="margin-top:12px">${cardTitle('Répertoire diplomatique','Choisissez un partenaire pour ouvrir les options d’action.')}<div class="table-wrap"><table><thead><tr><th>Pays</th><th>Région</th><th>Relations</th><th>Statut</th><th>Échanges indicatifs</th><th>Actions</th></tr></thead><tbody>${others.map(c=>{const r=S.relations[c.code]||{score:50,status:'Relations normales',trade:0};return `<tr><td><b>${c.flag} ${esc(c.name)}</b></td><td>${esc(c.region)}</td><td><div class="progress" style="width:95px"><i style="width:${clamp(r.score)}%;background:${r.score<30?'var(--red)':r.score>65?'var(--green)':'var(--accent)'}"></i></div><small>${num(r.score)}/100</small></td><td><span class="pill ${r.score<30?'bad':r.score>65?'good':''}">${esc(r.status)}</span></td><td>${md(r.trade||0)}</td><td><div class="table-actions"><button class="button" data-action="trade-partner" data-id="${c.code}">Commercer</button><button class="button" data-action="diplomacy-partner" data-id="${c.code}">Diplomatie</button></div></td></tr>`;}).join('')}</tbody></table></div><div class="notice">Les chiffres commerciaux sont des montants fictifs de simulation et ne représentent pas les échanges bilatéraux actuels.</div></div>
      <div class="card" style="margin-top:12px">${cardTitle('Accords en cours')} ${S.tradeDeals.length?`<div class="table-wrap"><table><thead><tr><th>Partenaire</th><th>Nature</th><th>Valeur annuelle</th><th>Durée restante</th><th>Statut</th></tr></thead><tbody>${S.tradeDeals.slice().reverse().map(d=>`<tr><td>${esc(byCode(d.partner).flag)} ${esc(byCode(d.partner).name)}</td><td>${esc(d.type)}</td><td>${md(d.value)}</td><td>${d.remaining} mois</td><td><span class="pill ${d.status==='Actif'?'good':'bad'}">${esc(d.status)}</span></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Aucun accord commercial actif.</div>'}</div>`;
  }
  function renderJournal() {
    return pageHead('Journal national','Historique horodaté des décisions, évolutions économiques, débats législatifs et événements de la campagne.',`<button class="button secondary" data-action="report-national">Créer un rapport national</button><button class="button primary" data-action="export">Exporter les données</button>`)+
      `<div class="grid main-side"><div class="card">${cardTitle('Chronologie','Événements les plus récents en premier.')}<div>${newsMarkup(S.news)}</div></div><div class="stack"><div class="card">${cardTitle('État du mandat')}<div class="action-row"><div><b>Durée écoulée</b><small>${S.daysElapsed} jours · ${S.monthsElapsed} mois simulés</small></div></div><div class="action-row"><div><b>Lois promulguées</b><small>${S.bills.filter(b=>b.status==='Promulguée').length} texte(s)</small></div></div><div class="action-row"><div><b>Projets livrés</b><small>${S.projects.filter(p=>p.status==='Livré').length} réalisation(s)</small></div></div><div class="action-row"><div><b>Contrats livrés</b><small>${S.contracts.filter(c=>c.status==='Livré').length} contrat(s)</small></div></div></div><div class="card">${cardTitle('Actions de gestion')}<button class="button secondary full" data-action="save">Sauvegarder la partie</button><button class="button secondary full" data-action="export">Exporter une sauvegarde</button><button class="button danger full" data-action="new-game-confirm">Nouvelle campagne</button></div></div></div>`;
  }
  function renderSaves() {
    const saves=getSaves();
    return pageHead('Sauvegardes & options','Gérez plusieurs campagnes locales, exportez une partie au format JSON ou restaurez une sauvegarde existante.',`<button class="button secondary" data-action="save">Sauvegarder maintenant</button><button class="button primary" data-action="export">Exporter JSON</button>`)+
      `<div class="grid main-side"><div class="stack"><div class="card">${cardTitle('Campagne actuelle','La partie en cours est sauvegardée automatiquement dans ce navigateur.')}<div class="grid cols-2">${kpi('Pays',`${country().flag} ${esc(country().name)}`,'Campagne active')}${kpi('Date',dateLabel(),'Temps de jeu')}${kpi('Trésorerie',md(S.treasury),'Disponibilité')}${kpi('Sauvegarde auto','Active','Données conservées sur cet appareil','good')}</div><div class="button-row"><button class="button primary" data-action="save">Créer une sauvegarde nommée</button><button class="button secondary" data-action="export">Télécharger le fichier JSON</button><label class="button secondary" for="importFile">Importer un fichier JSON</label><input class="hidden" type="file" id="importFile" accept="application/json,.json"></div></div><div class="card">${cardTitle('Sauvegardes enregistrées',`${saves.length} sauvegarde(s) locale(s)`)}${saves.length?saves.map(save=>`<div class="action-row"><div><b>${esc(save.name)}</b><small>${new Date(save.updated).toLocaleString('fr-FR')} · ${esc(byCode(save.state.country).name||save.state.country)} · ${esc(`${save.state.day} ${MONTHS[save.state.month-1]} ${save.state.year}`)}</small></div><div class="table-actions"><button class="button" data-action="load-save" data-id="${save.id}">Charger</button><button class="button danger" data-action="delete-save" data-id="${save.id}">Supprimer</button></div></div>`).join(''):'<div class="empty">Aucune sauvegarde nommée. Créez-en une pour conserver un point de retour.</div>'}</div></div><div class="stack"><div class="card">${cardTitle('Configuration de campagne')}<div class="action-row"><div><b>Dirigeant</b><small>${esc(S.title)} ${esc(S.first)} ${esc(S.last)}</small></div></div><div class="action-row"><div><b>Parti / coalition</b><small>${esc(S.party)}</small></div></div><div class="action-row"><div><b>Scénario</b><small>${esc(({normal:'Mandat contemporain',recovery:'Récession et déficit',tension:'Tensions internationales',reform:'Mandat de réformes'})[S.scenario]||S.scenario)}</small></div></div><div class="button-row"><button class="button" data-action="edit-leader">Modifier le dirigeant</button></div></div><div class="card">${cardTitle('Données & limites')}<p class="muted">La simulation fonctionne localement. Les sauvegardes ne sont pas envoyées sur un serveur et ne se synchronisent pas automatiquement entre appareils. La carte OpenStreetMap nécessite une connexion Internet.</p><p class="muted">Les pays et les données économiques constituent un scénario de jeu simplifié, pas un service d’information politique ou économique en temps réel.</p></div></div></div>`;
  }

  function modal(title, body, description='') {
    $('modalHost').innerHTML=`<div class="modal-backdrop" data-backdrop="1"><section class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-head"><div><h2>${esc(title)}</h2>${description?`<p>${esc(description)}</p>`:''}</div><button class="modal-close" data-action="close-modal" aria-label="Fermer">×</button></div><div class="modal-body">${body}</div></section></div>`;
  }
  function closeModal() { $('modalHost').innerHTML=''; }
  function newBillModal() {
    modal('Rédiger un projet de loi',`<form id="billForm"><div class="form-grid"><label class="span-2">Titre du texte<input name="title" maxlength="100" required placeholder="Ex. Programme national de rénovation"></label><label>Domaine<select name="domain"><option>Finances publiques</option><option>Santé</option><option>Éducation</option><option>Sécurité</option><option>Économie et emploi</option><option>Énergie et climat</option><option>Infrastructures</option><option>Justice et institutions</option><option>Défense</option><option>Autre</option></select></label><label>Coût annuel estimé (Md €)<input name="cost" type="number" min="0" max="${Math.max(1,S.gdp*.2)}" step=".1" value="1.5" required></label><label class="span-2">Résumé du texte<textarea name="description" maxlength="500" required placeholder="Objectif, mesures principales et bénéficiaires..."></textarea></label><label>Effet public attendu<select name="effect"><option value="happiness">Services publics / satisfaction</option><option value="growth">Croissance et emploi</option><option value="security">Sécurité et stabilité</option><option value="education">Éducation</option><option value="health">Santé</option><option value="climate">Transition énergétique</option><option value="none">Mesure sans effet automatique</option></select></label><label>Urgence<select name="urgency"><option value="normal">Procédure normale</option><option value="urgent">Prioritaire</option></select></label></div><div class="button-row"><button class="button primary" type="submit">Enregistrer le projet</button><button class="button" type="button" data-action="close-modal">Annuler</button></div></form>`,'Le texte démarre en rédaction. Vous le déposez ensuite, puis le faites inscrire à l’ordre du jour.');
  }
  function newLoanModal() {
    modal('Demande d’emprunt souverain',`<form id="loanForm"><div class="form-grid"><label>Montant (Md €)<input name="amount" type="number" min="1" max="${Math.max(5,S.gdp*.15)}" step="1" value="10" required></label><label>Échéance<select name="term"><option value="5">5 ans</option><option value="10" selected>10 ans</option><option value="20">20 ans</option><option value="30">30 ans</option></select></label><label class="span-2">Objet de financement<select name="purpose"><option>Financement du déficit</option><option>Infrastructure nationale</option><option>Services publics</option><option>Défense et sécurité</option><option>Transition énergétique</option><option>Réserve de trésorerie</option></select></label></div><div class="notice">Le montant est ajouté aux liquidités et à la dette publique. L’échéance est enregistrée dans le journal ; les intérêts suivent le taux souverain actuel (${pct(S.interestRate)}).</div><div class="button-row"><button class="button primary" type="submit">Confirmer l’emprunt</button></div></form>`,'Exemple de mécanisme de jeu, sans proposition de financement réel.');
  }
  function newProjectModal() {
    modal('Créer un grand projet national',`<form id="projectForm"><div class="form-grid"><label class="span-2">Type de projet<select name="type">${PROJECT_TYPES.map((p,i)=>`<option value="${i}">${esc(p.name)} · ${md(p.cost)} · ${p.duration} mois</option>`).join('')}</select></label><label>Budget prévu (Md ${esc(country().currency)})<input name="cost" type="number" min="0.1" max="${Math.max(1,S.gdp*.2)}" step=".1" value="${PROJECT_TYPES[0].cost}" required></label><label>Durée estimée (mois)<input name="duration" type="number" min="1" max="120" step="1" value="${PROJECT_TYPES[0].duration}" required></label><label class="span-2">Nom de projet personnalisé<input name="name" maxlength="90" placeholder="Optionnel — utilise le nom du type si vide"></label><label class="span-2">Résumé / objectif<textarea name="description" maxlength="300" placeholder="Décrivez l’objectif politique et les bénéfices attendus"></textarea></label></div><div class="notice">Le coût est débité immédiatement du Trésor. Le projet progresse chaque mois et ses effets sont appliqués à la livraison.</div><div class="button-row"><button class="button primary" type="submit">Lancer le projet</button></div></form>`,'Vérifiez la trésorerie disponible avant de confirmer.');
  }
  function newContractModal() {
    modal('Lancer un marché public',`<form id="contractForm"><div class="form-grid"><label class="span-2">Objet du marché<input name="name" maxlength="90" required placeholder="Ex. Fourniture de matériel hospitalier"></label><label>Catégorie<select name="category"><option>Services publics</option><option>Infrastructures</option><option>Défense</option><option>Éducation</option><option>Énergie</option><option>Numérique</option><option>Transport</option></select></label><label>Fournisseur<input name="supplier" maxlength="80" required placeholder="Nom de l’entreprise fictive"></label><label>Valeur du contrat (Md €)<input name="cost" type="number" min=".1" max="${Math.max(1,S.gdp*.1)}" step=".1" value="2" required></label><label>Délai de livraison<select name="duration"><option value="1">1 mois</option><option value="3" selected>3 mois</option><option value="6">6 mois</option><option value="12">12 mois</option></select></label></div><div class="notice">Le paiement est engagé à la signature. Un contrat résilié ne rembourse pas automatiquement l’intégralité des frais.</div><div class="button-row"><button class="button primary" type="submit">Signer le contrat</button></div></form>`,'L’objet, le fournisseur et les chiffres sont des éléments de simulation.');
  }
  function newTradeModal(code) {
    const c=byCode(code), rel=S.relations[code]||{score:50,status:'Relations normales',trade:0};
    modal(`Accord avec ${c.name}`,`<form id="tradeForm"><input type="hidden" name="partner" value="${c.code}"><div class="form-grid"><label>Nature de l’accord<select name="type"><option>Accord commercial</option><option>Partenariat industriel</option><option>Coopération énergétique</option><option>Programme de recherche</option><option>Accord agricole</option><option>Coopération de sécurité</option></select></label><label>Valeur annuelle (Md €)<input name="value" type="number" min=".1" max="${Math.max(1,S.gdp*.08)}" step=".1" value="${Math.max(.2,Number((S.gdp*.001).toFixed(1)))}" required></label><label>Durée<select name="duration"><option value="12">1 an</option><option value="36" selected>3 ans</option><option value="60">5 ans</option></select></label><label>Position actuelle<div class="control">Relations : ${num(rel.score)}/100</div></label></div><div class="notice">La signature améliore la relation bilatérale et ajoute une ligne d’accord. Les valeurs sont simulées et ne constituent pas de données commerciales réelles.</div><div class="button-row"><button class="button primary" type="submit">Signer l’accord</button></div></form>`);
  }
  function newDiplomacyModal(code) {
    const c=byCode(code), r=S.relations[code]||{score:50,status:'Relations normales',trade:0};
    modal(`Dossier diplomatique — ${c.name}`,`<div class="grid cols-2">${kpi('Relations',`${num(r.score)}/100`,r.status)}${kpi('Échanges suivis',md(r.trade||0),'Montant de jeu')}</div><div class="section-label">INITIATIVES DISPONIBLES</div><div class="stack"><div class="action-row"><div><b>Visite officielle</b><small>Améliore le dialogue et la visibilité.</small></div><button class="button" data-action="diplomacy-action" data-id="${code}" data-kind="visit">Organiser</button></div><div class="action-row"><div><b>Proposer un accord commercial</b><small>Créer un accord et augmenter les échanges.</small></div><button class="button" data-action="close-modal-and-trade" data-id="${code}">Négocier</button></div><div class="action-row"><div><b>Programme d’aide bilatérale</b><small>Coût budgétaire contre amélioration des relations.</small></div><button class="button" data-action="diplomacy-action" data-id="${code}" data-kind="aid">Proposer</button></div><div class="action-row"><div><b>Sanctions diplomatiques</b><small>Dégrade les relations et perturbe le commerce.</small></div><button class="button danger" data-action="diplomacy-action" data-id="${code}" data-kind="sanctions">Appliquer</button></div><div class="action-row"><div><b>Proposer une alliance</b><small>Résultat dépendant de la qualité des relations.</small></div><button class="button" data-action="diplomacy-action" data-id="${code}" data-kind="alliance">Proposer</button></div></div>`,'Les relations internationales utilisent des règles simplifiées de simulation.');
  }
  function formObj(form) { return Object.fromEntries(new FormData(form).entries()); }
  function handleAction(action, id='', kind='') {
    const found=(arr)=>arr.find(x=>x.id===id);
    switch(action) {
      case 'close-modal': closeModal(); return;
      case 'new-bill': newBillModal(); return;
      case 'borrow': newLoanModal(); return;
      case 'new-project': newProjectModal(); return;
      case 'new-contract': newContractModal(); return;
      case 'save': {
        modal('Sauvegarder la campagne',`<form id="saveForm"><label class="field">Nom de cette sauvegarde<input name="name" maxlength="90" value="${esc(country().name)} · ${esc(dateLabel())}" required></label><div class="button-row"><button class="button primary" type="submit">Créer la sauvegarde</button></div></form>`,'La sauvegarde locale pourra être rechargée depuis cet appareil.'); return;
      }
      case 'export': exportSave(); return;
      case 'advance-day': advanceDays(1); return;
      case 'advance-month': advanceMonth(); return;
      case 'council': {
        const trust=Object.values(S.ministries).reduce((a,m)=>a+m.trust,0)/Object.keys(S.ministries).length;
        modal('Conseil des ministres',`<div class="grid cols-2">${kpi('Confiance moyenne',`${num(trust)}/100`,'Cabinet')}${kpi('Solde annuel',md(balance()),balance()<0?'Déficit estimé':'Excédent estimé',balance()<0?'bad':'good')}</div><p>Le conseil arbitre les dépenses, examine les projets de loi et priorise la situation économique.</p><div class="stack"><div class="action-row"><div><b>Priorité : activité et emploi</b><small>Effet léger sur la croissance, coût politique modéré.</small></div><button class="button" data-action="council-decision" data-kind="growth">Retenir</button></div><div class="action-row"><div><b>Priorité : services publics</b><small>Améliore la satisfaction, dépenses de fonctionnement plus fortes.</small></div><button class="button" data-action="council-decision" data-kind="services">Retenir</button></div><div class="action-row"><div><b>Priorité : maîtrise de la dette</b><small>Renforce la discipline budgétaire, réduit les dépenses.</small></div><button class="button" data-action="council-decision" data-kind="debt">Retenir</button></div></div>`); return;
      }
      case 'council-decision':
        if(kind==='growth'){S.growth+=.25;S.approval=clamp(S.approval+1);pushNews('Arbitrage du conseil','Le gouvernement priorise l’activité et l’emploi.','good');}
        if(kind==='services'){['Santé','Éducation'].forEach(n=>{S.ministries[n].budget+=S.gdp*.001;});S.happiness=clamp(S.happiness+1);pushNews('Arbitrage du conseil','Des crédits supplémentaires sont orientés vers les services publics.');}
        if(kind==='debt'){Object.values(S.ministries).forEach(m=>m.budget*=.995);S.approval=clamp(S.approval-.5);pushNews('Arbitrage du conseil','Le gouvernement donne la priorité à la maîtrise des dépenses.');}
        closeModal();commit('Décision du conseil enregistrée.');return;
      case 'report-finance':
        pushNews('Rapport financier',`Recettes annuelles ${md(annualRevenue())}, dépenses ${md(annualSpending())}, solde ${md(balance())}, dette ${md(S.debt)}.`); commit('Rapport financier ajouté au journal.'); return;
      case 'report-national':
        pushNews('Rapport national',`Popularité ${pct(S.approval)}, chômage ${pct(S.unemployment)}, inflation ${pct(S.inflation)}, dette / PIB ${pct(debtRatio())}.`); commit('Rapport national ajouté au journal.'); return;
      case 'apply-social': {
        const form=$('societyForm'); if(form){const data=new FormData(form); ['health','education','infrastructure','security','happiness','stability'].forEach(k=>{if(data.has(k))S[k]=Number(data.get(k));});S.poverty=clamp(100-Number(data.get('poverty')),0,80);S.inequality=clamp(100-Number(data.get('inequality')),0,100);} pushNews('Objectifs sociaux mis à jour','Le gouvernement adopte de nouveaux objectifs sociaux.'); commit('Objectifs sociaux enregistrés.'); return;
      }
      case 'apply-taxes': applyTaxForm(); return;
      case 'tax-reset': S.taxes={income:20,vat:20,corporate:25,carbon:10}; commit('Le barème fiscal initial a été rétabli.'); return;
      case 'tax-loopholes': S.taxes.income=clamp(S.taxes.income+1,0,60); S.taxes.corporate=clamp(S.taxes.corporate+1,0,50); S.approval=clamp(S.approval-2);pushNews('Réduction des niches fiscales','Les recettes fiscales estimées augmentent, avec un coût politique.','bad');commit('Mesure fiscale enregistrée.');return;
      case 'tax-audit': S.treasury=Math.max(0,S.treasury-.35); S.events.push({id:uid(),title:'Programme de lutte contre la fraude',remaining:3}); S.approval=clamp(S.approval+1);pushNews('Contrôle fiscal renforcé','Le programme nécessite des moyens administratifs et peut améliorer les recettes futures.');commit('Programme de contrôle lancé.');return;
      case 'tax-relief': S.taxes.income=clamp(S.taxes.income-1,0,60);S.approval=clamp(S.approval+2);S.growth+=.1;pushNews('Allégement fiscal ciblé','Les taux d’imposition sur les revenus sont abaissés d’un point.','good');commit('Allégement fiscal adopté.');return;
      case 'budget-reset': Object.entries(MINISTRY_DEFS).forEach(([i,[name,share]])=>{if(S.ministries[name])S.ministries[name].budget=Math.round(S.gdp*share*10)/10;});commit('Les enveloppes de départ ont été rétablies.');return;
      case 'budget-equalize': Object.values(S.ministries).forEach(m=>m.budget=Math.round(m.budget*.98*10)/10);commit('Les budgets ministériels ont été réduits de 2 %.');return;
      case 'apply-interest': {const n=Number($('interestRate')?.value);if(Number.isFinite(n)&&n>=0&&n<=30){S.interestRate=n;pushNews('Taux souverain modifié',`Le taux d’intérêt moyen de la dette passe à ${pct(n)}.`);commit('Taux d’intérêt mis à jour.');}else toast('Saisissez un taux entre 0 et 30 %.');return;}
      case 'repay-debt': repayDebtModal(); return;
      case 'new-game-confirm': modal('Nouvelle campagne',`<p>Voulez-vous quitter la partie actuelle pour créer une nouvelle présidence ? Une sauvegarde automatique est conservée dans ce navigateur.</p><div class="button-row"><button class="button danger" data-action="new-game">Quitter la partie actuelle</button><button class="button" data-action="close-modal">Annuler</button></div>`);return;
      case 'new-game': closeModal(); $('gameApp').classList.add('hidden'); $('setupScreen').classList.remove('hidden'); S=null;return;
      case 'submit-bill': {const b=found(S.bills);if(!b)return;b.status='En commission';b.support=estimateSupport(b);pushNews('Projet de loi déposé',`Le texte « ${b.title} » est transmis en commission.`);commit('Projet de loi déposé.');return;}
      case 'agenda-bill': {const b=found(S.bills);if(!b)return;b.status='À l’ordre du jour';b.support=estimateSupport(b);pushNews('Inscription à l’ordre du jour',`Le texte « ${b.title} » est inscrit pour un vote.`);commit('Texte inscrit à l’ordre du jour.');return;}
      case 'vote-bill': voteBill(found(S.bills));return;
      case 'promulgate-bill': promulgateBill(found(S.bills));return;
      case 'withdraw-bill': {const b=found(S.bills);if(!b)return;b.status='Retirée';pushNews('Texte retiré',`Le projet « ${b.title} » est retiré de l’ordre du jour.`);commit('Texte retiré.');return;}
      case 'negotiate': {const chance=S.parliament.government<50?17:9; const delta=8+Math.floor(Math.random()*8);S.parliament.government=clamp(S.parliament.government+delta,0,95);S.parliament.opposition=clamp(S.parliament.opposition-delta*.7,0,100);S.parliament.other=100-S.parliament.government-S.parliament.opposition;S.parliament.confidence=clamp(S.parliament.confidence+6);S.treasury=Math.max(0,S.treasury-.2);pushNews('Accord parlementaire',`Une négociation a dégagé ${delta} points de soutien supplémentaire pour la coalition.`,'good');commit('La coalition parlementaire a évolué.');return;}
      case 'opposition-talks': {S.parliament.government=clamp(S.parliament.government+4);S.parliament.opposition=clamp(S.parliament.opposition-4);S.parliament.other=100-S.parliament.government-S.parliament.opposition;S.legitimacy=clamp(S.legitimacy+2);pushNews('Dialogue institutionnel','Des discussions avec l’opposition débouchent sur un compromis partiel.','good');commit('Compromis parlementaire enregistré.');return;}
      case 'confidence': {const yes=S.parliament.government+Math.random()*12-6;const pass=yes>=50;S.parliament.confidence=clamp(S.parliament.confidence+(pass?5:-18));S.stability=clamp(S.stability+(pass?2:-12));S.approval=clamp(S.approval+(pass?1:-6));pushNews('Question de confiance',pass?'Le gouvernement obtient une confiance suffisante dans cette simulation.':'Le vote met en évidence une crise de confiance. Le gouvernement est fragilisé.',pass?'good':'bad');commit(pass?'Confiance confirmée.':'Gouvernement fragilisé.');return;}
      case 'censure': {const pass=S.parliament.opposition+Math.random()*10>50;S.stability=clamp(S.stability+(pass?-18:2));S.parliament.confidence=clamp(S.parliament.confidence+(pass?-25:3));if(pass)S.approval=clamp(S.approval-8);pushNews('Motion de censure',pass?'La motion est adoptée dans la simulation : crise gouvernementale et forte instabilité.':'La motion échoue, le gouvernement conserve une marge de manœuvre.',pass?'bad':'good');commit(pass?'Motion adoptée : crise gouvernementale.':'Motion rejetée.');return;}
      case 'campaign': S.treasury=Math.max(0,S.treasury-.15);S.approval=clamp(S.approval+2+Math.random()*2);S.legitimacy=clamp(S.legitimacy+1);pushNews('Campagne de terrain',`Le déplacement de campagne améliore temporairement le soutien à ${S.title.toLowerCase()}.`,'good');commit('Campagne organisée.');return;
      case 'poll': {const v=Math.round(clamp(S.approval+(Math.random()*6-3)));modal('Sondage national',`<div class="kpi"><small>INTENTIONS DE SOUTIEN AU GOUVERNEMENT</small><strong>${v} %</strong><div class="delta">Marge d’incertitude de jeu : ±3 points</div></div><p>Les résultats sont simulés et n’ont aucune valeur scientifique ou électorale réelle.</p><div class="button-row"><button class="button primary" data-action="close-modal">Terminer</button></div>`);pushNews('Sondage d’opinion',`L’enquête fictive place le soutien à ${v} %.`);saveAuto();return;}
      case 'early-election': runElection(true);return;
      case 'manage-minister': manageMinister(id);return;
      case 'change-minister': changeMinister(id);return;
      case 'reshuffle': reshuffleModal();return;
      case 'confirm-reshuffle': Object.values(S.ministries).forEach(m=>{m.trust=clamp(m.trust+3);m.skill=clamp(m.skill+(Math.random()>.5?2:-1));});S.stability=clamp(S.stability-2);pushNews('Remaniement','Le remaniement cible l’efficacité et la confiance au sein du cabinet.');closeModal();commit('Remaniement effectué.');return;
      case 'report-minister': {const m=S.ministries[id];if(!m)return;pushNews(`Rapport ministériel : ${m.name}`,`Compétence ${m.skill}/100, confiance ${m.trust}/100, enveloppe ${md(m.budget)}.`);m.trust=clamp(m.trust+2);commit('Rapport ministériel ajouté au journal.');return;}
      case 'appoint-minister': appointMinister();return;
      case 'submit-appointment': return;
      case 'close-modal-and-trade': closeModal();newTradeModal(id);return;
      case 'trade-partner': newTradeModal(id);return;
      case 'diplomacy-partner': newDiplomacyModal(id);return;
      case 'diplomacy-action': diplomacyAction(id,kind);return;
      case 'diplomatic-brief': {const avg=Object.values(S.relations).reduce((a,r)=>a+r.score,0)/(Object.keys(S.relations).length||1);modal('Briefing diplomatique',`<div class="grid cols-2">${kpi('Relation moyenne',`${num(avg)}/100`,'Pays suivis')}${kpi('Accords actifs',S.tradeDeals.filter(d=>d.status==='Actif').length,'Accords commerciaux')}</div><p>La ligne diplomatique est définie par la moyenne des relations, les accords en vigueur et les dernières actions.</p><div class="button-row"><button class="button primary" data-action="close-modal">Fermer le briefing</button></div>`);return;}
      case 'select-unit': selectedUnitId=id; renderPage(); return;
      case 'unit-patrol': {const u=found(S.units);if(!u)return;u.status='En patrouille';u.readiness=clamp(u.readiness-2);pushNews('Ordre d’état-major',`${u.name} est affectée à une patrouille de jeu.`);commit('Ordre de patrouille enregistré.');return;}
      case 'unit-rest': {const u=found(S.units);if(!u)return;u.status='Repos';u.readiness=clamp(u.readiness+8);commit('Repos ordonné.');return;}
      case 'unit-recall': {const u=found(S.units);if(!u)return;u.dest=country().center.slice();u.status='Retour à la base';commit('Ordre de retour à la base transmis.');return;}
      case 'rename-unit': renameUnit();return;
      case 'stand-down': {const u=S.units.find(x=>x.id===selectedUnitId);if(!u){toast('Sélectionnez une unité.');return;}u.status='En réserve';u.readiness=clamp(u.readiness+5);commit('Unité placée en réserve.');return;}
      case 'exercise': {if(S.treasury<.2){toast('Trésorerie insuffisante.');return;}S.treasury-=.2;S.security=clamp(S.security+2);S.units.forEach(u=>u.readiness=clamp(u.readiness+3));pushNews('Exercice national de préparation','Les unités sélectionnées ont participé à un exercice de coordination.','good');commit('Exercice terminé.');return;}
      case 'replenish': {const cost=S.gdp*.0002;if(S.treasury<cost){toast(`Trésorerie insuffisante. Coût estimé : ${md(cost)}.`);return;}S.treasury-=cost;S.units.forEach(u=>{u.readiness=clamp(u.readiness+8);u.strength=clamp(u.strength+2);});pushNews('Maintien en condition opérationnelle',`Un programme de soutien aux forces a été financé (${md(cost)}).`);commit('Maintien des forces financé.');return;}
      case 'diplomacy-action': diplomacyAction(id,kind);return;
      case 'cancel-project': cancelProject(id);return;
      case 'cancel-contract': cancelContract(id);return;
      case 'load-save': {const s=getSaves().find(x=>x.id===id);if(!s)return toast('Sauvegarde introuvable.');try{loadState(JSON.parse(JSON.stringify(s.state)));toast('Sauvegarde chargée.');}catch(e){toast(e.message);}closeModal();return;}
      case 'delete-save': {const saves=getSaves().filter(x=>x.id!==id);localStorage.setItem(SAVES_KEY,JSON.stringify(saves));renderPage();toast('Sauvegarde supprimée.');return;}
      case 'edit-leader': editLeaderModal();return;
      default: return;
    }
  }
  function commit(message) { saveAuto(); renderPage(); if(message)toast(message); }
  function applyTaxForm() {
    const f=$('taxForm'); if(!f)return;const d=new FormData(f);
    S.taxes.income=clamp(d.get('income'),0,60);S.taxes.vat=clamp(d.get('vat'),0,35);S.taxes.corporate=clamp(d.get('corporate'),0,50);S.taxes.carbon=clamp(d.get('carbon'),0,100);
    S.approval=clamp(S.approval-((S.taxes.income>24||S.taxes.vat>24)?2:0));S.growth+=S.taxes.vat>25?-.15:.05;
    pushNews('Nouveau barème fiscal',`Taux appliqués : revenu ${pct(S.taxes.income)}, TVA ${pct(S.taxes.vat)}, sociétés ${pct(S.taxes.corporate)}.`);commit('Barème fiscal appliqué.');
  }
  function estimateSupport(b) { return clamp(31+S.parliament.government*.56+(S.approval-50)*.23-(b.cost/S.gdp*250)+(b.urgency==='urgent'?2:0),5,96); }
  function voteBill(b) {
    if(!b)return; b.support=estimateSupport(b);const yes=clamp(b.support+Math.random()*14-7,0,100);b.vote=Number(yes.toFixed(1));
    if(yes>=50){b.status='Adoptée';pushNews('Projet de loi adopté',`Le texte « ${b.title} » est adopté avec un soutien estimé à ${pct(yes)}.`,'good');toast('Le texte est adopté : vous pouvez le promulguer.');}
    else {b.status='Rejetée';pushNews('Projet de loi rejeté',`Le texte « ${b.title} » n’obtient pas la majorité (${pct(yes)}).`,'bad');toast('Le texte est rejeté.');}
    commit();
  }
  function promulgateBill(b) {
    if(!b||b.status!=='Adoptée')return;
    if(S.treasury<b.cost){modal('Trésorerie insuffisante',`<p>La promulgation nécessite ${md(b.cost)} selon le coût estimé du texte, mais le Trésor ne dispose que de ${md(S.treasury)}.</p><div class="button-row"><button class="button primary" data-action="borrow">Demander un emprunt</button><button class="button" data-action="close-modal">Fermer</button></div>`);return;}
    S.treasury-=b.cost;b.status='Promulguée';
    const effect=b.effect;
    if(effect==='health'){S.health=clamp(S.health+5);S.happiness=clamp(S.happiness+2);}
    else if(effect==='education'){S.education=clamp(S.education+5);S.growth+=.1;}
    else if(effect==='security'){S.security=clamp(S.security+5);S.stability=clamp(S.stability+2);}
    else if(effect==='growth'){S.growth+=.3;S.unemployment=clamp(S.unemployment-.3,0,50);}
    else if(effect==='climate'){S.infrastructure=clamp(S.infrastructure+2);S.happiness=clamp(S.happiness+1);}
    else if(effect==='happiness'){S.happiness=clamp(S.happiness+4);}
    if(b.domain==='Finances publiques')S.growth-=.1;
    S.legitimacy=clamp(S.legitimacy+2);S.approval=clamp(S.approval+1);
    pushNews('Loi promulguée',`La loi « ${b.title} » entre en vigueur. Coût imputé au Trésor : ${md(b.cost)}.`,'good');commit('Loi promulguée et effets appliqués.');
  }
  function repayDebtModal() {
    modal('Remboursement anticipé de dette',`<form id="repayForm"><label class="field">Montant à rembourser (Md €)<input name="amount" type="number" min="0.1" max="${Math.max(.1,Math.min(S.treasury,S.debt)).toFixed(1)}" step=".1" value="${Math.max(.1,Math.min(5,S.treasury,S.debt)).toFixed(1)}" required></label><p>Le remboursement diminue la dette et la trésorerie du même montant. Trésorerie : ${md(S.treasury)} ; dette : ${md(S.debt)}.</p><div class="button-row"><button class="button primary" type="submit">Confirmer le remboursement</button></div></form>`);
  }
  function manageMinister(name) {
    const m=S.ministries[name];if(!m)return;
    modal(`Dossier ministériel — ${name}`,`<div class="grid cols-2">${kpi('Compétence',`${m.skill}/100`,'Efficacité du portefeuille')}${kpi('Confiance',`${m.trust}/100`,'Relation avec la présidence')}</div><p>Ministre en fonction : <b>${esc(m.minister)}</b>. Budget annuel : <b>${md(m.budget)}</b>.</p><div class="button-row"><button class="button" data-action="report-minister" data-id="${esc(name)}">Demander un rapport</button><button class="button" data-action="change-minister" data-id="${esc(name)}">Remplacer le ministre</button></div>`);
  }
  function changeMinister(name) {
    const m=S.ministries[name];if(!m)return;
    modal(`Remplacer le ministre — ${name}`,`<form id="ministerForm"><label class="field">Nouveau responsable<input name="minister" value="" maxlength="70" required placeholder="Prénom et nom"></label><label class="field">Profil<select name="profile"><option value="expert">Expert technique</option><option value="political">Profil politique</option><option value="loyal">Fidèle à la coalition</option></select></label><div class="notice">Le remplacement peut améliorer la compétence ou la confiance, mais un remaniement fréquent fragilise l’équipe.</div><div class="button-row"><button class="button primary" type="submit">Nommer ce ministre</button></div></form>`);
    $('ministerForm').dataset.ministry=name;
  }
  function appointMinister() {
    const candidates=Object.keys(S.ministries);
    modal('Nommer un ministre',`<form id="appointmentForm">${selectField('appointmentMinistry','Portefeuille à pourvoir',candidates,candidates[0])}<label class="field">Nom du ministre<input name="minister" maxlength="70" required placeholder="Prénom et nom"></label><label class="field">Profil<select name="profile"><option value="expert">Expert technique</option><option value="political">Profil politique</option><option value="loyal">Fidèle à la coalition</option></select></label><div class="button-row"><button class="button primary" type="submit">Valider la nomination</button></div></form>`);
  }
  function reshuffleModal() {
    modal('Remaniement ciblé',`<p>Un remaniement collectif consomme du capital politique mais peut restaurer la confiance dans l’équipe.</p><div class="button-row"><button class="button primary" data-action="confirm-reshuffle">Confirmer le remaniement</button><button class="button" data-action="close-modal">Annuler</button></div>`);
  }
  function editLeaderModal() {
    modal('Modifier la direction de campagne',`<form id="leaderForm"><div class="form-grid"><label>Prénom<input name="first" value="${esc(S.first)}" required maxlength="40"></label><label>Nom<input name="last" value="${esc(S.last)}" required maxlength="40"></label><label>Fonction<select name="title">${['Président','Présidente','Premier ministre','Chancelier'].map(t=>`<option ${S.title===t?'selected':''}>${t}</option>`).join('')}</select></label><label>Parti / coalition<input name="party" value="${esc(S.party)}" maxlength="60" required></label></div><div class="button-row"><button class="button primary" type="submit">Mettre à jour</button></div></form>`);
  }
  function diplomacyAction(code, kind) {
    const c=byCode(code),r=S.relations[code];if(!r)return;
    if(kind==='visit'){r.score=clamp(r.score+6);r.status=r.score>65?'Partenariat renforcé':'Dialogue actif';S.reputation=clamp(S.reputation+1);pushNews('Visite diplomatique',`La visite officielle à ${c.name} améliore les relations bilatérales.`,'good');}
    else if(kind==='aid'){const cost=Math.max(.2,S.gdp*.00015);if(S.treasury<cost){toast(`Trésorerie insuffisante : ${md(cost)} nécessaires.`);return;}S.treasury-=cost;r.score=clamp(r.score+8);r.status='Coopération bilatérale';pushNews('Programme d’aide bilatérale',`Une enveloppe de ${md(cost)} est engagée au bénéfice de ${c.name}.`);}
    else if(kind==='sanctions'){r.score=clamp(r.score-18);r.trade*=.7;r.status='Relations dégradées';S.approval=clamp(S.approval+(S.security>50?1:-1));pushNews('Mesures diplomatiques',`Des sanctions sont appliquées à ${c.name}. Les échanges estimés diminuent.`, 'bad');}
    else if(kind==='alliance'){if(r.score>=62){r.score=clamp(r.score+5);r.status='Alliance en négociation';S.reputation=clamp(S.reputation+2);pushNews('Négociation d’alliance',`${c.name} accepte d’ouvrir des discussions sur une alliance.`,'good');}else{r.score=clamp(r.score-2);pushNews('Alliance non aboutie',`${c.name} estime les conditions insuffisantes et refuse la proposition initiale.`,'bad');}}
    closeModal();commit('Initiative diplomatique enregistrée.');
  }
  function cancelProject(id) {
    const p=S.projects.find(x=>x.id===id);if(!p||p.status!=='En cours')return;
    p.status='Annulé';S.treasury+=p.cost*(1-p.progress/100)*.25;pushNews('Projet public annulé',`Le projet « ${p.name} » est annulé. Une part limitée des crédits non consommés est restituée.`,'bad');commit('Projet annulé.');
  }
  function cancelContract(id) {
    const c=S.contracts.find(x=>x.id===id);if(!c||c.status!=='En cours')return;
    c.status='Annulé';S.treasury+=c.cost*.15;pushNews('Contrat résilié',`Le contrat « ${c.name} » est résilié ; seuls 15 % de la valeur sont restitués dans ce modèle.`,'bad');commit('Contrat résilié.');
  }
  function renameUnit() {
    const u=S.units.find(x=>x.id===selectedUnitId);if(!u)return toast('Sélectionnez une unité.');
    modal('Renommer une unité',`<form id="unitNameForm"><label class="field">Nom de l’unité<input name="name" value="${esc(u.name)}" maxlength="70" required></label><div class="button-row"><button class="button primary" type="submit">Enregistrer</button></div></form>`);
  }
  function runElection(early) {
    const score=clamp(S.approval*.6+S.legitimacy*.16+S.parliament.government*.16+S.stability*.08+(Math.random()*12-6));
    const win=score>=50;S.electionHistory.unshift({year:S.year,result:score,outcome:win?'La coalition obtient un mandat renouvelé dans la simulation.':'La coalition perd sa majorité dans cette simulation.'});
    if(win){S.term++;S.electionYear=S.year+5;S.parliament.government=clamp(48+score*.25,35,75);S.parliament.opposition=100-S.parliament.government-S.parliament.other;S.legitimacy=clamp(S.legitimacy+5);S.approval=clamp(S.approval+2);}
    else{S.parliament.government=clamp(30+score*.25,20,50);S.parliament.opposition=clamp(100-S.parliament.government-S.parliament.other);S.parliament.confidence=clamp(S.parliament.confidence-20);S.stability=clamp(S.stability-10);S.electionYear=S.year+5;}
    pushNews(early?'Élection anticipée':'Élection nationale',`${win?'La coalition sortante remporte':'La coalition sortante perd'} le scrutin simulé, avec un score estimé de ${pct(score)}.`,win?'good':'bad');commit(win?'La coalition renouvelle son mandat dans le jeu.':'La majorité est perdue.');
  }
  function applyProjectBenefits(p) {
    const def=PROJECT_TYPES.find(x=>x.name===p.typeName);if(!def)return;
    Object.entries(def.benefit).forEach(([key,change])=>{if(key==='growth')S.growth+=change;else if(key==='unemployment')S.unemployment=clamp(S.unemployment+change,0,60);else if(key==='energy')S.infrastructure=clamp(S.infrastructure+change);else if(key==='digital')S.infrastructure=clamp(S.infrastructure+change);else if(key==='housing'){S.happiness=clamp(S.happiness+change*.35);S.poverty=clamp(S.poverty-change*.2,0,80);}else if(key in S)S[key]=clamp(S[key]+change);});
    S.approval=clamp(S.approval+1);S.growth+=.05;
  }
  function advanceDays(days) {
    for(let i=0;i<days;i++) {S.day++;S.daysElapsed++;const date=new Date(S.year,S.month,0);if(S.day>date.getDate()){S.day=1;S.month++;S.monthsElapsed++;if(S.month>12){S.month=1;S.year++;}monthlyUpdate();}}
    renderPage();toast(`${days} jour(s) écoulé(s) · ${dateLabel()}`);
  }
  function advanceMonth() {
    const prevMonth=S.month,prevYear=S.year; S.day=1;
    S.month++;S.monthsElapsed++;S.daysElapsed+=30;
    if(S.month>12){S.month=1;S.year++;}
    monthlyUpdate();renderPage();toast(`Mois clôturé : ${MONTHS[prevMonth-1]} ${prevYear} → ${dateLabel()}`);
  }
  function monthlyUpdate() {
    const rev=annualRevenue(),spend=annualSpending(),bal=rev-spend;
    // Le déficit est financé par émissions de dette, l’excédent augmente la réserve du Trésor.
    if(bal<0) S.debt += (-bal)/12; else S.treasury += bal/12;
    S.gdp=Math.max(1,S.gdp*(1+S.growth/1200));
    const consumptionEffect=(20-S.taxes.vat)*.025+(20-S.taxes.income)*.012;
    S.growth=clamp(S.growth+(Math.random()-.48)*.34+(S.infrastructure-55)*.004+(S.education-55)*.002+consumptionEffect,-15,20);
    S.unemployment=clamp(S.unemployment+(Math.random()-.48)*.2-(S.growth>1?.12:-.04)-(S.growth>2?.03:0),1,55);
    S.inflation=clamp(S.inflation+(Math.random()-.48)*.2+(S.taxes.vat>24?.08:0)+(S.growth>4?.05:0),-1,70);
    S.happiness=clamp(S.happiness+(S.health-55)*.012+(S.education-55)*.008+(S.unemployment<7?.15:-.2)+(S.inflation>6?-.3:.05)-(S.poverty>25?.12:0));
    S.stability=clamp(S.stability+(S.approval-50)*.014+(S.parliament.confidence-50)*.02-(S.inflation>10?1:0));
    S.approval=clamp(S.approval+(S.happiness-60)*.035+(S.growth-1)*.14-(S.unemployment>10?.2:0)+(Math.random()-.5)*1.4);
    S.legitimacy=clamp(S.legitimacy+(S.approval-50)*.01+(S.stability-50)*.01);
    Object.values(S.ministries).forEach(m=>{m.trust=clamp(m.trust+(m.skill-60)*.015+(Math.random()-.5)*1.4);});
    S.projects.filter(p=>p.status==='En cours').forEach(p=>{p.progress=clamp(p.progress+100/p.duration);p.remaining=Math.max(0,p.duration-Math.floor(p.progress/100*p.duration));if(p.progress>=100){p.status='Livré';p.remaining=0;applyProjectBenefits(p);pushNews('Projet national livré',`Le projet « ${p.name} » est achevé. Les effets de l’investissement sont intégrés aux indicateurs.`, 'good');}});
    S.contracts.filter(c=>c.status==='En cours').forEach(c=>{c.remaining--;if(c.remaining<=0){c.status='Livré';pushNews('Livraison de marché public',`Le contrat « ${c.name} » est livré par ${c.supplier}.`,'good');}});
    S.tradeDeals.filter(d=>d.status==='Actif').forEach(d=>{d.remaining--;if(d.remaining<=0){d.status='Terminé';const r=S.relations[d.partner];if(r)r.score=clamp(r.score-1);}});
    S.units.forEach(u=>{
      if(u.dest){const dLat=u.dest[0]-u.lat,dLng=u.dest[1]-u.lng,dist=Math.hypot(dLat,dLng);if(dist<.2){u.lat=u.dest[0];u.lng=u.dest[1];u.dest=null;u.status='Arrivée à destination';pushNews('Mouvement d’unité terminé',`${u.name} a rejoint sa destination de jeu.`);}else{u.lat+=dLat*.25;u.lng+=dLng*.25;u.status='En déplacement';u.readiness=clamp(u.readiness-1);}}
      else if(u.status==='En repos'||u.status==='En réserve')u.readiness=clamp(u.readiness+2);
    });
    S.events=S.events.filter(e=>{e.remaining--;return e.remaining>0;});
    if(S.monthsElapsed%3===0)pushNews('Point de conjoncture',`Croissance ${pct(S.growth)}, chômage ${pct(S.unemployment)}, inflation ${pct(S.inflation)}. Solde annuel estimé : ${md(balance())}.`);
    if(Math.random()<.16) createRandomEvent();
    if(S.year>=S.electionYear&&S.month===1&&S.day===1) pushNews('Échéance électorale','Une échéance électorale est inscrite au calendrier. Consultez l’opinion et le Parlement.','system');
    if(S.treasury<1){S.stability=clamp(S.stability-2);pushNews('Trésorerie sous tension','Les liquidités sont faibles. Envisagez un financement, des économies ou une révision des projets.','bad');}
    saveAuto();
  }
  function createRandomEvent() {
    const pool=[
      {title:'Hausse des coûts énergétiques',body:'Les coûts de l’énergie pèsent sur les ménages et les entreprises.',action:()=>{S.inflation=clamp(S.inflation+.25);S.approval=clamp(S.approval-1);}},
      {title:'Dynamisme à l’export',body:'Certains secteurs exportateurs tirent temporairement l’activité.',action:()=>{S.growth+=.18;S.approval=clamp(S.approval+1);}},
      {title:'Tension sociale sectorielle',body:'Des organisations professionnelles réclament des mesures sur les revenus.',action:()=>{S.stability=clamp(S.stability-1);S.events.push({id:uid(),title:'Tension sociale sectorielle',remaining:2});}},
      {title:'Investissement privé annoncé',body:'Un investissement industriel soutient légèrement les perspectives d’emploi.',action:()=>{S.growth+=.15;S.unemployment=clamp(S.unemployment-.1);}},
      {title:'Incident informatique administratif',body:'Un service public rencontre une perturbation temporaire.',action:()=>{S.security=clamp(S.security-1);S.treasury=Math.max(0,S.treasury-.1);}}
    ];
    const e=pool[Math.floor(Math.random()*pool.length)];e.action();pushNews(e.title,e.body); 
  }

  function initMap() {
    if (!window.L) { $('mapStatus').textContent='La bibliothèque cartographique n’a pas été chargée. Vérifiez votre connexion ; la liste des unités reste disponible.'; return; }
    if (mapInstance) { mapInstance.remove(); mapInstance=null; }
    const c=country(); const node=$('worldMap'); if(!node)return;
    mapInstance=L.map(node,{worldCopyJump:true,scrollWheelZoom:true}).setView(c.center,3.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; OpenStreetMap contributors'}).addTo(mapInstance);
    mapLayers=[];
    S.units.forEach(u=>{
      const icon=L.divIcon({className:'unit-marker-wrap',html:`<div style="width:29px;height:29px;display:grid;place-items:center;background:${u.id===selectedUnitId?'#e7bd72':'#172b43'};border:2px solid ${u.id===selectedUnitId?'#fff0ce':'#9db0c5'};border-radius:50%;color:${u.id===selectedUnitId?'#111b27':'#edf3fb'};font-weight:900;font-size:13px;box-shadow:0 3px 9px #0008">${u.type==='Air'?'✈':u.type==='Mer'?'⚓':'◆'}</div>`,iconSize:[29,29],iconAnchor:[14,14]});
      const marker=L.marker([u.lat,u.lng],{icon,title:u.name}).addTo(mapInstance).bindPopup(`<b>${esc(u.name)}</b><br>${esc(u.status)}<br>Préparation : ${num(u.readiness)}/100`);
      marker.on('click',()=>{selectedUnitId=u.id;$('unitDetail').innerHTML=renderUnitDetail(u.id);document.querySelectorAll('.unit-card').forEach(x=>x.classList.toggle('selected',x.dataset.id===u.id));});mapLayers.push(marker);
      if(u.dest){const line=L.polyline([[u.lat,u.lng],u.dest],{color:'#e7bd72',weight:2,dashArray:'6 6'}).addTo(mapInstance);mapLayers.push(line);}
    });
    mapClickHandler=(e)=>{
      const u=S.units.find(x=>x.id===selectedUnitId);if(!u){$('mapStatus').textContent='Sélectionnez d’abord une unité dans la liste pour pouvoir lui donner un ordre.';return;}
      modal(`Confirmer la destination — ${u.name}`,`<p>Assigner à l’unité sélectionnée une destination à <b>${fmt(e.latlng.lat,3)}, ${fmt(e.latlng.lng,3)}</b> ? Son marqueur progressera vers ce point au fil des mois de jeu.</p><div class="button-row"><button class="button primary" data-action="confirm-move" data-id="${u.id}" data-lat="${e.latlng.lat}" data-lng="${e.latlng.lng}">Confirmer le déplacement</button><button class="button" data-action="close-modal">Annuler</button></div>`,'Ordre de déplacement fictif dans la partie.');
    };
    mapInstance.on('click',mapClickHandler);
    $('mapStatus').textContent=`Carte chargée · ${S.units.length} unités affichées · cliquez sur une unité puis sur la destination. Fonds © OpenStreetMap.`;
  }
  function confirmMove(id,lat,lng) {
    const u=S.units.find(x=>x.id===id);if(!u)return;u.dest=[Number(lat),Number(lng)];u.status='En déplacement';selectedUnitId=id;pushNews('Ordre de mouvement',`${u.name} reçoit une destination de jeu (${fmt(lat,2)}, ${fmt(lng,2)}).`);closeModal();commit('Ordre de déplacement enregistré.');
  }

  function onSubmit(event) {
    const f=event.target;if(!(f instanceof HTMLFormElement))return;
    if(f.id==='taxForm'){event.preventDefault();applyTaxForm();return;}
    if(f.id==='societyForm'){event.preventDefault();handleAction('apply-social');return;}
    if(f.dataset.ministryForm){event.preventDefault();const name=f.dataset.ministryForm,m=S.ministries[name],amount=Number(new FormData(f).get('budget'));if(!m||!Number.isFinite(amount)||amount<0||amount>S.gdp*.25){toast('Budget invalide : saisissez un montant positif et raisonnable.');return;}const old=m.budget;m.budget=Math.round(amount*10)/10;pushNews('Arbitrage budgétaire',`L’enveloppe annuelle du ministère ${name} passe de ${md(old)} à ${md(m.budget)}.`);commit('Budget ministériel appliqué.');return;}
    if(f.id==='billForm') {event.preventDefault();const d=formObj(f);const cost=Math.max(0,Number(d.cost)||0);S.bills.push({id:uid(),title:d.title.trim(),domain:d.domain,description:d.description.trim(),cost,effect:d.effect,urgency:d.urgency,status:'En rédaction',support:estimateSupport({cost,urgency:d.urgency})});closeModal();pushNews('Projet de loi rédigé',`Le texte « ${d.title.trim()} » est ajouté au registre en rédaction.`);commit('Projet de loi créé.');}
    else if(f.id==='loanForm'){event.preventDefault();const d=formObj(f),amount=Number(d.amount);if(!(amount>0)||amount>S.gdp*.15){toast('Montant d’emprunt invalide.');return;}S.debt+=amount;S.treasury+=amount;pushNews('Emprunt souverain réalisé',`Un emprunt de ${md(amount)} est enregistré pour : ${d.purpose}. Échéance annoncée : ${d.term} ans.`,'bad');closeModal();commit(`Emprunt de ${md(amount)} enregistré.`);}
    else if(f.id==='projectForm'){event.preventDefault();const d=formObj(f),def=PROJECT_TYPES[Number(d.type)],cost=Number(d.cost),duration=Number(d.duration);if(!def)return;if(!(cost>0)||cost>S.gdp*.2||!Number.isInteger(duration)||duration<1||duration>120){toast('Budget ou durée du projet invalide.');return;}const name=d.name.trim()||def.name;if(S.treasury<cost){toast(`Trésorerie insuffisante : le projet coûte ${md(cost)}.`);return;}S.treasury-=cost;S.projects.push({id:uid(),name,typeName:def.name,description:d.description.trim(),ministry:def.ministry,cost,duration,remaining:duration,progress:0,status:'En cours'});closeModal();pushNews('Grand projet lancé',`Le projet « ${name} » est lancé pour ${md(cost)} sur ${duration} mois.`);commit('Grand projet lancé.');}
    else if(f.id==='contractForm'){event.preventDefault();const d=formObj(f),cost=Number(d.cost),duration=Number(d.duration);if(!(cost>0)||cost>S.gdp*.1){toast('Montant de marché invalide.');return;}if(S.treasury<cost){toast(`Trésorerie insuffisante : ${md(cost)} nécessaires.`);return;}S.treasury-=cost;S.contracts.push({id:uid(),name:d.name.trim(),category:d.category,supplier:d.supplier.trim(),cost,duration,remaining:duration,status:'En cours'});closeModal();pushNews('Marché public signé',`Le contrat « ${d.name} » est signé pour ${md(cost)}, fournisseur : ${d.supplier}.`);commit('Contrat public signé.');}
    else if(f.id==='tradeForm'){event.preventDefault();const d=formObj(f),r=S.relations[d.partner];const value=Number(d.value),months=Number(d.duration);if(!(value>0)){toast('Valeur commerciale invalide.');return;}S.tradeDeals.push({id:uid(),partner:d.partner,type:d.type,value,remaining:months,status:'Actif'});if(r){r.score=clamp(r.score+7);r.status='Accord commercial actif';r.trade=Number(r.trade||0)+value;}S.growth+=.1;S.reputation=clamp(S.reputation+1);closeModal();pushNews('Accord commercial signé',`Un accord « ${d.type} » est signé avec ${byCode(d.partner).name}, valeur annuelle ${md(value)}.`,'good');commit('Accord commercial signé.');}
    else if(f.id==='saveForm'){event.preventDefault();const name=formObj(f).name.trim();closeModal();saveState(name);}
    else if(f.id==='repayForm'){event.preventDefault();const amount=Number(formObj(f).amount);if(!(amount>0)||amount>S.treasury||amount>S.debt){toast('Le remboursement dépasse la trésorerie ou la dette.');return;}S.treasury-=amount;S.debt-=amount;closeModal();pushNews('Remboursement de dette',`Le Trésor rembourse ${md(amount)} de dette publique.`,'good');commit('Dette remboursée.');}
    else if(f.id==='ministerForm'){event.preventDefault();const d=formObj(f),name=f.dataset.ministry,m=S.ministries[name];if(!m)return;m.minister=d.minister.trim();m.skill=clamp(m.skill+(d.profile==='expert'?12:d.profile==='loyal'?3:5));m.trust=clamp(m.trust+(d.profile==='loyal'?12:2));S.stability=clamp(S.stability-1);closeModal();pushNews('Remaniement ministériel',`${m.minister} est nommé(e) à la tête de ${name}.`);commit('Ministre nommé.');}
    else if(f.id==='appointmentForm'){event.preventDefault();const d=formObj(f),m=S.ministries[d.appointmentMinistry];if(!m)return;m.minister=d.minister.trim();m.skill=clamp(55+(d.profile==='expert'?20:0));m.trust=clamp(60+(d.profile==='loyal'?15:0));closeModal();pushNews('Nomination ministérielle',`${m.minister} prend la tête de ${m.name}.`);commit('Nomination enregistrée.');}
    else if(f.id==='leaderForm'){event.preventDefault();const d=formObj(f);S.first=d.first.trim();S.last=d.last.trim();S.title=d.title;S.party=d.party.trim();closeModal();pushNews('Direction de campagne modifiée',`${S.title} ${S.first} ${S.last} représente désormais ${S.party}.`);commit('Profil mis à jour.');}
    else if(f.id==='unitNameForm'){event.preventDefault();const u=S.units.find(x=>x.id===selectedUnitId);if(!u)return;u.name=formObj(f).name.trim();closeModal();commit('Unité renommée.');}
  }
  function handleClick(event) {
    const pageBtn=event.target.closest('[data-page]');if(pageBtn){go(pageBtn.dataset.page);return;}
    const actionBtn=event.target.closest('[data-action]');if(actionBtn){const a=actionBtn.dataset.action;handleAction(a,actionBtn.dataset.id||'',actionBtn.dataset.kind||'');if(a==='confirm-move')confirmMove(actionBtn.dataset.id,actionBtn.dataset.lat,actionBtn.dataset.lng);return;}
    if(event.target.closest('[data-backdrop]')&&event.target===event.target.closest('[data-backdrop]'))closeModal();
  }
  function onChange(event) {
    const t=event.target;
    if(t.id==='countrySelect')updatePreview();
    if(t.form&&t.form.id==='projectForm'&&t.name==='type'){const def=PROJECT_TYPES[Number(t.value)];if(def){const c=t.form.elements.namedItem('cost'),d=t.form.elements.namedItem('duration');if(c)c.value=def.cost;if(d)d.value=def.duration;}}
    if(t.matches('[data-social-range]')){const id=t.dataset.socialRange,el=$(`value-${id}`);if(el)el.textContent=`${t.value}/100`;}
    if(t.id==='interestRate'){const n=Number(t.value);const el=$('interestPreview');if(el)el.textContent=md(S.debt*n/100);}
    if(t.id==='importFile'&&t.files&&t.files[0]){
      const file=t.files[0],reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);loadState(data.state||data);toast('Partie importée.');}catch(e){toast('Fichier invalide : '+e.message);}};reader.readAsText(file);
    }
  }
  function onSubmitDelegated(e) { onSubmit(e); }
  function startBindings() {
    $('startGame').addEventListener('click',createGame);$('countrySelect').addEventListener('change',updatePreview);
    $('mainNav').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b)go(b.dataset.page);});
    $('pageContent').addEventListener('click',handleClick);$('modalHost').addEventListener('click',handleClick);
    document.body.addEventListener('submit',onSubmitDelegated);document.body.addEventListener('change',onChange);
    $('advanceDay').addEventListener('click',()=>S&&advanceDays(1));$('advanceMonth').addEventListener('click',()=>S&&advanceMonth());$('mobileMenu').addEventListener('click',()=>$('sidebar').classList.toggle('open'));
    $('changeCountry').addEventListener('click',()=>{if(S)go('saves');});
  }
  // prevent duplicate action listeners for movement and keep modal submissions delegated
  document.addEventListener('DOMContentLoaded',()=>{});
  initPicker();startBindings();
  try {
    const raw=localStorage.getItem(STORAGE_KEY);
    if(raw){const data=JSON.parse(raw);if(data&&data.country&&data.ministries){$('setupScreen').classList.remove('hidden');const resume=document.createElement('button');resume.className='button secondary full';resume.id='resumeGame';resume.textContent=`Reprendre la campagne (${byCode(data.country).name} · ${data.day} ${MONTHS[data.month-1]} ${data.year})`;resume.style.maxWidth='410px';resume.style.margin='14px auto 0';resume.addEventListener('click',()=>{try{loadState(data);}catch(e){toast(e.message);}});$('setupScreen').querySelector('.setup-card').appendChild(resume);}}
  } catch (_) {}
})();
