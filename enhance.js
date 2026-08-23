(() => {
  const SOUND = { ctx: null };
  function audio(){ if(!SOUND.ctx) SOUND.ctx=new(window.AudioContext||window.webkitAudioContext)(); if(SOUND.ctx.state==='suspended')SOUND.ctx.resume(); return SOUND.ctx; }
  function tone(freq,duration=.07,delay=0,volume=.045){const ctx=audio(),now=ctx.currentTime+delay,o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(volume,now+.008);g.gain.exponentialRampToValueAtTime(.001,now+duration);o.connect(g).connect(ctx.destination);o.start(now);o.stop(now+duration+.01)}
  function keySound(){tone(620,.045,0,.025)}
  function confirmSound(){tone(520,.08,0,.035);tone(690,.09,.07,.035)}
  function finalSound(){[520,660,780,930,1100,1320].forEach((f,i)=>tone(f,.12,i*.075,.04))}
  window.addEventListener('pointerdown',()=>{try{audio()}catch(e){}},{once:true});
  document.querySelectorAll('[data-key]').forEach(b=>b.addEventListener('click',keySound));
  document.getElementById('blankBtn')?.addEventListener('click',()=>tone(390,.08,0,.03));
  document.getElementById('correctBtn')?.addEventListener('click',()=>tone(300,.08,0,.03));

  const confirmBtn=document.getElementById('confirmBtn');
  if(confirmBtn){confirmBtn.addEventListener('click',(e)=>{if(confirmBtn.dataset.locked==='1')return;confirmBtn.dataset.locked='1';e.preventDefault();e.stopImmediatePropagation();confirmSound();setTimeout(async()=>{try{await window.confirmVote()}finally{confirmBtn.dataset.locked='0'}},1000)},true)}

  let photoData=[];
  function parseCSV(text){const rows=[];let row=[],field='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&quoted&&n==='"'){field+='"';i++;continue}if(c==='"'){quoted=!quoted;continue}if(c===';'&&!quoted){row.push(field);field='';continue}if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(field);field='';if(row.some(x=>x!==''))rows.push(row);row=[];continue}field+=c}if(field!==''||row.length){row.push(field);rows.push(row)}const h=rows.shift().map(x=>x.trim());return rows.map(r=>Object.fromEntries(h.map((k,i)=>[k,(r[i]??'').trim()]))) }
  async function loadPhotoData(){try{const [a,b]=await Promise.all([fetch('https://raw.githubusercontent.com/leofn/tse-candidatos-2026/main/dados/consulta_cand_2026_ES.csv'),fetch('https://raw.githubusercontent.com/leofn/tse-candidatos-2026/main/dados/consulta_cand_2026_BR.csv')]);photoData=[...parseCSV(await a.text()).map(x=>({...x,source:'ES'})),...parseCSV(await b.text()).map(x=>({...x,source:'BR'}))]}catch(e){}}
  function photoCandidates(img){const alt=img.getAttribute('alt')||'';const c=photoData.find(x=>alt.includes(x.NM_URNA_CANDIDATO||'')||alt.includes(x.NM_CANDIDATO||''));if(!c||!c.SQ_CANDIDATO)return[];const uf=c.source==='BR'?'br':'es',sq=encodeURIComponent(c.SQ_CANDIDATO);return[`https://resultados.tse.jus.br/oficial/ele2026/6259/fotos/${uf}/${sq}.jpeg`,`https://resultados.tse.jus.br/oficial/ele2026/6259/fotos/${uf}/${sq}.jpg`]}
  function upgradePhotos(root=document){root.querySelectorAll?.('.photo').forEach(img=>{if(img.dataset.upgraded)return;img.dataset.upgraded='1';const urls=photoCandidates(img);let i=0;const next=()=>{if(i>=urls.length){img.classList.add('photo-fallback');return}img.src=urls[i++]};img.addEventListener('error',next);if(urls.length)next()})}
  const observer=new MutationObserver(()=>upgradePhotos());observer.observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});loadPhotoData();

  const panel=document.querySelector('.control-panel');
  if(panel){const storage=document.createElement('div');storage.className='storage-card';storage.innerHTML=`<div><span class="storage-dot"></span><strong>ARQUIVO LOCAL DA SIMULAÇÃO</strong><p id="storageInfo">Verificando votos salvos…</p></div><div class="storage-actions"><button id="quickBackup">BAIXAR BACKUP</button><button id="quickCount">VER APURAÇÃO</button></div>`;panel.appendChild(storage);document.getElementById('quickBackup').onclick=()=>window.exportJSON?.();document.getElementById('quickCount').onclick=()=>window.count?.()}
  async function refreshStorage(){try{const votes=await window.getVotes?.(),el=document.getElementById('storageInfo');if(el)el.innerHTML=`<b>${votes?.length||0}</b> voto(s) concluído(s) estão salvos <b>neste navegador</b>. Nada é enviado ao GitHub automaticamente. <span>Faça um backup JSON antes de limpar os dados.</span>`}catch(e){}}
  setInterval(refreshStorage,1000);refreshStorage();
})();
