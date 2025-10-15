const LS_KEY='liq_v30_1';let state=JSON.parse(localStorage.getItem(LS_KEY)||'{"params":{"saldoInicial":251676.44,"taxaMensal":0.78,"parcelaPlanejada":3772.02},"registros":[]}');
const $=id=>document.getElementById(id);
const fmt=v=>v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
function save(){localStorage.setItem(LS_KEY,JSON.stringify(state));}
function mesesPagos(){return state.registros.filter(r=>r.tipo==='parcela').length;}
function mesesRestantes(){return Math.max(1,50-mesesPagos());}
function updateSugerido(){const s=saldoAtual();const v=s/mesesRestantes();$('valorSugerido').value=v.toFixed(2);}
function saldoAtual(){let saldo=state.params.saldoInicial;const t=state.params.taxaMensal/100;state.registros.sort((a,b)=>new Date(a.data)-new Date(b.data));for(let r of state.registros){saldo+=saldo*t;saldo-=r.valor;}return saldo;}
function updateTempo(){const m=mesesRestantes();const hoje=new Date();const data=new Date(hoje.getFullYear(),hoje.getMonth()+m,hoje.getDate());$('tempoQuitacao').textContent=m+' meses';$('dataQuitacao').textContent=data.toLocaleDateString('pt-BR');}
function render(){const tb=$('tabela').querySelector('tbody');tb.innerHTML='';let saldo=state.params.saldoInicial;const taxa=state.params.taxaMensal/100;state.registros.forEach((r,i)=>{saldo+=saldo*taxa;saldo-=r.valor;const juros=saldo*taxa;const tr=document.createElement('tr');tr.innerHTML=`<td>${i+1}</td><td>${r.data}</td><td>${r.tipo}</td><td>${fmt(r.valor)}</td><td>${fmt(juros)}</td><td>${fmt(r.valor)}</td><td>${fmt(saldo)}</td><td>${r.obs||''}</td>`;tb.appendChild(tr);});updateSugerido();updateTempo();save();}
function addRegistro(tipo){const valor=parseFloat($('valorPago').value)||0;const data=$('dataPagamento').value||new Date().toISOString().slice(0,10);const obs=$('obs').value;if(valor<=0){alert('Informe valor válido');return;}state.registros.push({tipo,valor,data,obs});$('valorPago').value='';$('obs').value='';render();}
$('btnSalvarParametros').onclick=()=>{state.params.saldoInicial=parseFloat($('saldoInicial').value)||0;state.params.taxaMensal=parseFloat($('taxaMensal').value)||0;state.params.parcelaPlanejada=parseFloat($('parcelaPlanejada').value)||0;render();}
$('btnResetar').onclick=()=>{if(confirm('Resetar tudo?')){state={"params":{"saldoInicial":0,"taxaMensal":0,"parcelaPlanejada":0},"registros":[]};render();}}
$('btnConfirmarParcela').onclick=()=>addRegistro('parcela');
$('btnConfirmarAmortizacao').onclick=()=>addRegistro('amortizacao');
$('btnApagarTabela').onclick=()=>{if(confirm('Apagar registros?')){state.registros=[];render();}}
$('btnExportarCSV').onclick=()=>{let csv='Data;Tipo;Valor;Obs\n';state.registros.forEach(r=>{csv+=`${r.data};${r.tipo};${r.valor};${r.obs}\n`;});const blob=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='liquidacao_v30_1.csv';a.click();}
window.onload=()=>{$('saldoInicial').value=state.params.saldoInicial;$('taxaMensal').value=state.params.taxaMensal;$('parcelaPlanejada').value=state.params.parcelaPlanejada;render();}
