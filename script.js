const CONFIG={
  appLogo:"https://cdn.discordapp.com/attachments/1534994983281623230/1538983935000969307/PNG_-_Pngtree.jpg?ex=6a84a9fb&is=6a83587b&hm=05db9348ddcbbfecad10d8c94aa22a428d7b876e48cf0e1dfe4799440d3fb51d&",
  ownerDiscord:"https://discord.gg/vYhcdSUdnG",
  ownerPortfolio:"https://hasanhridoy.site.je/",
  license:"#",
  aiHelp:"https://chatgpt.com/"
};
const KEY="GLOW90_PREMIUM_V1";
const defaults={startDate:new Date().toISOString().slice(0,10),name:"GLOW90 Member",completed:{},water:{},sleep:{},workout:{},skin:{},challenge:{},photos:[],theme:"dark"};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||defaults;
const tasks=[
["skin-am","Morning skincare","Cleanser + moisturizer + SPF 50"],
["water-am","Hydration","Start with 1–2 glasses of water"],
["movement","Movement","20–30 min walk or workout"],
["food","Protein meal","Eggs, fish, meat, milk or dal"],
["posture","Posture practice","5 minutes of posture drills"],
["skin-pm","Night skincare","Cleanser + moisturizer"],
["sleep","Sleep on time","Aim for 7–9 hours"]
];
const quotes=["Consistency beats motivation.","Your future self is built by today's habits.","Small progress is still progress.","Don't quit on a bad day.","Discipline makes the glow-up visible."];
const challenges=["No soft drinks today","Walk for 30 minutes","Sleep 8 hours","Complete every skincare task","No junk food today","Drink 8 glasses of water"];
const day=()=>Math.max(1,Math.min(90,Math.floor((new Date()-new Date(state.startDate+"T00:00:00"))/86400000)+1));
const key=()=>new Date().toISOString().slice(0,10);
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
function phase(){return day()<=30?["Foundation","Days 1–30"]:day()<=60?["Build & Sharpen","Days 31–60"]:["Final Transformation","Days 61–90"]}
function go(page){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));document.getElementById(page).classList.add("active");document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===page));scrollTo({top:0,behavior:"smooth"})}
document.querySelectorAll("[data-page]").forEach(x=>x.onclick=()=>go(x.dataset.page));
function renderTasks(target){
 const m=state.completed[key()]||{};
 document.getElementById(target).innerHTML=tasks.map(([id,title,sub])=>`<button class="task ${m[id]?"done":""}" data-id="${id}"><span class="check">${m[id]?"✓":""}</span><span class="task-info"><b>${title}</b><small>${sub}</small></span></button>`).join("");
 document.querySelectorAll(`#${target} .task`).forEach(x=>x.onclick=()=>toggle(x.dataset.id));
}
function toggle(id){state.completed[key()]=state.completed[key()]||{};state.completed[key()][id]=!state.completed[key()][id];if(id==="movement")state.workout[key()]=state.completed[key()][id];if(id==="skin-am"||id==="skin-pm")state.skin[key()]=state.completed[key()][id];save();render();toast(state.completed[key()][id]?"Completed ✓":"Unchecked")}
function completedCount(){return Object.values(state.completed[key()]||{}).filter(Boolean).length}
function render(){
 const d=day(), count=completedCount(), pct=Math.round(count/tasks.length*100), p=phase();
 document.getElementById("dayNumber").textContent=d;document.getElementById("progressDay").textContent=d;
 document.getElementById("percent").textContent=pct+"%";document.getElementById("score").textContent=pct;
 document.getElementById("ring").style.background=`conic-gradient(var(--accent) ${pct*3.6}deg,#272d34 0deg)`;
 document.getElementById("phase").textContent=p[0];document.getElementById("phaseDays").textContent=p[1];
 document.getElementById("scoreText").textContent=pct>=80?"Excellent consistency. Keep going.":pct>=40?"You're building momentum.":"Start your first task.";
 document.getElementById("quote").textContent=quotes[(d-1)%quotes.length];
 document.getElementById("profileName").textContent=state.name;document.getElementById("avatar").textContent=(state.name[0]||"G").toUpperCase();
 renderTasks("todayTasks");renderTasks("allTasks");renderQuick();renderProgress();renderAchievements();renderPhotos();
 document.getElementById("challengeTitle").textContent=challenges[(d-1)%challenges.length];
 document.getElementById("challengeBtn").textContent=state.challenge[key()]?"Completed ✓":"Complete challenge";
 document.getElementById("themeLabel").textContent=state.theme==="light"?"Light":"Dark";
}
function renderQuick(){const k=key();document.getElementById("waterValue").textContent=(state.water[k]||0)+" / 8 glasses";document.getElementById("sleepValue").textContent=state.sleep[k]?state.sleep[k]+" hours":"Not logged";document.getElementById("workoutValue").textContent=state.workout[k]?"Done ✓":"Not done";document.getElementById("skinValue").textContent=state.skin[k]?"Done ✓":"Not done"}
function setBar(id,v){v=Math.min(100,Math.round(v||0));document.getElementById(id+"Score").textContent=v+"%";document.getElementById(id+"Bar").style.width=v+"%"}
function renderProgress(){const days=Math.max(1,day()),all=Object.values(state.completed).reduce((a,v)=>a+Object.values(v).filter(Boolean).length,0);let skin=Object.values(state.skin).filter(Boolean).length/days*100,body=Object.values(state.workout).filter(Boolean).length/days*100,sleep=Object.values(state.sleep).filter(v=>Number(v)>=7).length/days*100,cons=all/(days*tasks.length)*100;setBar("skin",skin);setBar("body",body);setBar("sleep",sleep);setBar("consistency",cons);document.getElementById("totalDone").textContent=all;let s=0,dt=new Date();while(true){let k=dt.toISOString().slice(0,10);if(Object.values(state.completed[k]||{}).some(Boolean)){s++;dt.setDate(dt.getDate()-1)}else break}document.getElementById("streak").textContent=s}
function renderAchievements(){const all=Object.values(state.completed).reduce((a,v)=>a+Object.values(v).filter(Boolean).length,0),s=Number(document.getElementById("streak").textContent);const items=[["First Step",day()>0],["7 Day Warrior",s>=7],["20 Workouts",Object.values(state.workout).filter(Boolean).length>=20],["Hydration Hero",Object.values(state.water).reduce((a,v)=>a+Number(v),0)>=100],["Sleep Master",Object.values(state.sleep).filter(v=>Number(v)>=7).length>=7],["GLOW90 Complete",day()>=90&&all>=tasks.length*90]];document.getElementById("achievements").innerHTML=items.map(x=>`<div class="achievement ${x[1]?"":"locked"}"><b>${x[0]}</b><small>${x[1]?"Unlocked":"Locked"}</small></div>`).join("")}
function renderPhotos(){document.getElementById("photos").innerHTML=state.photos.map(src=>`<img src="${src}" alt="Progress photo">`).join("")}
document.querySelectorAll(".mini-card").forEach(b=>b.onclick=()=>{let k=key(),t=b.dataset.track;if(t==="water"){let n=Number(prompt("How many glasses today?",state.water[k]||0));if(!Number.isNaN(n))state.water[k]=Math.max(0,Math.min(20,n))}else if(t==="sleep"){let n=Number(prompt("How many hours did you sleep?",state.sleep[k]||8));if(!Number.isNaN(n))state.sleep[k]=Math.max(0,Math.min(24,n))}else{state[t][k]=!state[t][k]}save();render();toast("Updated")});
document.getElementById("challengeBtn").onclick=()=>{state.challenge[key()]=!state.challenge[key()];save();render();toast(state.challenge[key()]?"Challenge complete ✓":"Challenge unchecked")};
document.getElementById("nameBtn").onclick=()=>{let n=prompt("Your name",state.name);if(n&&n.trim()){state.name=n.trim();save();render()}};
document.getElementById("themeBtn").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";document.body.classList.toggle("light",state.theme==="light");save();render();toast("Theme changed")};
document.getElementById("reminderBtn").onclick=()=>document.getElementById("notifyBtn").click();
document.getElementById("notifyBtn").onclick=async()=>{if(!("Notification"in window))return toast("Notifications are not supported");let p=await Notification.requestPermission();toast(p==="granted"?"Reminders enabled ✓":"Permission not granted");if(p==="granted")new Notification("GLOW90",{body:"Your routine is waiting. Stay consistent."})};
document.getElementById("photoInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{state.photos.push(r.result);save();render();toast("Progress photo saved")};r.readAsDataURL(f)};
document.getElementById("resetBtn").onclick=()=>{if(confirm("Reset all GLOW90 progress?")){state={...defaults,startDate:new Date().toISOString().slice(0,10),name:state.name,theme:state.theme};save();render();toast("Progress reset")}};
document.getElementById("helpBtn").onclick=()=>document.getElementById("helpModal").classList.add("open");document.querySelectorAll("[data-close]").forEach(x=>x.onclick=()=>document.getElementById("helpModal").classList.remove("open"));
document.getElementById("appLogo").src=CONFIG.appLogo;document.getElementById("ownerDiscord").href=CONFIG.ownerDiscord;document.getElementById("ownerPortfolio").href=CONFIG.ownerPortfolio;document.getElementById("licenseLink").href=CONFIG.license;document.getElementById("aiLink").href=CONFIG.aiHelp;
if(CONFIG.appLogo)document.getElementById("appLogo").style.display="block";
document.body.classList.toggle("light",state.theme==="light");
render();
function toast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
