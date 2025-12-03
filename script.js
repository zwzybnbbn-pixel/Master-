function toggleMenu(){const m=document.getElementById("menuBox");m.style.display=m.style.display==="block"?"none":"block";}
const doctors=[
{name:"محمد صالح",spec:"باطنة",hos:"العاصمة",time:"8 صباحاً"},
{name:"أحمد ناصر",spec:"قلب",hos:"السلام",time:"مساء"}
];
function searchDoctor(){
let q=document.getElementById("searchInput").value.trim();
let box=document.getElementById("doctorCards");
box.innerHTML="";
doctors.filter(d=>d.name.includes(q)).forEach(d=>{
box.innerHTML+=`<div class='card'><h3>${d.name}</h3><p>${d.spec}</p><p>${d.hos}</p><p>${d.time}</p></div>`;
});
}
