
const routine = {
  1:[
    ["05:50","Água e ração","Pets","Trocar a água e colocar a ração dos Shih Tzus."],
    ["06:00","Ligar Robô 1","Cozinha + quartos","Cozinha, Quarto Suíte, Quarto Vitória e Banheiro Social."],
    ["06:00","Ligar Robô 2","Closet + suíte","Closet e Banheiro Suíte."],
    ["18:05","Verificar os cães","Pets","Conferir água e limpar eventual xixi com produto enzimático."],
    ["18:10","Robô na sala","Sala de Estar","Aspirar a sala."],
    ["18:40","Passar pano","Sala de Estar","Finalizar a limpeza da sala."],
    ["21:00","Organizar cozinha","Cozinha","Pia, fogão e bancada."]
  ],
  2:[
    ["05:50","Água e ração","Pets","Trocar a água e colocar a ração."],
    ["06:00","Ligar os robôs","Níveis da casa","Executar os dois robôs."],
    ["18:10","Tirar pó","Sala e quartos","Móveis, TV, aparadores e cabeceiras."],
    ["18:40","Organizar quartos","Quartos","Guardar roupas e sapatos."],
    ["21:00","Organizar cozinha","Cozinha","Pia, fogão e bancada."]
  ],
  3:[
    ["05:50","Água e ração","Pets","Trocar a água e colocar a ração."],
    ["06:00","Ligar os robôs","Níveis da casa","Executar os dois robôs."],
    ["18:10","Robô na sala","Sala de Estar","Aspirar a sala."],
    ["18:40","Lavar caminhas","Pets","Caminhas, mantas e potes."],
    ["19:20","Aspirar sofá","Sala de Estar","Retirar pelos e poeira."],
    ["21:00","Organizar cozinha","Cozinha","Pia, fogão e bancada."]
  ],
  4:[
    ["05:50","Água e ração","Pets","Trocar a água e colocar a ração."],
    ["06:00","Ligar os robôs","Níveis da casa","Executar os dois robôs."],
    ["18:10","Trocar roupa de cama","Quartos","Quarto Suíte e Quarto Vitória."],
    ["18:40","Organizar closet","Closet","Roupas, gavetas e sapatos."],
    ["21:00","Organizar cozinha","Cozinha","Pia, fogão e bancada."]
  ],
  5:[
    ["05:50","Água e ração","Pets","Trocar a água e colocar a ração."],
    ["06:00","Ligar os robôs","Níveis da casa","Executar os dois robôs."],
    ["18:10","Robô na sala","Sala de Estar","Aspirar a sala."],
    ["18:40","Geladeira e difusores","Cozinha + casa","Limpar a geladeira por fora e conferir os refis."],
    ["19:15","Esvaziar lixeiras","Casa inteira","Recolher o lixo de todos os ambientes."],
    ["21:00","Organizar cozinha","Cozinha","Pia, fogão e bancada."]
  ],
  6:[
    ["08:30","Limpar área e garagem","Área Gourmet + Garagem","Piso, superfícies e organização."],
    ["10:00","Limpar lavanderia","Lavanderia","Tanque, máquina e piso."],
    ["11:00","Limpar os robôs","Robôs","Reservatórios, escovas, filtros e sensores."],
    ["11:20","Conferir difusores","Casa inteira","Virar varetas e conferir os refis."],
    ["11:40","Conferir estoque","Casa inteira","Produtos de limpeza e ração."]
  ],
  0:[
    ["09:00","Manutenção leve","Casa inteira","Organizar ambientes e recolher lixo."],
    ["18:00","Planejar a semana","Casa inteira","Conferir lista de compras e preparar segunda."]
  ]
};

const dayNames = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const shortNames = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const monthly = [
  ["Dia 5 • 19h30","Janelas e vidros"],
  ["Dia 10 • 19h30","Portas e batentes"],
  ["Dia 15 • 19h30","Rodapés"],
  ["Dia 20 • 19h30","Armários por fora"],
  ["Dia 25 • 19h30","Geladeira por dentro"],
  ["Último sábado • 09h00","Banheiros, lixeiras e panos"],
  ["Jan/Abr/Jul/Out • dia 1 • 09h00","Luminárias, ventiladores e revisão dos armários"]
];

const today = new Date();
const todayKey = toDateKey(today);
let selectedAgendaDay = today.getDay();
let focusIndex = 0;

document.getElementById("dateLabel").textContent =
  today.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"});
document.getElementById("greeting").textContent =
  `${today.getHours()<12?"Bom dia":today.getHours()<18?"Boa tarde":"Boa noite"}, Fabiana`;

function toDateKey(date){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function storageKey(dateKey, day){ return `tasks-${dateKey}-${day}`; }
function agendaWeekKey(day){ return `agenda-template-${day}`; }
function getDone(dateKey, day){
  return JSON.parse(localStorage.getItem(storageKey(dateKey,day)) || "{}");
}
function saveDone(dateKey, day, done){
  localStorage.setItem(storageKey(dateKey,day), JSON.stringify(done));
  updateHistory(dateKey, day, done);
}
function getAgendaDone(day){
  return JSON.parse(localStorage.getItem(agendaWeekKey(day)) || "{}");
}
function saveAgendaDone(day, done){
  localStorage.setItem(agendaWeekKey(day), JSON.stringify(done));
}

function taskCard(task, index, done, onToggle){
  const row=document.createElement("div");
  row.className="task "+(done[index]?"done":"");
  row.innerHTML=`
    <div class="time">${task[0]}</div>
    <div>
      <div class="title">${task[1]}</div>
      <div class="location">📍 ${task[2]}</div>
      <div class="details">${task[3]}</div>
    </div>
    <button class="check" aria-label="Concluir"></button>`;
  row.querySelector("button").onclick=()=>onToggle(index);
  return row;
}

function renderToday(){
  const tasks=routine[today.getDay()];
  const done=getDone(todayKey,today.getDay());
  const box=document.getElementById("todayList"); box.innerHTML="";
  tasks.forEach((task,i)=>box.appendChild(taskCard(task,i,done,(index)=>{
    done[index]=!done[index];
    saveDone(todayKey,today.getDay(),done);
    renderToday(); renderHistory();
  })));
  const complete=Object.values(done).filter(Boolean).length;
  document.getElementById("summaryCount").textContent=`${complete} de ${tasks.length}`;
  document.getElementById("progressBar").style.width=`${tasks.length?complete/tasks.length*100:0}%`;
  const next=tasks.find((_,i)=>!done[i]);
  document.getElementById("nextTask").textContent=
    next?`Próxima: ${next[0]} — ${next[1]} • ${next[2]}`:"Tudo concluído por hoje.";
}
renderToday();

function renderChips(){
  const box=document.getElementById("weekdayChips"); box.innerHTML="";
  shortNames.forEach((label,day)=>{
    const b=document.createElement("button");
    b.className="chip "+(day===selectedAgendaDay?"active":"");
    b.textContent=label;
    b.onclick=()=>{selectedAgendaDay=day;renderChips();renderAgenda();};
    box.appendChild(b);
  });
}
function renderAgenda(){
  const tasks=routine[selectedAgendaDay];
  const done=getAgendaDone(selectedAgendaDay);
  const box=document.getElementById("agendaList"); box.innerHTML="";
  tasks.forEach((task,i)=>box.appendChild(taskCard(task,i,done,(index)=>{
    done[index]=!done[index];
    saveAgendaDone(selectedAgendaDay,done);
    renderAgenda();
  })));
}
renderChips(); renderAgenda();

const monthlyBox=document.getElementById("monthlyList");
monthly.forEach(([when,title])=>{
  const x=document.createElement("div"); x.className="agenda-item";
  x.innerHTML=`<b>${when}</b>${title}`; monthlyBox.appendChild(x);
});

function updateHistory(dateKey, day, done){
  const history=JSON.parse(localStorage.getItem("history")||"{}");
  const total=routine[day].length;
  const completed=Object.values(done).filter(Boolean).length;
  history[dateKey]={day,total,completed};
  localStorage.setItem("history",JSON.stringify(history));
}
function renderHistory(){
  const history=JSON.parse(localStorage.getItem("history")||"{}");
  const entries=Object.entries(history).sort((a,b)=>b[0].localeCompare(a[0]));
  let total=0,completed=0;
  entries.forEach(([,v])=>{total+=v.total;completed+=v.completed;});
  document.getElementById("historySummary").innerHTML=`
    <div class="card stat"><strong>${completed}</strong><span>Concluídas</span></div>
    <div class="card stat"><strong>${Math.max(total-completed,0)}</strong><span>Pendentes</span></div>
    <div class="card stat"><strong>${total?Math.round(completed/total*100):0}%</strong><span>Progresso</span></div>`;
  const box=document.getElementById("historyList"); box.innerHTML="";
  if(!entries.length){
    box.innerHTML='<div class="card">Nenhuma tarefa concluída ainda.</div>'; return;
  }
  entries.forEach(([date,v])=>{
    const [y,m,d]=date.split("-");
    const row=document.createElement("div"); row.className="history-row";
    row.innerHTML=`<div><b>${d}/${m}/${y} — ${dayNames[v.day]}</b><span>${v.completed} de ${v.total} tarefas</span></div><b>${Math.round(v.completed/v.total*100)}%</b>`;
    box.appendChild(row);
  });
}
renderHistory();

document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(btn.dataset.target).classList.add("active");
});

document.getElementById("resetDay").onclick=()=>{
  if(confirm("Reiniciar as tarefas de hoje?")){
    localStorage.removeItem(storageKey(todayKey,today.getDay()));
    renderToday(); renderHistory();
  }
};
document.getElementById("resetAgendaDay").onclick=()=>{
  if(confirm(`Reiniciar a agenda de ${dayNames[selectedAgendaDay]}?`)){
    localStorage.removeItem(agendaWeekKey(selectedAgendaDay)); renderAgenda();
  }
};

document.getElementById("startCleaning").onclick=()=>{
  focusIndex=0; openNextFocus();
};
function openNextFocus(){
  const tasks=routine[today.getDay()];
  const done=getDone(todayKey,today.getDay());
  while(focusIndex<tasks.length && done[focusIndex]) focusIndex++;
  if(focusIndex>=tasks.length){
    alert("Tudo concluído por hoje."); closeFocus(); return;
  }
  const t=tasks[focusIndex];
  document.getElementById("focusTitle").textContent=t[1];
  document.getElementById("focusMeta").textContent=`${t[0]} • ${t[2]}`;
  document.getElementById("focusDetails").textContent=t[3];
  document.getElementById("focusModal").classList.remove("hidden");
}
function closeFocus(){document.getElementById("focusModal").classList.add("hidden")}
document.getElementById("closeFocus").onclick=closeFocus;
document.getElementById("focusDone").onclick=()=>{
  const done=getDone(todayKey,today.getDay());
  done[focusIndex]=true; saveDone(todayKey,today.getDay(),done);
  focusIndex++; renderToday(); renderHistory(); openNextFocus();
};

document.getElementById("notifyBtn").onclick=enableAlerts;
document.getElementById("browserAlerts").checked=localStorage.getItem("browserAlerts")==="1";
document.getElementById("browserAlerts").onchange=async(e)=>{
  if(e.target.checked){
    const ok=await enableAlerts();
    if(ok)localStorage.setItem("browserAlerts","1"); else e.target.checked=false;
  }else localStorage.setItem("browserAlerts","0");
};
async function enableAlerts(){
  if(!("Notification" in window)){alert("Este navegador não oferece notificações.");return false;}
  const permission=await Notification.requestPermission();
  if(permission==="granted"){
    new Notification("Casa Fabiana",{body:"Alertas do navegador ativados enquanto o aplicativo estiver aberto.",icon:"icon-192.png"});
    localStorage.setItem("browserAlerts","1");
    document.getElementById("browserAlerts").checked=true;
    return true;
  }
  return false;
}
function checkAlerts(){
  if(localStorage.getItem("browserAlerts")!=="1" || Notification.permission!=="granted")return;
  const now=new Date();
  const hh=String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0");
  const tasks=routine[now.getDay()];
  const done=getDone(toDateKey(now),now.getDay());
  tasks.forEach((t,i)=>{
    const key=`notified-${toDateKey(now)}-${i}`;
    if(t[0]===hh && !done[i] && !sessionStorage.getItem(key)){
      new Notification(t[1],{body:`${t[2]} — ${t[3]}`,icon:"icon-192.png"});
      sessionStorage.setItem(key,"1");
    }
  });
}
setInterval(checkAlerts,30000);

document.getElementById("downloadCalendar").onclick=()=>{
  const year=new Date().getFullYear();
  let ics="BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Casa Fabiana//PT-BR\r\nCALSCALE:GREGORIAN\r\n";
  const monthlies=[["Janelas e vidros",5],["Portas e batentes",10],["Rodapés",15],["Armários por fora",20],["Geladeira por dentro",25]];
  monthlies.forEach(([title,day])=>{
    const dd=String(day).padStart(2,"0");
    ics+=`BEGIN:VEVENT\r\nUID:${title.replace(/\s/g,"")}-${year}@casafabiana\r\nDTSTART:${year}01${dd}T193000\r\nRRULE:FREQ=MONTHLY;BYMONTHDAY=${day}\r\nSUMMARY:${title}\r\nBEGIN:VALARM\r\nTRIGGER:-PT10M\r\nACTION:DISPLAY\r\nDESCRIPTION:${title}\r\nEND:VALARM\r\nEND:VEVENT\r\n`;
  });
  ics+="END:VCALENDAR";
  const blob=new Blob([ics],{type:"text/calendar"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="Casa-Fabiana-Lembretes.ics";a.click();
};

document.getElementById("clearHistory").onclick=()=>{
  if(confirm("Apagar todo o histórico?")){localStorage.removeItem("history");renderHistory();}
};
document.getElementById("exportBackup").onclick=()=>{
  const data={};
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i); data[k]=localStorage.getItem(k);
  }
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="Casa-Fabiana-Backup.json";a.click();
};
document.getElementById("importBackup").onchange=(e)=>{
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      Object.entries(data).forEach(([k,v])=>localStorage.setItem(k,v));
      alert("Backup importado."); location.reload();
    }catch{alert("Arquivo de backup inválido.");}
  };
  reader.readAsText(file);
};
document.getElementById("clearData").onclick=()=>{
  if(confirm("Apagar todos os dados salvos do Casa Fabiana?")){localStorage.clear();location.reload();}
};

if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");


const spaces = [
  {id:"sala",name:"🛋️ Sala de Estar",tasks:["Aspirar","Passar pano","Tirar pó","Limpar sofá","Limpar janela"]},
  {id:"cozinha",name:"🍽️ Cozinha",tasks:["Limpar pia","Limpar fogão","Limpar bancada","Limpar mesa","Esvaziar lixo","Limpar micro-ondas","Geladeira por fora","Geladeira por dentro"]},
  {id:"suite",name:"🛏️ Quarto Suíte",tasks:["Arrumar cama","Tirar pó","Organizar roupas","Aspirar","Passar pano"]},
  {id:"vitoria",name:"🛏️ Quarto Vitória",tasks:["Arrumar cama","Tirar pó","Organizar roupas","Aspirar","Passar pano"]},
  {id:"closet",name:"👗 Closet",tasks:["Guardar roupas","Organizar gavetas","Organizar sapatos","Tirar pó","Aspirar"]},
  {id:"banheiros",name:"🚿 Banheiros",tasks:["Vaso","Pia","Espelho","Box","Chão","Lixeira"]},
  {id:"lavanderia",name:"🧺 Lavanderia",tasks:["Tanque","Máquina","Produtos","Piso","Lixeira"]},
  {id:"area",name:"🌿 Área Gourmet + Garagem",tasks:["Varrer","Lavar piso","Organizar mesa","Retirar lixo","Conferir ralos","Limpar portão"]}
];

function spaceKey(id){return `space-${id}`;}
function renderSpaces(){
  const grid=document.getElementById("spacesGrid"); if(!grid)return; grid.innerHTML="";
  spaces.forEach(space=>{
    const done=JSON.parse(localStorage.getItem(spaceKey(space.id))||"{}");
    const completed=Object.values(done).filter(Boolean).length;
    const card=document.createElement("div"); card.className="space-card";
    card.innerHTML=`<h3>${space.name}</h3><p>${completed} de ${space.tasks.length} concluídas</p>
      <div class="space-progress"><div style="width:${completed/space.tasks.length*100}%"></div></div>
      <div class="space-task-list"></div>`;
    const list=card.querySelector(".space-task-list");
    space.tasks.forEach((task,i)=>{
      const row=document.createElement("label"); row.className="space-task";
      row.innerHTML=`<input type="checkbox" ${done[i]?"checked":""}><span>${task}</span>`;
      row.querySelector("input").onchange=(e)=>{
        done[i]=e.target.checked; localStorage.setItem(spaceKey(space.id),JSON.stringify(done)); renderSpaces();
      };
      list.appendChild(row);
    });
    grid.appendChild(card);
  });
}
renderSpaces();

const robot1Tasks=[
  ["Reservatório","Esvaziar após a limpeza"],
  ["Pano","Lavar e deixar secar"],
  ["Sensores","Limpar semanalmente"],
  ["Escova principal","Retirar cabelos"],
  ["Filtro","Conferir e substituir quando necessário"]
];
const robot2Tasks=[
  ["Reservatório","Esvaziar após a limpeza"],
  ["Pano","Lavar e deixar secar"],
  ["Sensores","Limpar semanalmente"],
  ["Escovas laterais","Retirar cabelos"],
  ["Filtro","Conferir e substituir quando necessário"]
];
const petTasks=[
  ["Água","Trocar manhã e noite"],
  ["Ração","Oferecer nos horários"],
  ["Caminhas","Lavar semanalmente"],
  ["Banho","Registrar quando fizer"],
  ["Vermífugo","Conferir a próxima data"],
  ["Vacinas","Conferir a carteirinha"]
];

function renderMiniList(targetId,key,items){
  const target=document.getElementById(targetId); if(!target)return;
  const done=JSON.parse(localStorage.getItem(key)||"{}"); target.innerHTML="";
  items.forEach((item,i)=>{
    const row=document.createElement("label"); row.className="mini-item";
    row.innerHTML=`<input type="checkbox" ${done[i]?"checked":""}><span><b>${item[0]}</b><small>${item[1]}</small></span>`;
    row.querySelector("input").onchange=(e)=>{
      done[i]=e.target.checked; localStorage.setItem(key,JSON.stringify(done));
    };
    target.appendChild(row);
  });
}
renderMiniList("robot1List","robot1-checks",robot1Tasks);
renderMiniList("robot2List","robot2-checks",robot2Tasks);
renderMiniList("petsList","pets-checks",petTasks);

let shoppingFilter="Todos";
function getShopping(){
  return JSON.parse(localStorage.getItem("shopping")||JSON.stringify([
    {id:crypto.randomUUID(),title:"Desinfetante",category:"Limpeza",done:false},
    {id:crypto.randomUUID(),title:"Saco de lixo",category:"Limpeza",done:false},
    {id:crypto.randomUUID(),title:"Ração dos cães",category:"Pets",done:false}
  ]));
}
function saveShopping(items){localStorage.setItem("shopping",JSON.stringify(items));}
function renderShoppingFilters(){
  const box=document.getElementById("shoppingFilters"); if(!box)return; box.innerHTML="";
  ["Todos","Limpeza","Mercado","Pets","Higiene","Outros"].forEach(cat=>{
    const b=document.createElement("button"); b.className="chip "+(shoppingFilter===cat?"active":""); b.textContent=cat;
    b.onclick=()=>{shoppingFilter=cat;renderShoppingFilters();renderShopping();}; box.appendChild(b);
  });
}
function renderShopping(){
  const box=document.getElementById("shoppingList"); if(!box)return; box.innerHTML="";
  let items=getShopping(); saveShopping(items);
  items.filter(x=>shoppingFilter==="Todos"||x.category===shoppingFilter).forEach(item=>{
    const row=document.createElement("div"); row.className="shop-item "+(item.done?"done":"");
    row.innerHTML=`<input type="checkbox" ${item.done?"checked":""}>
      <div><div class="shop-title"><b>${item.title}</b></div><div class="shop-cat">${item.category}</div></div>
      <button class="delete-small">Excluir</button>`;
    row.querySelector("input").onchange=(e)=>{
      const all=getShopping(); const found=all.find(x=>x.id===item.id); if(found)found.done=e.target.checked; saveShopping(all); renderShopping();
    };
    row.querySelector("button").onclick=()=>{
      saveShopping(getShopping().filter(x=>x.id!==item.id)); renderShopping();
    };
    box.appendChild(row);
  });
  if(!box.children.length) box.innerHTML='<div class="card">Nenhum item nesta categoria.</div>';
}
document.getElementById("shoppingForm")?.addEventListener("submit",(e)=>{
  e.preventDefault();
  const title=document.getElementById("shoppingInput").value.trim();
  const category=document.getElementById("shoppingCategory").value;
  if(!title)return;
  const items=getShopping(); items.unshift({id:crypto.randomUUID(),title,category,done:false}); saveShopping(items);
  e.target.reset(); renderShopping();
});
document.getElementById("clearBought")?.addEventListener("click",()=>{
  if(confirm("Remover os itens já comprados?")){saveShopping(getShopping().filter(x=>!x.done));renderShopping();}
});
renderShoppingFilters(); renderShopping();
