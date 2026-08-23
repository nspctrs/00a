(() => {
  const SOUND={ctx:null};
  function audio(){if(!SOUND.ctx)SOUND.ctx=new(window.AudioContext||window.webkitAudioContext)();if(SOUND.ctx.state==='suspended')SOUND.ctx.resume();return SOUND.ctx}
  function tone(f,d=.07,delay=0,v=.045){const c=audio(),n=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f,n);g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(v,n+.008);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(c.destination);o.start(n);o.stop(n+d+.01)}
  function keySound(){tone(620,.045,0,.025)} function confirmSound(){tone(520,.08,0,.035);tone(690,.09,.07,.035)} function finalSound(){[520,660,780,930,1100,1320].forEach((f,i)=>tone(f,.12,i*.075,.04))}
  window.addEventListener('pointerdown',()=>{try{audio()}catch(e){}},{once:true});
  document.querySelectorAll('[data-key]').forEach(b=>b.addEventListener('click',keySound));document.getElementById('blankBtn')?.addEventListener('click',()=>tone(390,.08,0,.03));document.getElementById('correctBtn')?.addEventListener('click',()=>tone(300,.08,0,.03));
  const confirmBtn=document.getElementById('confirmBtn');
  if(confirmBtn)confirmBtn.addEventListener('click',e=>{if(confirmBtn.dataset.locked==='1')return;confirmBtn.dataset.locked='1';e.preventDefault();e.stopImmediatePropagation();confirmSound();setTimeout(async()=>{try{await window.confirmVote();setTimeout(()=>{if(document.querySelector('.white-card h2')?.textContent==='FIM')finalSound()},80)}finally{confirmBtn.dataset.locked='0'}},1000)},true);

  let photoData=[];
  function parseCSV(t){const rows=[];let r=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i],n=t[i+1];if(c==='"'&&q&&n==='"'){f+='"';i++;continue}if(c==='"'){q=!q;continue}if(c===';'&&!q){r.push(f);f='';continue}if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;r.push(f);f='';if(r.some(x=>x!==''))rows.push(r);r=[];continue}f+=c}if(f!==''||r.length){r.push(f);rows.push(r)}const h=rows.shift().map(x=>x.trim());return rows.map(x=>Object.fromEntries(h.map((k,i)=>[k,(x[i]??'').trim()]))) }
  async function loadPhotoData(){try{const[a,b]=await Promise.all([fetch('https://raw.githubusercontent.com/leofn/tse-candidatos-2026/main/dados/consulta_cand_2026_ES.csv'),fetch('https://raw.githubusercontent.com/leofn/tse-candidatos-2026/main/dados/consulta_cand_2026_BR.csv')]);photoData=[...parseCSV(await a.text()).map(x=>({...x,source:'ES'})),...parseCSV(await b.text()).map(x=>({...x,source:'BR'}))]}catch(e){}}
  function photoCandidates(img){const alt=img.getAttribute('alt')||'',c=photoData.find(x=>alt.includes(x.NM_URNA_CANDIDATO||'')||alt.includes(x.NM_CANDIDATO||''));if(!c?.SQ_CANDIDATO)return[];const uf=c.source==='BR'?'br':'es',sq=encodeURIComponent(c.SQ_CANDIDATO),el=c.CD_ELEICAO||'6259';return[`https://resultados.tse.jus.br/oficial/ele2026/${el}/fotos/${uf}/${sq}.jpeg`,`https://resultados.tse.jus.br/oficial/ele2026/${el}/fotos/${uf}/${sq}.jpg`]}
  function upgradePhotos(root=document){root.querySelectorAll?.('.photo').forEach(img=>{if(img.dataset.upgraded)return;img.dataset.upgraded='1';const u=photoCandidates(img);let i=0;const next=()=>{if(i>=u.length){img.classList.add('photo-fallback');return}img.src=u[i++]};img.addEventListener('error',next);if(u.length)next()})}
  new MutationObserver(()=>upgradePhotos()).observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});loadPhotoData();

  const panel=document.querySelector('.control-panel');
  if(panel){const s=document.createElement('div');s.className='storage-card';s.innerHTML=`<div><span class="storage-dot"></span><strong>ARQUIVO LOCAL DA SIMULAÇÃO</strong><p id="storageInfo">Verificando votos salvos…</p></div><div class="storage-actions"><button id="quickBackup">BAIXAR BACKUP</button><button id="quickCount">VER APURAÇÃO</button></div>`;panel.appendChild(s);document.getElementById('quickBackup').onclick=()=>window.exportJSON?.();document.getElementById('quickCount').onclick=()=>window.count?.()}
  async function refreshStorage(){try{const v=await window.getVotes?.(),e=document.getElementById('storageInfo');if(e)e.innerHTML=`<b>${v?.length||0}</b> voto(s) concluído(s) estão salvos <b>neste navegador</b>. Nada é enviado ao GitHub automaticamente. <span>Faça um backup JSON antes de limpar os dados.</span>`}catch(e){}}
  setInterval(refreshStorage,1000);refreshStorage();
})();
