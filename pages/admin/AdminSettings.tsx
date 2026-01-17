
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../../lib/firebase';
import { 
  Building2, Brush, Globe, CreditCard, Save, Loader2, Camera, 
  Layout, Star, Zap, CheckCircle2, Search, Link as LinkIcon, BarChart3,
  Check, AlertTriangle, Copy, ShieldCheck, RefreshCw, ChevronRight
} from 'lucide-react';
import { Tenant } from '../../types';
import { compressImage } from '../../lib/utils';
import { StorageService } from '../../services/storageService';
import { DomainService, DNS_RECORDS } from '../../services/domainService';

const TEMPLATE_OPTIONS = [
  { id: 'heritage', name: 'Heritage', icon: <Building2 size={20}/>, desc: 'Clásico y Formal', color: '#1c2d51' },
  { id: 'canvas', name: 'Canvas', icon: <Layout size={20}/>, desc: 'Diseño Moderno y Limpio', color: '#357fb2' },
  { id: 'prestige', name: 'Prestige', icon: <Star size={20}/>, desc: 'Lujo y Minimalismo', color: '#000000' },
  { id: 'skyline', name: 'Skyline', icon: <Zap size={20}/>, desc: 'Urbano y Tecnológico', color: '#2563eb' },
  { id: 'luxe', name: 'Luxe', icon: <Brush size={20}/>, desc: 'Artístico y Lifestyle', color: '#2D2926' },
] as const;

const AdminSettings: React.FC = () => {
  const { tenant, setTenant, isLoading: tenantLoading } = useTenant();
  const { profile, user } = useAuth();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const [localTenant, setLocalTenant] = useState<Tenant>(tenant);
  const [success, setSuccess] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [verifying, setVerifying] = useState(false);
  const [dnsResults, setDnsResults] = useState<{rootOk: boolean, wwwOk: boolean, status: string} | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'general';

  const isBusiness = tenant.subscription?.plan_id === 'business' || profile?.email === 'snapimoveis@gmail.com';

  useEffect(() => {
    if (!tenantLoading && tenant) {
      setLocalTenant({ 
        ...tenant,
        seo_settings: tenant.seo_settings || { meta_title: '', meta_description: '', keywords: '', google_analytics_id: '' }
      });
    }
  }, [tenant, tenantLoading]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result as string, 400, 400, 0.6);
      setLocalTenant(prev => ({ ...prev, logo_url: compressed }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user || !localTenant.id || localTenant.id === 'default-tenant-uuid') return;
    setIsSaving(true);
    try {
      let finalLogoUrl = localTenant.logo_url;
      if (finalLogoUrl && finalLogoUrl.startsWith('data:image')) {
        finalLogoUrl = await StorageService.uploadBase64(`tenants/${localTenant.id}/branding/logo.png`, finalLogoUrl);
      }
      
      const { id, ...dataToSave } = localTenant;
      const updatedData = { 
        ...dataToSave, 
        logo_url: finalLogoUrl, 
        updated_at: serverTimestamp() 
      };
      
      await setDoc(doc(db, 'tenants', localTenant.id), updatedData, { merge: true });
      setTenant({ ...localTenant, logo_url: finalLogoUrl });
      
      const root = document.documentElement;
      if (localTenant.cor_primaria) root.style.setProperty('--primary', localTenant.cor_primaria);
      if (localTenant.cor_secundaria) root.style.setProperty('--secondary', localTenant.cor_secundaria);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { console.error(err); alert("Error al guardar."); } finally { setIsSaving(false); }
  };

  const handleVerifyDomain = async () => {
    const domain = localTenant.custom_domain;
    if (!domain || !DomainService.isValidFormat(domain)) { alert("Introduzca un dominio válido."); return; }
    setVerifying(true);
    try {
      const results = await DomainService.verifyDNS(domain);
      setDnsResults(results);
      if (results.status === 'verified') {
        const updated = { ...localTenant, domain_status: 'active' as const, domain_checked_at: serverTimestamp() };
        await setDoc(doc(db, 'tenants', localTenant.id), updated, { merge: true });
        setTenant(updated as any);
        alert("¡Dominio activado!");
      }
    } finally { setVerifying(false); }
  };

  if (tenantLoading) return <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-[#1c2d51]" /></div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in pb-20 font-brand">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#1c2d51] tracking-tighter uppercase">Ajustes del Sistema</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Identidad Corporativa & Hosting</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto bg-[#1c2d51] text-white px-12 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 shadow-2xl hover:scale-105 transition-all active:scale-95">
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
          {success ? 'Configuración Guardada' : 'Guardar Ajustes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-72 shrink-0">
          <nav className="flex lg:flex-col gap-3 p-3 bg-slate-100/50 rounded-[3rem] border border-slate-100 shadow-inner">
            <TabLink active={activeTab === 'general'} id="general" label="La Agencia" icon={<Building2 size={18}/>} />
            <TabLink active={activeTab === 'branding'} id="branding" label="Marca y Colores" icon={<Brush size={18}/>} />
            <TabLink active={activeTab === 'website'} id="website" label="Sitio Web" icon={<Globe size={18}/>} />
            <TabLink active={activeTab === 'seo'} id="seo" label="SEO & Analytics" icon={<Search size={18}/>} />
            <TabLink active={activeTab === 'billing'} id="billing" label="Facturación" icon={<CreditCard size={18}/>} />
          </nav>
        </aside>

        <div className="flex-1 bg-white p-10 md:p-14 rounded-[4rem] border border-slate-100 shadow-sm min-h-[650px] relative overflow-hidden">
          {activeTab === 'general' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="flex items-center gap-5 border-b border-slate-50 pb-8">
                 <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-[1.5rem] flex items-center justify-center shadow-inner"><Building2 size={28}/></div>
                 <div><h3 className="text-xl font-black text-[#1c2d51] uppercase tracking-tighter">Ficha de la Empresa</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Datos oficiales y comerciales</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2"><label className="admin-label-sober">Nombre Comercial</label><input className="admin-input-sober" value={localTenant.nome} onChange={e => setLocalTenant({...localTenant, nome: e.target.value})} /></div>
                <div className="space-y-2"><label className="admin-label-sober">Email de Contacto</label><input className="admin-input-sober" value={localTenant.email} onChange={e => setLocalTenant({...localTenant, email: e.target.value})} /></div>
                <div className="space-y-2"><label className="admin-label-sober">Teléfono Central</label><input className="admin-input-sober" value={localTenant.telefone || ''} onChange={e => setLocalTenant({...localTenant, telefone: e.target.value})} /></div>
                <div className="space-y-2"><label className="admin-label-sober">CIF / NIF</label><input className="admin-input-sober" value={localTenant.nif || ''} onChange={e => setLocalTenant({...localTenant, nif: e.target.value})} /></div>
                <div className="md:col-span-2 space-y-2"><label className="admin-label-sober">Dirección Fiscal / Sede</label><input className="admin-input-sober" value={localTenant.morada || ''} onChange={e => setLocalTenant({...localTenant, morada: e.target.value})} /></div>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="flex items-center gap-5 border-b border-slate-50 pb-8">
                 <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-[1.5rem] flex items-center justify-center shadow-inner"><Brush size={28}/></div>
                 <div><h3 className="text-xl font-black text-[#1c2d51] uppercase tracking-tighter">Identidad Visual</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Colores y logotipo de marca</p></div>
              </div>
              <div className="grid md:grid-cols-2 gap-16">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="admin-label-sober">Color Primario (Header/Footer)</label>
                    <div className="flex items-center gap-5 bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 shadow-inner">
                      <input type="color" className="w-12 h-12 border-none bg-transparent cursor-pointer rounded-xl shadow-lg" value={localTenant.cor_primaria} onChange={e => setLocalTenant({...localTenant, cor_primaria: e.target.value})} />
                      <span className="font-mono font-black text-xs uppercase tracking-widest">{localTenant.cor_primaria}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="admin-label-sober">Color Secundario (Botones/Links)</label>
                    <div className="flex items-center gap-5 bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 shadow-inner">
                      <input type="color" className="w-12 h-12 border-none bg-transparent cursor-pointer rounded-xl shadow-lg" value={localTenant.cor_secundaria} onChange={e => setLocalTenant({...localTenant, cor_secundaria: e.target.value})} />
                      <span className="font-mono font-black text-xs uppercase tracking-widest">{localTenant.cor_secundaria}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="admin-label-sober">Logotipo Oficial</label>
                  <div onClick={() => logoInputRef.current?.click()} className="aspect-video bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-blue-300 p-10 overflow-hidden group transition-all shadow-inner">
                    {localTenant.logo_url ? <img src={localTenant.logo_url} className="h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform" alt="Logo" /> : <Camera className="text-slate-300" size={48} />}
                    <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'website' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="flex items-center gap-5 border-b border-slate-50 pb-8">
                 <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-[1.5rem] flex items-center justify-center shadow-inner"><Globe size={28}/></div>
                 <div><h3 className="text-xl font-black text-[#1c2d51] uppercase tracking-tighter">Dominios y Alojamiento</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestione su dirección web</p></div>
              </div>
              
              {isBusiness && (
                <div className="bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100 space-y-10 shadow-inner">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="text-center md:text-left"><h4 className="font-black text-[#1c2d51] uppercase text-sm tracking-widest flex items-center gap-3 justify-center md:justify-start">Dominio Personalizado <Zap size={18} className="text-amber-500 fill-current"/></h4><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Vincule su propia marca (ej: www.su-agencia.es)</p></div>
                      {localTenant.domain_status && (<span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-3 border shadow-sm ${localTenant.domain_status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{localTenant.domain_status === 'active' ? <ShieldCheck size={14}/> : <RefreshCw size={14} className="animate-spin"/>} {localTenant.domain_status}</span>)}
                   </div>
                   <div className="flex flex-col md:flex-row gap-4"><input className="flex-1 admin-input-sober !bg-white" placeholder="ej: www.suinmobiliaria.es" value={localTenant.custom_domain || ''} onChange={e => setLocalTenant({...localTenant, custom_domain: e.target.value.toLowerCase().trim()})} /><button onClick={handleVerifyDomain} disabled={verifying || !localTenant.custom_domain} className="bg-[#1c2d51] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95">{verifying ? <Loader2 size={16} className="animate-spin" /> : "Verificar DNS"}</button></div>
                   
                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-md space-y-6">
                      <div className="flex justify-between items-center"><p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Instrucciones DNS</p><button className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-2 hover:underline"><Copy size={14}/> Copiar Registros</button></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[8px] font-black text-slate-400 uppercase mb-3 tracking-widest">Registro A (Host @)</p><div className="flex justify-between font-mono text-xs font-bold text-[#1c2d51]"><span>@</span><span>{DNS_RECORDS.A_ROOT}</span></div></div>
                         <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[8px] font-black text-slate-400 uppercase mb-3 tracking-widest">Registro CNAME (www)</p><div className="flex justify-between font-mono text-xs font-bold text-[#1c2d51] truncate"><span>www</span><span className="ml-4">{DNS_RECORDS.CNAME_WWW}</span></div></div>
                      </div>
                      <p className="text-[9px] text-slate-400 italic text-center font-bold tracking-widest uppercase">La propagación DNS puede tardar hasta 24 horas.</p>
                   </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex items-center gap-5 border-b border-slate-50 pb-8">
                   <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-[1.5rem] flex items-center justify-center shadow-inner"><BarChart3 size={28}/></div>
                   <div><h3 className="text-xl font-black text-[#1c2d51] uppercase tracking-tighter">Posicionamiento Web</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">SEO y Analítica de Tráfico</p></div>
                </div>
                <div className="grid grid-cols-1 gap-10">
                   <div className="space-y-2"><label className="admin-label-sober">Meta Title (Homepage)</label><input className="admin-input-sober" value={localTenant.seo_settings?.meta_title || ''} onChange={e => setLocalTenant({...localTenant, seo_settings: {...(localTenant.seo_settings || {}), meta_title: e.target.value}})} placeholder="Ej: Las mejores casas de Madrid | Agencia X" /></div>
                   <div className="space-y-2"><label className="admin-label-sober">Google Analytics Measurement ID</label><input className="admin-input-sober" value={localTenant.seo_settings?.google_analytics_id || ''} onChange={e => setLocalTenant({...localTenant, seo_settings: {...(localTenant.seo_settings || {}), google_analytics_id: e.target.value}})} placeholder="G-XXXXXXXXXX" /></div>
                </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .admin-label-sober { display: block; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #94a3b8; margin-left: 0.75rem; margin-bottom: 0.75rem; letter-spacing: 0.2em; }
        .admin-input-sober { width: 100%; padding: 1.25rem 1.6rem; background: #f8fafc; border: 2px solid #f1f5f9; border-radius: 1.5rem; outline: none; font-weight: 700; color: #1c2d51; transition: all 0.3s; font-size: 0.95rem; }
        .admin-input-sober:focus { background: #fff; border-color: #3b82f6; }
      `}</style>
    </div>
  );
};

const TabLink = ({ active, id, label, icon }: { active: boolean, id: string, label: string, icon: any }) => (
  <Link to={`/admin/settings?tab=${id}`} className={`flex items-center gap-5 px-8 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${active ? 'bg-white text-[#1c2d51] shadow-2xl border border-slate-100 scale-105' : 'text-slate-400 hover:bg-white/50 hover:text-[#1c2d51]'}`}>
    <span className={active ? 'text-blue-500' : 'text-slate-300'}>{icon}</span> {label}
  </Link>
);

export default AdminSettings;
