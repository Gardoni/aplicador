// Aplicador Web - app.js
import { db } from './firebase-config.js';
import { doc, setDoc, getDoc, getDocs, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let profLogado=null, provas=[], resultados=[], pdfAtual=null, provaAtual=null, respostas=[], timerInterval=null, editandoSalaId=null, alunoLogado=null;
window.todasProvas=[];
function norm(s){return s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'_');}
function parseDataLocal(str){ try{ let [d,h]=str.split('T'); let [a,m,da]=d.split('-').map(Number); let [hh,mm]=h.split(':').map(Number); return new Date(a,m-1,da,hh,mm);}catch{return new Date(str);} }

window.showTab=t=>{
  if(t=='prof'){
    if(!profLogado){document.getElementById('loginProf').style.display='block'; document.getElementById('areaProf').style.display='none';}
    else{document.getElementById('loginProf').style.display='none'; document.getElementById('areaProf').style.display='block';}
    document.getElementById('areaAluno').style.display='none';
  }else{
    document.getElementById('areaAluno').style.display='block';
    document.getElementById('areaProf').style.display='none';
    document.getElementById('loginProf').style.display='none';
  }
}

async function carregarSalasParaAluno(){
  let snap=await getDocs(collection(db,"provas"));
  window.todasProvas=[]; snap.forEach(d=>window.todasProvas.push(d.data()));
  document.getElementById('statusFirebase').innerText="✅ Aplicador Web - "+window.todasProvas.length+" provas";
}

window.loginProfessor=async()=>{
  let u=document.getElementById('profNome').value.trim();
  let s=document.getElementById('profSenha').value.trim();
  let id=norm(u);
  let snap=await getDoc(doc(db,"professores",id));
  if(!snap.exists()){document.getElementById('msgLogin').innerText="Não encontrado"; return;}
  let d=snap.data();
  if(d.senha!=s){document.getElementById('msgLogin').innerText="Senha errada"; return;}
  profLogado=d; localStorage.setItem('prof_logado',JSON.stringify(d));
  document.getElementById('loginProf').style.display='none';
  document.getElementById('areaProf').style.display='block';
  carregarDaNuvem();
}

window.sair=()=>{ localStorage.removeItem('prof_logado'); location.reload(); };
window.loadPDF=i=>{ let f=i.files[0]; let r=new FileReader(); r.onload=e=>{pdfAtual=e.target.result; document.getElementById('pdfInfo').innerText="✅ "+f.name;}; r.readAsDataURL(f); };

async function carregarDaNuvem(){
  if(!profLogado) return;
  let snapProvas=await getDocs(collection(db,"provas"));
  provas=[]; snapProvas.forEach(d=>{let p=d.data(); if(p.professorId==profLogado.id) provas.push(p);});
  renderSalas(); await carregarSalasParaAluno();
}

window.salvarProva=async()=>{
  let nome=document.getElementById('nomeProva').value;
  let senha=document.getElementById('senhaUnica').value;
  let ini=document.getElementById('dataInicio').value;
  let fim=document.getElementById('dataFim').value;
  let qtd=parseInt(document.getElementById('qtdQuestoes').value);
  let gab=document.getElementById('gabaritoProf').value.split(',').map(s=>s.trim().toUpperCase());
  let id=editandoSalaId||`${profLogado.id}_${norm(senha)}`;
  let obj={id, nome, senha, inicio:ini, fim:fim, qtd, gabarito:gab, pdf:pdfAtual||"", professorId:profLogado.id, professorNome:profLogado.usuario, timestamp:Date.now(), questoes:window.questoesDoWord||[]};
  await setDoc(doc(db,"provas",id),obj,{merge:true});
  alert("✅ Salvo no Aplicador Web! Código: "+senha);
  location.reload();
}

function renderSalas(){
  let div=document.getElementById('listaProvas');
  if(!div) return;
  div.innerHTML=provas.map(p=>`<div style="background:#222;padding:10px;border-radius:10px;margin:5px"><b>${p.nome}</b> - Código: ${p.senha} <button onclick="apagarSala('${p.id}')">🗑️</button></div>`).join('');
}
window.apagarSala=async(id)=>{ if(!confirm("Apagar?"))return; await deleteDoc(doc(db,"provas",id)); location.reload(); }

carregarSalasParaAluno();