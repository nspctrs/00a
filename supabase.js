// Camada de sincronização remota do 00a.
// Funciona junto do IndexedDB: o navegador continua tendo uma cópia local,
// enquanto o Supabase permite que outros computadores vejam a mesma sessão.
(function(){
  const cfg=window.SUPABASE_CONFIG;
  window.REMOTE={enabled:false,client:null,simulationId:null,terminalId:localStorage.getItem('urna-00a-terminal')||crypto.randomUUID()};
  localStorage.setItem('urna-00a-terminal',window.REMOTE.terminalId);
  if(!cfg?.url||!cfg?.publishableKey||cfg.publishableKey.includes('COLOQUE_SUA_CHAVE')) return;
  if(!window.supabase) return;
  window.REMOTE.client=window.supabase.createClient(cfg.url,cfg.publishableKey);
  window.REMOTE.enabled=true;
  window.REMOTE.setSimulation=async function(sim){
    window.REMOTE.simulationId=sim.id;
    await window.REMOTE.client.from('simulations').upsert({id:sim.id,name:sim.name,status:'open'},{onConflict:'id'});
  };
  window.REMOTE.saveVote=async function(v){
    if(!window.REMOTE.enabled||!window.REMOTE.simulationId) return {data:null,error:null,remote:false};
    const payload={id:v.id,simulation_id:window.REMOTE.simulationId,terminal_id:window.REMOTE.terminalId,created_at:v.createdAt,selections:v.selections};
    const result=await window.REMOTE.client.from('votes').insert(payload);
    return {...result,remote:true};
  };
  window.REMOTE.getVotes=async function(){
    if(!window.REMOTE.enabled||!window.REMOTE.simulationId) return {data:[],error:null,remote:false};
    return {...(await window.REMOTE.client.from('votes').select('*').eq('simulation_id',window.REMOTE.simulationId).order('created_at')) ,remote:true};
  };
  window.REMOTE.subscribe=function(onChange){
    if(!window.REMOTE.enabled||!window.REMOTE.simulationId) return null;
    return window.REMOTE.client.channel('votes-'+window.REMOTE.simulationId)
      .on('postgres_changes',{event:'*',schema:'public',table:'votes',filter:'simulation_id=eq.'+window.REMOTE.simulationId},onChange)
      .subscribe();
  };
})();
