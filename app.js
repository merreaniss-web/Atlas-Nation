/* ATLAS NATIONS 1.0 — simulation déterministe par tick, sauvegarde locale et import/export. */
(() => {
"use strict";
const $=id=>document.getElementById(id);
const GEO_URL="https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
const BASE=[
["FRA","France","Europe",2900,68,7.4,2.1,96,67,2.1,65,74,"République"],
["USA","États-Unis","Amérique du Nord",28700,66,4.1,3.0,123,78,3.4,82,75,"République fédérale"],
["CHN","Chine","Asie",18500,71,5.2,1.2,83,76,1.7,73,78,"République populaire"],
["DEU","Allemagne","Europe",4600,69,3.2,2.4,64,69,2.0,76,80,"République fédérale"],
["JPN","Japon","Asie",4200,67,2.6,2.0,255,64,1.2,72,82,"Monarchie constitutionnelle"],
["GBR","Royaume-Uni","Europe",3500,65,4.3,2.7,100,68,2.3,76,78,"Monarchie parlementaire"],
["IND","Inde","Asie",3900,72,7.8,4.5,82,63,2.4,61,70,"République fédérale"],
["BRA","Brésil","Amérique du Sud",2200,61,7.9,4.0,76,62,1.5,60,66,"République fédérale"],
["CAN","Canada","Amérique du Nord",2200,70,6.2,2.5,107,70,1.3,77,79,"Monarchie parlementaire fédérale"],
["ITA","Italie","Europe",2300,62,7.2,1.9,138,61,1.5,70,72,"République"],
["ESP","Espagne","Europe",1600,68,11.5,2.8,105,62,1.2,72,76,"Monarchie parlementaire"],
["AUS","Australie","Océanie",1700,73,4.0,3.1,50,72,2.0,77,81,"Monarchie parlementaire fédérale"],
["RUS","Russie","Europe / Asie",2000,59,3.2,7.0,20,67,4.1,58,58,"Fédération"],
["KOR","Corée du Sud","Asie",1800,66,2.8,2.6,54,67,2.7,75,78,"République"],
["MEX","Mexique","Amérique du Nord",1800,62,2.8,4.0,54,59,0.7,62,65,"République fédérale"],
["IDN","Indonésie","Asie",1400,70,5.0,2.8,39,60,0.8,60,68,"République"],
["NLD","Pays-Bas","Europe",1200,72,3.6,2.5,45,67,1.8,79,82,"Monarchie constitutionnelle"],
["SAU","Arabie saoudite","Moyen-Orient",1100,64,5.0,2.0,26,75,7.5,68,69,"Monarchie"],
["TUR","Turquie","Europe / Asie",1100,55,9.0,35.0,30,65,2.1,59,57,"République"],
["CHE","Suisse","Europe",900,77,4.4,1.4,40,72,0.8,84,86,"Confédération"],
["POL","Pologne","Europe",850,66,5.0,3.2,50,68,4.1,70,74,"République"],
["BEL","Belgique","Europe",650,68,5.7,2.8,105,62,1.2,77,78,"Monarchie fédérale"],
["SWE","Suède","Europe",600,76,7.5,2.2,32,72,1.9,82,84,"Monarchie constitutionnelle"],
["NOR","Norvège","Europe",580,79,3.8,2.5,40,78,1.7,86,88,"Monarchie constitutionnelle"],
["ARG","Argentine","Amérique du Sud",640,57,7.5,120,85,56,0.7,56,59,"République fédérale"],
["ZAF","Afrique du Sud","Afrique",400,52,32,5.0,75,54,0.8,54,58,"République"],
["EGY","Égypte","Afrique",380,58,7.0,25,90,62,1.2,53,60,"République"],
["MAR","Maroc","Afrique",150,66,13,2.5,70,63,1.4,62,68,"Monarchie constitutionnelle"],
["UKR","Ukraine","Europe",190,48,14,8,90,62,4.5,55,53,"République"],
["NZL","Nouvelle-Zélande","Océanie",260,74,4.8,2.7,45,70,1.5,81,83,"Monarchie parlementaire"],
["PRT","Portugal","Europe",300,69,6.5,2.4,98,60,1.8,75,77,"République"],
["GRC","Grèce","Europe",250,63,10.5,2.8,160,58,3.2,68,69,"République"],
["IRL","Irlande","Europe",560,73,4.5,2.7,43,66,0.3,79,82,"République"],
["ISR","Israël","Moyen-Orient",520,67,3.5,3.0,60,73,4.5,70,73,"République"],
["ARE","Émirats arabes unis","Moyen-Orient",510,75,2.7,2.0,30,78,5.0,72,76,"Fédération"],
["SGP","Singapour","Asie",530,77,2.0,2.5,170,78,3.0,86,89,"République parlementaire"],
["NGA","Nigeria","Afrique",250,50,9.0,18,40,50,0.6,46,50,"République fédérale"],
["PAK","Pakistan","Asie",370,53,6.5,12,75,53,1.0,48,54,"République fédérale"],
["THA","Thaïlande","Asie",520,62,1.2,1.5,62,56,1.3,63,68,"Monarchie constitutionnelle"],
["VNM","Viêt Nam","Asie",470,68,2.2,3.5,37,66,2.3,59,66,"République socialiste"],
["CHL","Chili","Amérique du Sud",330,68,8.5,4.0,39,64,1.8,70,74,"République"]
];
const flag=code=>{code=String(code||"").toUpperCase();return /^[A-Z]{2}$/.test(code)?String.fromCodePoint(...[...code].map(c=>127397+c.charCodeAt(0))):"🏳️"};
const countries=BASE.map(a=>({code:a[0],name:a[1],region:a[2],gdp:a[3],happiness:a[4],unemployment:a[5],inflation:a[6],debt:a[7],stability:a[8],defense:a[9],influence:a[10],approval:a[11],government:a[12]}));
const countryByCode=code=>countries.find(c=>c.code===code);
let state=null,speed=0,timer=null,maps={},geoJson=null,toastTimer=null;
const fmt=(n,d=1)=>Number(n).toLocaleString("fr-FR",{minimumFractionDigits:d,maximumFractionDigits:d});
const money=n=>{const a=Math.abs(n);return (n<0?"−":"")+"€ "+(a>=1000?fmt(a/1000,2)+" T":fmt(a,0)+" Md");};
const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
const dateText=s=>new Date(s.year,s.month-1,s.day).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric"}).toUpperCase();
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function notify(message){const t=$("toast");t.textContent=message;t.classList.remove("hidden");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.add("hidden"),2600);}
function newState(c){
 const s={version:1,code:c.code,name:c.name,region:c.region,government:c.government,year:2026,month:1,day:1,hour:8,
 gdp:c.gdp,budget:c.gdp*.028,growth:1.2,unemployment:c.unemployment,inflation:c.inflation,debt:c.debt,happiness:c.happiness,stability:c.stability,defense:c.defense,influence:c.influence,approval:c.approval,
 tax:30,health:50,education:50,infrastructure:50,climate:40,research:35,trade:50,security:50,monthlySpend:0,months:0,days:0,difficulty:$("difficulty").value,scenario:$("scenario").value,
 population:Math.max(1,Math.round(c.gdp/10)),treasury:Math.max(10,Math.round(c.gdp*.06)),electionYear:2031,termStart:2026,party:"Alliance nationale",electionCount:0,
 history:Array.from({length:12},(_,i)=>100+i*.65),news:[],relations:{},treaties:[],wars:[],regions:[],projects:[],researchUnlocked:[],eventsSeen:[],electionResult:null};
 s.population=Math.round(c.gdp*0.23);s.treasury=Math.round(c.gdp*.035);
 s.regions=makeRegions(c);
 s.news.push({title:"Le gouvernement entre en fonction",body:`Vous prenez la direction de ${c.name}. Votre équipe présente les premiers dossiers nationaux.`,date:"01/01/2026"});
 s.news.push({title:"État des lieux économique",body:`La croissance initiale est estimée à ${fmt(s.growth)} % dans ce scénario de jeu.`,date:"01/01/2026"});
 countries.forEach(other=>{if(other.code!==c.code)s.relations[other.code]=Math.round(45+Math.random()*25);});
 if(s.scenario==="recovery"){s.growth=-1.8;s.unemployment+=3;s.budget=-Math.abs(s.budget);s.approval-=7;s.happiness-=4;}
 if(s.scenario==="tension"){s.stability-=8;s.defense+=1;s.influence-=4;Object.keys(s.relations).forEach(k=>s.relations[k]-=Math.round(Math.random()*14));}
 if(s.difficulty==="easy"){s.growth+=.5;s.approval+=5;s.budget*=1.15;}
 if(s.difficulty==="hard"){s.growth-=.6;s.approval-=8;s.debt+=10;s.stability-=8;}
 return s;
}
function makeRegions(c){const names=["Capitale","Région du Nord","Région du Sud","Région de l’Est","Région de l’Ouest","Zone côtière"];return names.map((name,i)=>({id:i,name,population:Math.round(c.gdp*(.025+Math.random()*.055)),prosperity:Math.round(clamp(c.happiness+(Math.random()-.5)*20)),infrastructure:Math.round(clamp(45+Math.random()*35)),unemployment:Math.max(1,c.unemployment+(Math.random()-.5)*5),loyalty:Math.round(clamp(c.approval+(Math.random()-.5)*20))}));}
function addNews(title,body){state.news.unshift({title,body,date:`${String(state.day).padStart(2,"0")}/${String(state.month).padStart(2,"0")}/${state.year}`});state.news=state.news.slice(0,10);renderNews();}
function renderNews(){$("news").innerHTML=state.news.map(n=>`<article class="news-item"><span class="news-dot">●</span><div><b>${esc(n.title)}</b><p>${esc(n.body)}</p><small>${esc(n.date)}</small></div></article>`).join("");}
function render(){
 if(!state)return;
 $("clock").textContent=`${String(state.day).padStart(2,"0")} ${new Date(state.year,state.month-1).toLocaleDateString("fr-FR",{month:"short"}).toUpperCase()} ${state.year} · ${String(state.hour).padStart(2,"0")}:00`;
 $("long-date").textContent=dateText(state);$("speed-chip").textContent=speed===0?"PAUSE":`×${speed} TEMPS`;
 $("nation-name").textContent=state.name;$("nation-flag").textContent=flag(state.code);$("nation-region").textContent=state.region.toUpperCase()+" · NATION";$("government-label").textContent=state.government;
 $("leader-label").textContent="Chef du gouvernement : vous";$("term-label").textContent=`Mandat ${state.termStart}–${state.electionYear}`;
 $("approval").textContent=Math.round(state.approval)+"%";bar("approval",state.approval);
 $("kpi-gdp").textContent=money(state.gdp);$("kpi-growth").textContent=(state.growth>=0?"+":"")+fmt(state.growth)+" %";$("kpi-growth").className=state.growth>=0?"":"bad";
 $("kpi-budget").textContent=money(state.budget);$("kpi-budget-note").textContent=state.budget>=0?"Solde public positif":"Déficit public";$("kpi-budget-note").className=state.budget>=0?"":"bad";
 $("kpi-unemployment").textContent=fmt(state.unemployment)+" %";$("kpi-employment-note").textContent=state.unemployment<6?"Marché dynamique":"Marché sous tension";$("kpi-employment-note").className=state.unemployment<6?"":"bad";
 $("kpi-inflation").textContent=fmt(state.inflation)+" %";$("kpi-inflation-note").textContent=state.inflation>5?"Prix sous pression":"Indice des prix";$("kpi-inflation-note").className=state.inflation>5?"bad":"";
 $("stability").textContent=Math.round(state.stability)+"/100";bar("stability",state.stability);$("happiness").textContent=Math.round(state.happiness)+"/100";bar("happiness",state.happiness);
 $("debt").textContent=fmt(state.debt,0)+" % du PIB";bar("debt",state.debt/2);$("defense").textContent=fmt(state.defense)+" % du PIB";bar("defense",state.defense*15);
 $("influence").textContent=Math.round(state.influence)+"/100";bar("influence",state.influence);
 $("objectives").innerHTML=[
 ["Stabilité politique",state.stability>=50,"Maintenir au-dessus de 50"],
 ["Croissance économique",state.growth>=2,"Atteindre 2 % de croissance"],
 ["Bien-être de la population",state.happiness>=70,"Bonheur supérieur à 70"],
 ["Finances soutenables",state.debt<100,"Dette sous 100 % du PIB"],
 ["Popularité",state.approval>=50,"Garder le soutien majoritaire"]
 ].map(o=>`<div class="objective"><span class="check ${o[1]?"":"pending"}">${o[1]?"✓":"○"}</span><div><b>${o[0]}</b><small>${o[2]}</small></div></div>`).join("");
 document.querySelectorAll(".speed").forEach(b=>b.classList.toggle("active",+b.dataset.speed===speed));
 drawChart();if(maps.world&&geoJson)styleGeoLayer();
}
function bar(id,value){const el=$(id+"-bar");if(el)el.style.width=clamp(value)+"%";}
function tick(){
 if(!state||speed===0)return;
 for(let n=0;n<speed;n++){
  state.hour+=24;state.days++;
  const totalDays=new Date(state.year,state.month,0).getDate();
  while(state.hour>=24){state.hour-=24;state.day++;}
  if(state.day>totalDays){state.day=1;state.month++;if(state.month>12){state.month=1;state.year++;}}
  if(state.day===1&&state.hour===0)monthlyUpdate();
  if(state.days%90===0)quarterlyUpdate();
  if(state.days%365===0)annualUpdate();
 }
 render();
}
function monthlyUpdate(){
 state.months++;
 const difficulty=state.difficulty==="hard"?1.5:state.difficulty==="easy"?.65:1;
 const policy=(state.infrastructure-50)*.008+(state.education-50)*.005+(state.research-35)*.006+(state.climate-40)*.002;
 const instability=(state.stability<35?-.25:0);
 state.growth=clamp(state.growth+(Math.random()-.48)*.48+policy-.08*difficulty+instability,-12,15);
 state.gdp=Math.max(1,state.gdp*(1+state.growth/1200));
 const revenue=state.gdp*(state.tax/3000);
 const spend=state.gdp*(.023+(state.health/100)*.007+(state.education/100)*.006+(state.infrastructure/100)*.005+(state.defense/100)*.001+(state.climate/100)*.002);
 state.budget+=revenue-spend;
 state.treasury+=revenue-spend;
 state.debt=clamp(state.debt+(state.budget<0?.45:-.18)+(state.inflation>8?.15:0),0,350);
 state.unemployment=clamp(state.unemployment+(Math.random()-.52)*.35-(state.growth>1?.12:-.03)-(state.education-50)*.001,1,45);
 state.inflation=clamp(state.inflation+(Math.random()-.5)*.5+(state.tax<22?.08:0)+(state.growth>5?.1:0),-2,150);
 state.happiness=clamp(state.happiness+(state.health-50)*.006+(state.education-50)*.003+(state.unemployment<6?.12:-.15)+(state.inflation>7?-.35:.05)+(state.budget<0?-.08:0),0,100);
 state.stability=clamp(state.stability+(state.approval-50)*.014+(state.inflation>10?-.45:0)+(state.happiness<40?-.3:0),0,100);
 state.approval=clamp(state.approval+(state.happiness-60)*.03+(state.growth-1)*.18+(state.unemployment<6?.15:-.1)+(Math.random()-.5)*1.4,0,100);
 state.influence=clamp(state.influence+(state.stability>60?.04:-.08)+(state.treaties.length*.03),0,100);
 state.population=Math.max(1,Math.round(state.population*(1+(state.happiness-50)*.000015)));
 state.history.push(state.history.at(-1)*(1+state.growth/1200));if(state.history.length>36)state.history.shift();
 state.regions.forEach(r=>{r.prosperity=clamp(r.prosperity+(state.growth*.08)+(state.infrastructure-50)*.002+(Math.random()-.5));r.unemployment=clamp(r.unemployment+(state.unemployment-r.unemployment)*.06,0,50);r.loyalty=clamp(r.loyalty+(state.approval-r.loyalty)*.04,0,100);});
 if(state.months%3===0)addNews("Rapport de conjoncture",`PIB ${money(state.gdp)} · croissance ${fmt(state.growth)} % · chômage ${fmt(state.unemployment)} %. Les indicateurs nationaux ont été actualisés.`);
 if(state.happiness<38&&!state.eventsSeen.includes("social")){state.eventsSeen.push("social");addNews("Mobilisation sociale","Le mécontentement s'étend. Le gouvernement doit répondre aux préoccupations du quotidien.");}
 if(state.debt>150&&!state.eventsSeen.includes("debt")){state.eventsSeen.push("debt");addNews("Alerte sur la dette","Le ratio de dette dépasse 150 % du PIB dans la simulation. Des arbitrages budgétaires sont nécessaires.");}
 if(state.inflation>10&&!state.eventsSeen.includes("inflation")){state.eventsSeen.push("inflation");addNews("Hausse du coût de la vie","Les prix pèsent sur le pouvoir d'achat et réduisent le soutien au gouvernement.");}
 if(Math.random()<.12)randomEvent();
}
function quarterlyUpdate(){state.history[state.history.length-1]*=1+state.growth/5000;}
function annualUpdate(){
 state.electionYear+=5;state.electionCount++;
 const margin=state.approval-50;
 state.electionResult=margin>=0?"majority":"minority";
 if(state.approval>=50){state.termStart=state.year;addNews("Élections nationales",`Votre coalition conserve la majorité avec un indice de soutien de ${Math.round(state.approval)} %. Le mandat est renouvelé.`);}
 else{state.stability=clamp(state.stability-7);state.approval=clamp(state.approval+4);addNews("Élections nationales",`Votre soutien tombe à ${Math.round(margin+50)} %. Une coalition fragile se forme et votre marge de manœuvre se réduit.`);}
}
const EVENTS=[
{title:"Ralentissement mondial",body:"La demande internationale ralentit. Les exportations et l'investissement sont sous pression.",apply:s=>{s.growth-=.7;s.influence-=1;}},
{title:"Innovation industrielle",body:"Une vague d'investissement soutient la productivité et l'activité.",apply:s=>{s.growth+=.55;s.research+=1;}},
{title:"Pression énergétique",body:"Les coûts énergétiques augmentent et pèsent sur les ménages.",apply:s=>{s.inflation+=.7;s.happiness-=1.3;}},
{title:"Accord commercial régional",body:"Les entreprises bénéficient d'une amélioration temporaire des échanges.",apply:s=>{s.growth+=.35;s.influence+=1.5;}},
{title:"Météo extrême",body:"Des infrastructures sont endommagées et les services publics sont sollicités.",apply:s=>{s.budget-=s.gdp*.0008;s.infrastructure-=1;s.happiness-=.6;}},
{title:"Réussite scientifique",body:"Un programme de recherche améliore les perspectives de productivité.",apply:s=>{s.research+=2;s.growth+=.25;}},
{title:"Contestation politique",body:"L'opposition mobilise contre les choix du gouvernement.",apply:s=>{s.approval-=2.2;s.stability-=1.4;}}
];
function randomEvent(){const e=EVENTS[Math.floor(Math.random()*EVENTS.length)];e.apply(state);addNews(e.title,e.body);}
function openModal(title,desc,options){$("modal-title").textContent=title;$("modal-desc").textContent=desc;$("modal-options").innerHTML=options.map((o,i)=>`<button class="option" data-i="${i}">${esc(o.title)}<small>${esc(o.detail)}</small></button>`).join("");$("modal").classList.remove("hidden");$("modal-options").querySelectorAll("button").forEach((b,i)=>b.addEventListener("click",()=>{try{options[i].apply();}finally{$("modal").classList.add("hidden");render();renderNews();}}));}
function governmentDecision(){openModal("Conseil du gouvernement","Définissez votre priorité politique. Les effets se combinent avec les autres politiques et évoluent au fil des mois.",[
{title:"Pouvoir d'achat et services publics",detail:"Bonheur et popularité en hausse, dépenses publiques plus élevées.",apply:()=>{state.health=clamp(state.health+8);state.happiness+=3;state.approval+=2;state.budget-=state.gdp*.001;addNews("Priorité aux services publics","Le gouvernement renforce les services publics et le soutien aux ménages.");}},
{title:"Compétitivité et croissance",detail:"Investissement, activité et productivité renforcés.",apply:()=>{state.infrastructure=clamp(state.infrastructure+6);state.growth+=.6;state.approval+=.5;state.budget-=state.gdp*.0008;addNews("Cap sur la croissance","Un programme national de compétitivité est annoncé.");}},
{title:"Discipline budgétaire",detail:"Solde amélioré, avec un coût politique possible.",apply:()=>{state.tax=clamp(state.tax+2,10,60);state.budget+=state.gdp*.0015;state.approval-=1;state.stability+=1;addNews("Discipline budgétaire","Le gouvernement annonce une trajectoire de maîtrise des finances publiques.");}},
{title:"Recherche et industrie",detail:"Investissement dans les compétences et l'innovation.",apply:()=>{state.research=clamp(state.research+8);state.education=clamp(state.education+3);state.budget-=state.gdp*.0007;addNews("Pacte d'innovation","Un pacte de recherche et de formation est lancé.");}}
]);}
function policyAction(type){const specs={
budget:["Budget et fiscalité","La fiscalité modifie les recettes, l'activité et l'approbation.",[{title:"Baisser les impôts (−3 points)",detail:"Stimule l'activité à court terme mais réduit les recettes.",apply:()=>{state.tax=clamp(state.tax-3,10,60);state.growth+=.3;state.approval+=2;state.budget-=state.gdp*.003;addNews("Allègement fiscal","Le gouvernement réduit les prélèvements pour soutenir l'activité.");}},{title:"Maintenir la fiscalité",detail:"Aucun changement immédiat.",apply:()=>addNews("Fiscalité maintenue","Le gouvernement conserve la trajectoire fiscale actuelle.")},{title:"Augmenter les impôts (+3 points)",detail:"Renforce les recettes, avec un risque sur la popularité.",apply:()=>{state.tax=clamp(state.tax+3,10,60);state.budget+=state.gdp*.004;state.approval-=3;state.growth-=.2;addNews("Ajustement fiscal","Une hausse fiscale finance les priorités nationales.");}}]],
health:["Plan santé","Choisissez l'ampleur du financement des hôpitaux et de la prévention.",[{title:"Plan santé national",detail:"Effet positif sur le bien-être, dépense élevée.",apply:()=>{state.health=clamp(state.health+12);state.budget-=state.gdp*.002;state.happiness+=2.5;state.approval+=1.5;addNews("Plan santé","Un financement supplémentaire est accordé au système de santé.");}},{title:"Modernisation ciblée",detail:"Coût modéré et amélioration progressive.",apply:()=>{state.health=clamp(state.health+5);state.budget-=state.gdp*.0008;state.happiness+=1;addNews("Modernisation sanitaire","Les crédits sont concentrés sur les établissements prioritaires.");}}]],
infrastructure:["Plan d'infrastructures","Investissez dans les transports, l'énergie et les réseaux.",[{title:"Grand plan national",detail:"Dépense élevée et potentiel de croissance plus important.",apply:()=>{state.infrastructure=clamp(state.infrastructure+12);state.budget-=state.gdp*.003;state.growth+=.6;state.approval+=1;addNews("Plan d'infrastructures","Un programme de modernisation des réseaux est lancé.");}},{title:"Projets prioritaires",detail:"Effort modéré et effets progressifs.",apply:()=>{state.infrastructure=clamp(state.infrastructure+5);state.budget-=state.gdp*.001;state.growth+=.2;addNews("Projets prioritaires","Les investissements se concentrent sur les infrastructures les plus urgentes.");}}]],
climate:["Transition énergétique","Choisissez le rythme de la transition et de la modernisation énergétique.",[{title:"Accélérer la transition",detail:"Investissement élevé, effets de long terme.",apply:()=>{state.climate=clamp(state.climate+12);state.budget-=state.gdp*.002;state.happiness+=.7;state.growth-=.1;addNews("Transition énergétique","Le gouvernement accélère les investissements bas-carbone.");}},{title:"Transition graduelle",detail:"Effort budgétaire modéré.",apply:()=>{state.climate=clamp(state.climate+5);state.budget-=state.gdp*.0007;addNews("Transition graduelle","Une trajectoire progressive de transition énergétique est adoptée.");}}]],
education:["Éducation et compétences","Le capital humain soutient la productivité sur la durée.",[{title:"Plan école et compétences",detail:"Améliore progressivement bonheur, emploi et croissance.",apply:()=>{state.education=clamp(state.education+12);state.budget-=state.gdp*.0018;state.happiness+=1.5;state.growth+=.2;addNews("Plan éducation","Le financement de la formation et des établissements est renforcé.");}},{title:"Formation professionnelle",detail:"Mesure ciblée sur les compétences et l'emploi.",apply:()=>{state.education=clamp(state.education+6);state.budget-=state.gdp*.0008;state.unemployment-=.3;addNews("Formation professionnelle","Un programme de reconversion et de compétences est ouvert.");}}]]
};const x=specs[type];if(x)openModal(x[0],x[1],x[2]);}
function showTab(tab){
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
 const world=tab==="world";$("world-panel").classList.toggle("hidden",!world);$("dashboard").classList.toggle("hidden",world);
 if(world){if(!maps.world)initMap("world-map",true);setTimeout(()=>maps.world?.invalidateSize(),100);return;}
 const panel=$("tab-content");panel.hidden=["overview"].includes(tab);if(tab==="overview")return;
 panel.innerHTML=tabMarkup(tab);panel.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>policyAction(b.dataset.action)));
 panel.querySelectorAll("[data-diplomacy]").forEach(b=>b.addEventListener("click",()=>diplomacyAction(b.dataset.diplomacy,b.dataset.code)));
 panel.querySelectorAll("[data-defense]").forEach(b=>b.addEventListener("click",()=>defenseAction(b.dataset.defense)));
 panel.querySelectorAll("[data-research]").forEach(b=>b.addEventListener("click",()=>researchAction(b.dataset.research)));
 panel.querySelectorAll("[data-region]").forEach(b=>b.addEventListener("click",()=>investRegion(+b.dataset.region)));
 panel.querySelectorAll("input[type=range]").forEach(r=>r.addEventListener("input",()=>{const out=panel.querySelector(`[data-output="${r.id}"]`);if(out)out.textContent=r.value;}));
 panel.querySelectorAll("[data-apply-policy]").forEach(b=>b.addEventListener("click",()=>applyPolicySlider()));
}
function tabMarkup(tab){
 if(tab==="economy")return `<div class="panel-title">ÉCONOMIE & FINANCES PUBLIQUES <span class="muted">POLITIQUE BUDGÉTAIRE</span></div><p class="muted">Les leviers ci-dessous modifient les paramètres de la simulation. Les effets macroéconomiques sont appliqués à chaque mise à jour mensuelle.</p>
 ${slider("tax","Taux fiscal simulé",state.tax,10,60,"%")}${slider("trade","Ouverture commerciale",state.trade,0,100,"/100")}
 <button class="primary" data-apply-policy>Appliquer les paramètres économiques →</button><div class="tab-grid">${metric("PIB annuel",money(state.gdp),"Production économique simulée.")}${metric("Budget courant",money(state.budget),"Solde accumulé de la simulation.")}${metric("Dette publique",fmt(state.debt,0)+" %","Ratio de dette modélisé.")}</div><h3>Arbitrages économiques</h3><button class="secondary" data-action="budget">Ouvrir les décisions fiscales</button>`;
 if(tab==="society")return `<div class="panel-title">SOCIÉTÉ & SERVICES PUBLICS</div><p class="muted">La santé, l'éducation, le chômage, le bonheur et la stabilité évoluent selon les investissements et les chocs.</p><div class="tab-grid">${metric("Bonheur",Math.round(state.happiness)+"/100","Satisfaction sociale modélisée.")}${metric("Chômage",fmt(state.unemployment)+" %","Marché du travail simulé.")}${metric("Population",state.population.toLocaleString("fr-FR")+" M (indice)","Population stylisée de la partie.")}</div><h3>Investissements sociaux</h3><button class="secondary" data-action="health">Financer la santé</button> <button class="secondary" data-action="education">Financer l'éducation</button><h3>Régions administratives</h3><table class="data-table"><thead><tr><th>Région</th><th>Prosperité</th><th>Chômage</th><th>Action</th></tr></thead><tbody>${state.regions.map(r=>`<tr><td>${esc(r.name)}</td><td>${Math.round(r.prosperity)}/100</td><td>${fmt(r.unemployment)}%</td><td><button class="secondary" data-region="${r.id}">Investir</button></td></tr>`).join("")}</tbody></table>`;
 if(tab==="politics")return `<div class="panel-title">INSTITUTIONS & VIE POLITIQUE</div><p class="muted">Gérez votre légitimité, votre stabilité et le calendrier électoral. Le système d'élections est simulé dans cette version.</p><div class="tab-grid">${metric("Parti au pouvoir",state.party,"Coalition dirigeante.")}${metric("Popularité",Math.round(state.approval)+"%","Soutien public estimé.")}${metric("Prochaine échéance",String(state.electionYear),"Élections nationales simulées.")}</div><h3>Décisions politiques</h3><button class="secondary" data-politics="cabinet" id="cabinet-open">Convoquer le conseil</button> <button class="secondary" data-politics="election" id="election-open">Organiser des élections anticipées</button><div class="muted" style="margin-top:14px;font-size:10px">Les élections annuelles de la simulation ont lieu à l'échéance affichée. La popularité et la stabilité influencent les résultats.</div>`;
 if(tab==="diplomacy")return `<div class="panel-title">DIPLOMATIE & RELATIONS INTERNATIONALES</div><p class="muted">Proposez des accords, améliorez les relations et développez votre influence. Les relations sont des valeurs de jeu.</p><div class="tab-grid">${metric("Influence",Math.round(state.influence)+"/100","Poids diplomatique modélisé.")}${metric("Accords actifs",state.treaties.length,"Traités et accords commerciaux.")}${metric("Relations",Object.keys(state.relations).length+" nations","Nations suivies par la partie.")}</div><table class="data-table"><thead><tr><th>Nation</th><th>Relations</th><th>Statut</th><th>Action</th></tr></thead><tbody>${countries.filter(c=>c.code!==state.code).sort((a,b)=>(state.relations[b.code]||0)-(state.relations[a.code]||0)).map(c=>`<tr><td>${flag(c.code)} ${esc(c.name)}</td><td>${Math.round(state.relations[c.code]||50)}/100</td><td>${state.treaties.some(t=>t.code===c.code)?"Accord actif":"Partenaire potentiel"}</td><td><button class="secondary" data-diplomacy="treaty" data-code="${c.code}">Négocier</button></td></tr>`).join("")}</tbody></table>`;
 if(tab==="defense")return `<div class="panel-title">DÉFENSE & SÉCURITÉ NATIONALE</div><p class="muted">Arbitrez entre budget de défense, sécurité intérieure, coopération et stabilité. Les conflits sont résolus abstraitement, sans simulation tactique.</p>${slider("defense-budget","Part du PIB consacrée à la défense",state.defense,0.5,8,"%")}${slider("security","Sécurité intérieure",state.security,0,100,"/100")}<button class="primary" data-defense="apply">Appliquer la posture de défense →</button><div class="tab-grid">${metric("Dépense défense",fmt(state.defense)+" % du PIB","Part budgétaire simulée.")}${metric("Stabilité",Math.round(state.stability)+"/100","Stabilité institutionnelle.")}${metric("Tensions",state.wars.length+" crise(s)","Crises abstraites actives.")}</div><h3>Options stratégiques</h3><button class="secondary" data-defense="cooperate">Proposer un pacte de sécurité</button> <button class="secondary" data-defense="readiness">Renforcer la préparation</button>`;
 if(tab==="research")return `<div class="panel-title">RECHERCHE, SCIENCE & INNOVATION</div><p class="muted">Les investissements en recherche améliorent progressivement la productivité et la capacité d'innovation.</p>${slider("research-level","Effort national de recherche",state.research,0,100,"/100")}<button class="primary" data-research="apply">Appliquer le budget de recherche →</button><div class="tab-grid">${metric("Effort recherche",Math.round(state.research)+"/100","Indice d'investissement.")}${metric("Éducation",Math.round(state.education)+"/100","Compétences et formation.")}${metric("Croissance",fmt(state.growth)+" %","Croissance économique simulée.")}</div><h3>Programmes de recherche</h3><div class="tab-grid">${researchCard("energy","Énergie avancée","Réduit progressivement la pression énergétique.")}${researchCard("health","Innovation médicale","Améliore le bien-être à long terme.")}${researchCard("industry","Industrie de pointe","Soutient la productivité et la croissance.")}</div>`;
 return "";
}
function metric(title,value,desc){return `<div class="metric"><small>${esc(title.toUpperCase())}</small><strong>${esc(value)}</strong><p>${esc(desc)}</p></div>`;}
function slider(id,label,value,min,max,unit){return `<div class="range-row"><label for="${id}">${esc(label)}</label><output data-output="${id}">${fmt(value,1)} ${unit}</output><input id="${id}" type="range" min="${min}" max="${max}" step="${unit==="%"?"0.5":"1"}" value="${value}" data-unit="${unit}"></div>`;}
function researchCard(id,title,desc){const done=state.researchUnlocked.includes(id);return `<div class="metric"><small>PROGRAMME</small><strong>${title}</strong><p>${desc}</p><button class="secondary" data-research="${id}" ${done?"disabled":""}>${done?"Débloqué":"Financer · 5 Md"}</button></div>`;}
function applyPolicySlider(){
 const tax=$("tax"),trade=$("trade"),db=$("defense-budget"),sec=$("security"),res=$("research-level");
 if(tax){const next=+tax.value;state.budget-=state.gdp*(next-state.tax)/1000;state.tax=next;}
 if(trade)state.trade=+trade.value;
 if(db)state.defense=+db.value;if(sec)state.security=+sec.value;if(res)state.research=+res.value;
 addNews("Paramètres de politique actualisés","Les nouveaux paramètres économiques ont été appliqués.");notify("Paramètres appliqués.");render();showTab(document.querySelector(".tab.active")?.dataset.tab||"economy");
}
function investRegion(id){const r=state.regions.find(x=>x.id===id);if(!r)return;openModal("Investissement régional",`Financer ${r.name} améliore sa prospérité et ses infrastructures. Coût simulé : ${money(state.gdp*.0004)}.`,[{title:"Investissement ciblé",detail:"Coût budgétaire modéré, effets régionaux positifs.",apply:()=>{state.budget-=state.gdp*.0004;r.prosperity=clamp(r.prosperity+8);r.infrastructure=clamp(r.infrastructure+10);r.loyalty=clamp(r.loyalty+3);addNews("Investissement régional",`Un programme ciblé est lancé dans ${r.name}.`);}}]);}
function diplomacyAction(type,code){
 const c=countryByCode(code);if(!c)return;
 const relation=state.relations[code]??50;
 openModal(`Négociations avec ${c.name}`,`Relations actuelles : ${Math.round(relation)}/100. Une proposition réussie améliore les relations et l'influence diplomatique.`,[
 {title:"Proposer un accord commercial",detail:"Coût administratif simulé; potentiel de croissance et de relations.",apply:()=>{if(state.budget<0&&relation<35){state.relations[code]=clamp(relation+2);addNews("Négociations difficiles",`${c.name} demande des garanties supplémentaires avant un accord.`);}else{state.budget-=state.gdp*.0003;state.relations[code]=clamp(relation+12);state.influence=clamp(state.influence+2);state.treaties=state.treaties.filter(t=>t.code!==code);state.treaties.push({code,name:c.name,type:"Accord commercial",year:state.year});addNews("Accord commercial",`Un accord commercial simulé est conclu avec ${c.name}.`);}}},
 {title:"Sommet diplomatique",detail:"Améliore la confiance et l'influence sans traité formel.",apply:()=>{state.relations[code]=clamp(relation+7);state.influence=clamp(state.influence+1.5);addNews("Sommet diplomatique",`Un dialogue bilatéral avec ${c.name} améliore les relations.`);}},
 {title:"Mesures de rétorsion",detail:"Réduit la relation bilatérale et peut affecter l'influence.",apply:()=>{state.relations[code]=clamp(relation-15);state.influence=clamp(state.influence-2);state.growth-=.15;addNews("Tensions diplomatiques",`Des mesures de rétorsion dégradent les relations avec ${c.name}.`);}}
 ]);
}
function defenseAction(type){
 if(type==="apply"){state.defense=+$("defense-budget").value;state.security=+$("security").value;state.budget-=state.gdp*(state.defense/10000);addNews("Posture de défense révisée",`Budget de défense : ${fmt(state.defense)} % du PIB; indice de sécurité : ${Math.round(state.security)}/100.`);notify("Posture de défense appliquée.");render();showTab("defense");return;}
 if(type==="cooperate")openModal("Pacte de sécurité","Choisissez une nation partenaire dans le système diplomatique.",countries.filter(c=>c.code!==state.code).slice(0,8).map(c=>({title:c.name,detail:"Proposer un pacte de coopération et de dialogue.",apply:()=>{state.relations[c.code]=clamp((state.relations[c.code]||50)+8);state.influence=clamp(state.influence+1);state.treaties.push({code:c.code,name:c.name,type:"Pacte de sécurité",year:state.year});addNews("Pacte de sécurité proposé",`Un pacte de coopération est proposé à ${c.name}.`);}})));
 if(type==="readiness")openModal("Préparation nationale","Le renforcement de la préparation améliore la stabilité, au prix d'une dépense publique.",[{title:"Renforcer la préparation",detail:"Dépense modérée et stabilité améliorée.",apply:()=>{state.budget-=state.gdp*.0007;state.stability=clamp(state.stability+2);state.security=clamp(state.security+8);addNews("Préparation renforcée","Les services de sécurité et de protection civile reçoivent des moyens supplémentaires.");}},{title:"Priorité à la coopération civile",detail:"Coût limité et soutien au bien-être.",apply:()=>{state.happiness=clamp(state.happiness+1.2);state.stability=clamp(state.stability+1);addNews("Coopération civile","La préparation civile et la gestion de crise sont renforcées.");}}]);
}
function researchAction(type){
 if(type==="apply"){state.research=+$("research-level").value;state.budget-=state.gdp*.0006;addNews("Effort de recherche ajusté",`L'indice d'effort national de recherche passe à ${Math.round(state.research)}/100.`);notify("Budget de recherche appliqué.");render();showTab("research");return;}
 const programs={energy:["Énergie avancée",()=>{state.climate=clamp(state.climate+5);state.inflation=clamp(state.inflation-.25,-2,150);}],health:["Innovation médicale",()=>{state.health=clamp(state.health+5);state.happiness=clamp(state.happiness+1);}],industry:["Industrie de pointe",()=>{state.growth+=.35;state.infrastructure=clamp(state.infrastructure+3);}]};
 const p=programs[type];if(!p||state.researchUnlocked.includes(type))return;
 openModal("Financer un programme",`Le programme « ${p[0]} » coûte 5 Md dans cette simulation.`,[{title:`Financer ${p[0]}`,detail:"Effet permanent dans la partie et investissement budgétaire.",apply:()=>{if(state.budget<5){notify("Budget insuffisant.");return;}state.budget-=5;state.researchUnlocked.push(type);p[1]();addNews("Programme scientifique financé",`Le programme ${p[0]} reçoit un financement national.`);}}]);
}
function annualElection(){
 openModal("Élections anticipées","La tenue d'élections anticipées consomme du temps politique. Le résultat dépend de la popularité et de la stabilité actuelles.",[{title:"Organiser le scrutin",detail:`Soutien actuel : ${Math.round(state.approval)} %. Résultat simulé selon le soutien public.`,apply:()=>{state.electionCount++;state.electionYear=state.year+5;if(state.approval>=50){state.approval=clamp(state.approval+2);state.stability=clamp(state.stability+3);addNews("Élections anticipées","Votre coalition remporte un nouveau mandat dans la simulation.");}else{state.approval=clamp(state.approval+5);state.stability=clamp(state.stability-5);state.party="Coalition de transition";addNews("Élections anticipées","Le gouvernement perd sa majorité et une coalition de transition se forme.");}state.termStart=state.year;}}]);
}
function saveGame(){if(!state){notify("Lancez une partie pour sauvegarder.");return;}try{localStorage.setItem("atlas-nations-save-v1",JSON.stringify(state));notify("Partie sauvegardée sur cet appareil.");}catch(e){notify("Sauvegarde impossible : espace de stockage indisponible.");}}
function loadGame(){try{const raw=localStorage.getItem("atlas-nations-save-v1");if(!raw)return false;const s=JSON.parse(raw);if(!s||!s.code||!s.history||!s.regions)throw Error("save");state=s;speed=0;showGame();render();renderNews();notify("Sauvegarde chargée.");return true;}catch(e){notify("Sauvegarde illisible.");return false;}}
function exportSave(){if(!state){notify("Aucune partie à exporter.");return;}const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`atlas-nations-${state.code}-${state.year}.json`;a.click();URL.revokeObjectURL(url);notify("Export JSON téléchargé.");}
function importSave(){const input=document.createElement("input");input.type="file";input.accept=".json,application/json";input.onchange=async()=>{try{const s=JSON.parse(await input.files[0].text());if(!s.code||!s.history||!s.regions||!countryByCode(s.code))throw Error("Fichier non compatible");state=s;speed=0;showGame();render();renderNews();saveGame();notify("Partie importée.");}catch(e){notify("Fichier de sauvegarde invalide.");}};input.click();}
function showGame(){$("start-screen").classList.add("hidden");$("game-screen").classList.remove("hidden");$("world-panel").classList.add("hidden");$("dashboard").classList.remove("hidden");document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab==="overview"));$("tab-content").hidden=true;if(timer)clearInterval(timer);timer=setInterval(tick,1000);window.scrollTo({top:0,behavior:"smooth"});}
function menu(){openModal("Menu de partie","Gérez la sauvegarde de votre partie en cours.",[{title:"Sauvegarder sur cet appareil",detail:"Enregistre la partie dans ce navigateur.",apply:saveGame},{title:"Exporter la sauvegarde JSON",detail:"Télécharge un fichier transférable vers un autre appareil.",apply:exportSave},{title:"Importer une sauvegarde JSON",detail:"Charge un fichier de partie précédemment exporté.",apply:importSave},{title:"Nouvelle partie",detail:"Retourne au choix de nation sans effacer la sauvegarde.",apply:()=>{$("modal").classList.add("hidden");speed=0;$("game-screen").classList.add("hidden");$("start-screen").classList.remove("hidden");}}]);}
function drawChart(){const canvas=$("chart");if(!canvas||!state)return;const rect=canvas.getBoundingClientRect();if(rect.width<10)return;const dpr=window.devicePixelRatio||1;canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);const w=rect.width,h=rect.height,p={l:30,r:8,t:9,b:20},a=state.history,min=Math.min(...a)-2,max=Math.max(...a)+2,range=Math.max(1,max-min);ctx.clearRect(0,0,w,h);ctx.font="9px DM Sans";ctx.fillStyle="#7f91a9";ctx.strokeStyle="#27374c";for(let i=0;i<4;i++){const y=p.t+(h-p.t-p.b)*i/3;ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(w-p.r,y);ctx.stroke();ctx.fillText(fmt(max-range*i/3,0),0,y+3);}const x=i=>p.l+(w-p.l-p.r)*i/Math.max(1,a.length-1),y=v=>p.t+(h-p.t-p.b)*(1-(v-min)/range);ctx.beginPath();a.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.strokeStyle="#e7bd72";ctx.lineWidth=2;ctx.stroke();ctx.lineTo(x(a.length-1),h-p.b);ctx.lineTo(x(0),h-p.b);ctx.closePath();ctx.fillStyle="rgba(231,189,114,.08)";ctx.fill();ctx.fillStyle="#7f91a9";ctx.fillText("HISTORIQUE",p.l,h-4);ctx.fillText("ACTUEL",w-48,h-4);}
function normalize(s){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z]/g,"");}
function initMap(id,world){
 if(!window.L){$(id).innerHTML='<p style="padding:20px">La carte interactive nécessite une connexion Internet.</p>';return;}
 if(maps[id]){maps[id].invalidateSize();return;}
 const map=L.map(id,{zoomControl:true,minZoom:1,maxZoom:7,scrollWheelZoom:world,worldCopyJump:true}).setView([18,0],world?2:1.5);maps[id]=map;
 fetch(GEO_URL).then(r=>{if(!r.ok)throw Error("GeoJSON");return r.json();}).then(data=>{geoJson=data;const layer=L.geoJSON(data,{style:f=>geoStyle(f),onEachFeature:(f,l)=>{const p=f.properties||{},name=p.ADMIN||p.name||p.name_long||"Pays",code=(p.ISO_A3||p.ADM0_A3||"").toUpperCase();l.bindTooltip(esc(name),{sticky:true});l.on("click",()=>countryClicked(code,name,world));}}).addTo(map);maps[id+"-layer"]=layer;if(id==="world-map")$("map-status").textContent="Frontières chargées · cliquez sur un pays pour ses options.";}).catch(()=>{if(id==="world-map")$("map-status").textContent="Impossible de charger les frontières. Vérifiez votre connexion.";});
}
function geoStyle(f){const p=f.properties||{},name=p.ADMIN||p.name||p.name_long||"",code=(p.ISO_A3||p.ADM0_A3||"").toUpperCase(),sel=state&&(state.code===code||normalize(state.name)===normalize(name));return{color:sel?"#f1d49c":"#334962",weight:sel?1.7:.55,fillColor:sel?"#b9914d":"#1a2b40",fillOpacity:sel?.85:.72};}
function styleGeoLayer(){Object.values(maps).forEach(m=>{const l=maps[m._atlasId+"-layer"];});Object.keys(maps).filter(k=>k.endsWith("-layer")).forEach(k=>maps[k].setStyle(geoStyle));}
function countryClicked(code,name,world){
 const c=countryByCode(code)||countries.find(x=>normalize(x.name)===normalize(name));
 if(!c){if(world)$("map-status").textContent=`${name} — données jouables non disponibles dans cette édition.`;else notify("Choisissez une nation disponible dans la liste.");return;}
 if(!world){$("country-select").value=c.code;updateSelected();return;}
 if(c.code===state.code){openModal(c.name,"Vous dirigez déjà cette nation. Consultez les indicateurs ou poursuivez votre mandat.",[{title:"Continuer la partie",detail:"Retour au tableau de bord.",apply:()=>showTab("overview")}]);return;}
 openModal(`${flag(c.code)} ${c.name}`,`Nation ${c.region}. PIB initial de jeu : ${money(c.gdp)}. Relations bilatérales : ${Math.round(state.relations[c.code]||50)}/100.`,[
 {title:"Ouvrir des négociations",detail:"Proposer un accord ou un sommet diplomatique.",apply:()=>{showTab("diplomacy");setTimeout(()=>{const b=document.querySelector(`[data-diplomacy="treaty"][data-code="${c.code}"]`);b?.scrollIntoView({behavior:"smooth",block:"center"});},100);}},
 {title:"Voir les relations",detail:"Améliorer ou dégrader les relations dans le jeu.",apply:()=>{state.relations[c.code]=clamp((state.relations[c.code]||50)+3);addNews("Dialogue international",`Un échange diplomatique préliminaire a lieu avec ${c.name}.`);}}
 ]);
}
function updateSelected(){const c=countryByCode($("country-select").value)||countries[0];$("start-name").textContent=c.name;$("start-flag").textContent=flag(c.code);$("start-meta").textContent=`${c.region} · ${c.government}`;}
function populate(){const s=$("country-select");s.innerHTML="";countries.slice().sort((a,b)=>a.name.localeCompare(b.name,"fr")).forEach(c=>{const o=document.createElement("option");o.value=c.code;o.textContent=`${flag(c.code)} ${c.name}`;s.appendChild(o);});s.value="FRA";updateSelected();$("country-count").textContent=String(countries.length);}
$("country-select").addEventListener("change",updateSelected);
$("start-btn").addEventListener("click",()=>{state=newState(countryByCode($("country-select").value)||countries[0]);showGame();render();renderNews();notify(`${state.name} est prête à être gouvernée.`);});
$("save-btn").addEventListener("click",saveGame);$("menu-btn").addEventListener("click",menu);
document.querySelectorAll(".speed").forEach(b=>b.addEventListener("click",()=>{speed=+b.dataset.speed;render();}));
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab)));
document.querySelectorAll(".action").forEach(b=>b.addEventListener("click",()=>policyAction(b.dataset.action)));
$("decision-btn").addEventListener("click",governmentDecision);$("modal-close").addEventListener("click",()=>$("modal").classList.add("hidden"));$("modal").addEventListener("click",e=>{if(e.target===$("modal"))$("modal").classList.add("hidden");});
$("tab-content").addEventListener("click",e=>{if(e.target.id==="cabinet-open")governmentDecision();if(e.target.id==="election-open")annualElection();});
window.addEventListener("resize",()=>{drawChart();Object.values(maps).filter(x=>x&&x.invalidateSize).forEach(m=>m.invalidateSize());});
populate();initMap("start-map",false);
if(localStorage.getItem("atlas-nations-save-v1")){$("save-btn").textContent="Sauvegarde disponible";}
window.ATLAS_NATIONS={getState:()=>state,save:saveGame,exportSave,importSave};
})();