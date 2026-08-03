
const schedule = {
0:[["09:00","Manutenção leve","Organizar ambientes e recolher lixo"],["18:00","Planejar a semana","Conferir lista de compras e preparar segunda"]],
1:[["05:50","Água e ração","Cuidados dos Shih Tzus"],["06:00","Robô 1","Cozinha, Quarto Suíte, Quarto Vitória e Banheiro Social"],["06:00","Robô 2","Closet e Banheiro Suíte"],["18:05","Verificar os cães","Água e eventual xixi"],["18:10","Robô na sala","Aspirar Sala de Estar"],["18:40","Passar pano","Finalizar a sala"],["21:00","Organizar cozinha","Pia, fogão e bancada"]],
2:[["05:50","Água e ração","Cuidados dos Shih Tzus"],["06:00","Robôs","Executar os dois robôs"],["18:10","Tirar pó","Móveis, TV, aparadores e cabeceiras"],["18:40","Organizar quartos","Guardar roupas e sapatos"],["21:00","Organizar cozinha","Pia, fogão e bancada"]],
3:[["05:50","Água e ração","Cuidados dos Shih Tzus"],["06:00","Robôs","Executar os dois robôs"],["18:10","Robô na sala","Aspirar Sala de Estar"],["18:40","Lavar caminhas","Caminhas, mantas e potes"],["19:20","Aspirar sofá","Retirar pelos e poeira"],["21:00","Organizar cozinha","Pia, fogão e bancada"]],
4:[["05:50","Água e ração","Cuidados dos Shih Tzus"],["06:00","Robôs","Executar os dois robôs"],["18:10","Trocar roupa de cama","Quarto Suíte e Quarto Vitória"],["18:40","Organizar closet","Roupas, gavetas e sapatos"],["21:00","Organizar cozinha","Pia, fogão e bancada"]],
5:[["05:50","Água e ração","Cuidados dos Shih Tzus"],["06:00","Robôs","Executar os dois robôs"],["18:10","Robô na sala","Aspirar Sala de Estar"],["18:40","Geladeira e difusores","Limpar por fora e conferir refis"],["19:15","Esvaziar lixeiras","Todos os ambientes"],["21:00","Organizar cozinha","Pia, fogão e bancada"]],
6:[["08:30","Área gourmet + garagem","Piso, superfícies e organização"],["10:00","Lavanderia","Tanque, máquina e piso"],["11:00","Limpar robôs","Reservatórios, escovas, filtros e sensores"],["11:20","Difusores","Virar varetas e conferir refis"],["11:40","Conferir estoque","Produtos de limpeza e ração"]]
};

const weeklyText = [
["Segunda","Sala: robô e pano; rotina dos robôs pela manhã"],
["Terça","Tirar pó e organizar quartos"],
["Quarta","Sala, sofá e caminhas dos cães"],
["Quinta","Roupa de cama e closet"],
["Sexta","Sala, geladeira, lixeiras e difusores"],
["Sábado","Área gourmet + garagem, lavanderia e robôs"],
["Domingo","Manutenção leve e planejamento"]
];

const monthly = [
["Todo dia 5 • 19h30","Limpar janelas e vidros"],
["Todo dia 10 • 19h30","Limpar portas e batentes"],
["Todo dia 15 • 19h30","Limpar rodapés"],
["Todo dia 20 • 19h30","Limpar armários por fora"],
["Todo dia 25 • 19h30","Limpar geladeira por dentro"],
["Último sábado • 09h00","Banheiros, lixeiras e panos de limpeza"],
["Jan/Abr/Jul/Out • dia 1 • 09h00","Luminárias, ventiladores e revisão dos armários"],
["Janeiro e julho • dia 15 • 09h00","Lavar cortinas e revisar colchões"],
["Todo dezembro • dia 1 • 09h00","Revisão anual e separação de doações"]
];

const rooms = {
"🛋️ Sala de Estar":["Executar robô","Passar pano","Organizar almofadas e mantas","Tirar pó dos móveis","Limpar TV","Aspirar sofá","Limpar rodapés","Limpar portas","Limpar janelas"],
"🍽️ Cozinha":["Executar robô","Limpar pia","Limpar fogão","Limpar bancada","Limpar mesa","Esvaziar lixo","Limpar micro-ondas","Limpar geladeira por fora","Limpar geladeira por dentro","Limpar armários"],
"🛏️ Quarto Suíte":["Executar robô","Arrumar cama","Tirar pó","Trocar roupa de cama","Limpar espelhos","Aspirar colchão"],
"🛏️ Quarto Vitória":["Executar robô","Arrumar cama","Tirar pó","Trocar roupa de cama","Limpar espelhos","Aspirar colchão"],
"👗 Closet":["Executar robô","Guardar roupas","Organizar sapatos","Limpar prateleiras","Separar peças para doação"],
"🚿 Banheiro Suíte":["Executar robô","Limpar pia","Limpar vaso","Limpar box","Limpar espelho","Trocar toalhas","Limpar rejuntes"],
"🚿 Banheiro Social":["Executar robô","Limpar pia","Limpar vaso","Limpar box","Limpar espelho","Trocar toalhas","Limpar rejuntes"],
"🧺 Lavanderia":["Limpar piso","Limpar tanque","Limpar máquina","Organizar produtos","Lavar panos"],
"🌿 Área Gourmet + Garagem":["Varrer ou executar robô","Passar pano ou lavar piso","Limpar bancada","Limpar churrasqueira","Limpar ralos","Organizar mesa e cadeiras"],
"🐶 Pets":["Limpar xixi com enzimático","Lavar potes","Lavar caminhas","Lavar mantas","Higienizar brinquedos"],
"🏠 Casa Inteira":["Interruptores","Maçanetas","Portas","Rodapés","Janelas","Luminárias","Difusores"]
};

const now = new Date();
const dayKey = now.toISOString().slice(0,10);
let done = JSON.parse(localStorage.getItem("done-"+dayKey)||"{}");
let history = JSON.parse(localStorage.getItem("history")||"{}");

document.getElementById("dateLabel").textContent =
  now.toLocaleDateString("pt-BR",{weekday:"long",day:"2-digit",month:"long"});
document.getElementById("greeting").textContent =
  `${now.getHours()<12?"Bom dia":now.getHours()<18?"Boa tarde":"Boa noite"}, Fabiana`;

function renderToday(){
  const box=document.getElementById("todayList");
  box.innerHTML="";
  const tasks=schedule[now.getDay()];
  tasks.forEach((t,i)=>{
    const row=document.createElement("div");
    row.className="task "+(done[i]?"done":"");
    row.innerHTML=`<div class="time">${t[0]}</div>
      <div><div class="title">${t[1]}</div><div class="sub">${t[2]}</div></div>
      <button class="check" aria-label="Concluir"></button>`;
    row.querySelector("button").onclick=()=>{
      done[i]=!done[i];
      localStorage.setItem("done-"+dayKey,JSON.stringify(done));
      history[dayKey]=done;
      localStorage.setItem("history",JSON.stringify(history));
      renderToday();
      renderStats();
    };
    box.appendChild(row);
  });
  const completed=Object.values(done).filter(Boolean).length;
  document.getElementById("summaryCount").textContent=`${completed} de ${tasks.length}`;
  document.getElementById("progressBar").style.width=`${tasks.length?completed/tasks.length*100:0}%`;
  const next=tasks.find((_,i)=>!done[i]);
  document.getElementById("nextTask").textContent=
    next?`Próxima tarefa: ${next[0]} — ${next[1]}`:"Tudo concluído por hoje.";
}
renderToday();

document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(btn.dataset.target).classList.add("active");
});

const roomGrid=document.getElementById("roomGrid");
Object.entries(rooms).forEach(([name,tasks])=>{
  const b=document.createElement("button");
  b.className="room";
  const [emoji,...rest]=name.split(" ");
  b.innerHTML=`<span>${emoji}</span><b>${rest.join(" ")}</b><small>${tasks.length} tarefas</small>`;
  b.onclick=()=>openRoom(name,tasks);
  roomGrid.appendChild(b);
});

function openRoom(name,tasks){
  document.getElementById("modalTitle").textContent=name;
  const box=document.getElementById("modalList");
  box.innerHTML="";
  tasks.forEach((task,i)=>{
    const k=`room-${name}-${i}`;
    const v=localStorage.getItem(k)==="1";
    const row=document.createElement("div");
    row.className="task "+(v?"done":"");
    row.innerHTML=`<div class="time">•</div><div class="title">${task}</div>
      <button class="check" aria-label="Concluir"></button>`;
    row.querySelector("button").onclick=()=>{
      localStorage.setItem(k,v?"0":"1");
      openRoom(name,tasks);
    };
    box.appendChild(row);
  });
  document.getElementById("modal").classList.remove("hidden");
}

document.getElementById("closeModal").onclick=
  ()=>document.getElementById("modal").classList.add("hidden");

weeklyText.forEach(([d,t])=>{
  const x=document.createElement("div");
  x.className="agenda-item";
  x.innerHTML=`<b>${d}</b>${t}`;
  document.getElementById("weeklyPlan").appendChild(x);
});

monthly.forEach(([d,t])=>{
  const x=document.createElement("div");
  x.className="agenda-item";
  x.innerHTML=`<b>${d}</b>${t}`;
  document.getElementById("monthlyPlan").appendChild(x);
});

let stock = JSON.parse(localStorage.getItem("stock")||
  '["Detergente","Limpador enzimático","Papel higiênico","Refil Chá Branco","Refil Bamboo","Ração"]');
let stockDone = JSON.parse(localStorage.getItem("stockDone")||"{}");

function renderStock(){
  const box=document.getElementById("stockList");
  box.innerHTML="";
  stock.forEach((item,i)=>{
    const row=document.createElement("div");
    row.className="stock-item "+(stockDone[i]?"done":"");
    row.innerHTML=`<div class="time">🛒</div><div class="title">${item}</div>
      <button class="check" aria-label="Marcar"></button>`;
    row.querySelector("button").onclick=()=>{
      stockDone[i]=!stockDone[i];
      localStorage.setItem("stockDone",JSON.stringify(stockDone));
      renderStock();
    };
    box.appendChild(row);
  });
}
renderStock();

document.getElementById("addItem").onclick=()=>{
  const input=document.getElementById("newItem");
  const v=input.value.trim();
  if(!v)return;
  stock.push(v);
  localStorage.setItem("stock",JSON.stringify(stock));
  input.value="";
  renderStock();
};

function renderStats(){
  let total=0,complete=0;
  Object.values(history).forEach(day=>
    Object.values(day).forEach(v=>{total++;if(v)complete++;})
  );
  document.getElementById("doneWeek").textContent=complete;
  document.getElementById("pendingWeek").textContent=Math.max(total-complete,0);
  document.getElementById("percentWeek").textContent=
    total?Math.round(complete/total*100)+"%":"0%";
}
renderStats();

document.getElementById("resetDay").onclick=()=>{
  done={};
  localStorage.removeItem("done-"+dayKey);
  renderToday();
  renderStats();
};

document.getElementById("notifyBtn").onclick=async()=>{
  if(!("Notification" in window)){
    alert("Este navegador não oferece notificações.");
    return;
  }
  const p=await Notification.requestPermission();
  if(p==="granted"){
    new Notification("Casa Fabiana",{
      body:"Notificações autorizadas. Para maior confiabilidade, importe também o calendário.",
      icon:"icon-192.png"
    });
  }
};

function checkNotifications(){
  if(!("Notification" in window)||Notification.permission!=="granted")return;
  const d=new Date();
  const hh=String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
  schedule[d.getDay()].forEach((t,i)=>{
    const nk=`n-${dayKey}-${i}`;
    if(t[0]===hh&&!done[i]&&!sessionStorage.getItem(nk)){
      new Notification(t[1],{body:t[2],icon:"icon-192.png"});
      sessionStorage.setItem(nk,"1");
    }
  });
}
setInterval(checkNotifications,30000);

document.getElementById("downloadICS").onclick=()=>{
  let ics="BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Casa Fabiana//PT-BR\r\n";
  const recurring=[
    ["Janelas e vidros",5],
    ["Portas e batentes",10],
    ["Rodapés",15],
    ["Armários por fora",20],
    ["Geladeira por dentro",25]
  ];
  const y=new Date().getFullYear();
  recurring.forEach(([title,day])=>{
    const dd=String(day).padStart(2,"0");
    ics+=`BEGIN:VEVENT\r\nUID:${title.replace(/\s/g,"")}-${y}@casafabiana\r\n`+
         `DTSTART:${y}01${dd}T193000\r\n`+
         `RRULE:FREQ=MONTHLY;BYMONTHDAY=${day}\r\n`+
         `SUMMARY:${title}\r\nEND:VEVENT\r\n`;
  });
  ics+="END:VCALENDAR";
  const blob=new Blob([ics],{type:"text/calendar"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="Casa-Fabiana-Agenda.ics";
  a.click();
};

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}
