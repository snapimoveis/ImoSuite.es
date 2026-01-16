
import React, { useState, useEffect, useRef } from 'react';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../../lib/firebase';
import { 
  Globe, LayoutGrid, Save, Loader2, 
  ToggleLeft, ToggleRight, Plus, Trash2, Edit3, X, 
  Navigation, Sparkles, Star,
  Facebook, Instagram, Linkedin, MessageCircle, FileText,
  Target, Users, Image as ImageIcon, Camera, Phone, Mail,
  GripVertical, Check, Link2
} from 'lucide-react';
import { DEFAULT_TENANT_CMS } from '../../constants';
import { TenantCMS, MenuItem, CMSPage } from '../../types';
import { generateSlug, compressImage } from '../../lib/utils';
import { StorageService } from '../../services/storageService';

const AdminCMS: React.FC = () => {
  const { tenant, setTenant } = useTenant();
  const { profile } = useAuth();
  const [cms, setCms] = useState<TenantCMS>(tenant.cms || DEFAULT_TENANT_CMS);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'homepage' | 'menus' | 'pages' | 'social'>('homepage');
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
  
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuTarget, setMenuTarget] = useState<'main' | 'footer'>('main');

  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [pageModalTab, setPageModalTab] = useState<'content' | 'mission' | 'team' | 'gallery'>('content');

  const memberPhotoInputRef = useRef<HTMLInputElement>(null);
  const [activeMemberIdx, setActiveMemberIdx] = useState<number | null>(null);

  useEffect(() => {
    if (tenant.cms) {
      setCms(prev => ({
        ...DEFAULT_TENANT_CMS,
        ...tenant.cms,
        homepage_sections: Array.isArray(tenant.cms.homepage_sections) ? tenant.cms.homepage_sections : DEFAULT_TENANT_CMS.homepage_sections,
        pages: Array.isArray(tenant.cms.pages) ? tenant.cms.pages : DEFAULT_TENANT_CMS.pages,
        social: tenant.cms.social || DEFAULT_TENANT_CMS.social,
        menus: {
          main: Array.isArray(tenant.cms.menus?.main) ? tenant.cms.menus.main : DEFAULT_TENANT_CMS.menus.main,
          footer: Array.isArray(tenant.cms.menus?.footer) ? tenant.cms.menus.footer : DEFAULT_TENANT_CMS.menus.footer
        }
      }));
    }
  }, [tenant.cms]);

  const handleSave = async () => {
    if (!profile?.tenantId || profile.tenantId === 'pending') return;
    setIsSaving(true);
    try {
      const tenantId = profile.tenantId;
      const updatedCms = JSON.parse(JSON.stringify(cms)) as TenantCMS;

      for (const page of updatedCms.pages) {
        if (page.equipa) {
          for (const member of page.equipa) {
            if (member.avatar_url?.startsWith('data:image')) {
              const path = `tenants/${tenantId}/cms/pages/${page.id}/team/${member.id}.jpg`;
              member.avatar_url = await StorageService.uploadBase64(path, member.avatar_url);
            }
          }
        }
        if (page.galeria_fotos) {
          for (let i = 0; i < page.galeria_fotos.length; i++) {
            if (page.galeria_fotos[i].startsWith('data:image')) {
              const path = `tenants/${tenantId}/cms/pages/${page.id}/gallery/img_${i}_${Date.now()}.jpg`;
              page.galeria_fotos[i] = await StorageService.uploadBase64(path, page.galeria_fotos[i]);
            }
          }
        }
      }

      const tenantRef = doc(db, 'tenants', tenantId);
      await updateDoc(tenantRef, { cms: updatedCms, updated_at: serverTimestamp() });
      setTenant({ ...tenant, cms: updatedCms });
      setCms(updatedCms);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) { 
      console.error(err);
      alert("Error al guardar: " + err.message); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const handleAddPageToMenu = (page: CMSPage) => {
    const path = page.slug;
    const alreadyExists = cms.menus.main.some(m => m.path === path);
    if (alreadyExists) {
      alert("Esta página ya está en el menú principal.");
      return;
    }
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      label: page.title,
      path: page.slug,
      order: cms.menus.main.length,
      is_external: false
    };
    setCms({ ...cms, menus: { ...cms.menus, main: [...cms.menus.main, newItem] } });
    alert(`"${page.title}" añadida a la lista del menú principal. Haga clic en "Publicar en el Sitio Web" para guardar.`);
  };

  const TabButton = ({ active, onClick, label, icon }: any) => (
    <button onClick={onClick} className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all whitespace-nowrap ${active ? 'bg-white text-[#1c2d51] shadow-lg scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
      {icon} {label}
    </button>
  );

  return (
    <div className="max-w-6xl space-y-10 font-brand animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1c2d51] tracking-tighter uppercase">Editor del Sitio Web</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Gestión de Contenido e Identidad</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="bg-[#1c2d51] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase flex items-center gap-3 shadow-2xl transition-all hover:scale-105">
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16}/>} {success ? 'Cambios Publicados' : 'Publicar en el Sitio Web'}
        </button>
      </div>

      <div className="flex gap-3 p-2 bg-slate-100/50 rounded-[2.5rem] w-fit overflow-x-auto max-w-full backdrop-blur-sm">
        <TabButton active={activeTab === 'homepage'} onClick={() => setActiveTab('homepage')} label="Inicio" icon={<LayoutGrid size={16}/>} />
        <TabButton active={activeTab === 'menus'} onClick={() => setActiveTab('menus')} label="Navegación" icon={<Navigation size={16}/>} />
        <TabButton active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} label="Páginas" icon={<FileText size={16}/>} />
        <TabButton active={activeTab === 'social'} onClick={() => setActiveTab('social')} label="Canales" icon={<Globe size={16}/>} />
      </div>

      <div className="animate-in slide-in-from-bottom-2 duration-500 min-h-[400px]">
          {activeTab === 'homepage' && (
            <div className="space-y-4">
               {cms.homepage_sections.sort((a,b) => a.order - b.order).map((section) => (
                 <div key={section.id} className={`bg-white rounded-[2.5rem] border transition-all overflow-hidden ${section.enabled ? 'border-slate-100 shadow-sm' : 'opacity-60 grayscale border-dashed border-slate-200'}`}>
                    <div className="p-8 flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${section.enabled ? 'bg-slate-50 text-[#1c2d51]' : 'bg-slate-100 text-slate-300'}`}>{section.type === 'hero' ? <Sparkles size={20}/> : section.type === 'featured' ? <Star size={20}/> : <LayoutGrid size={20}/>}</div>
                          <div><h4 className="font-black text-base text-[#1c2d51] uppercase tracking-tight">{section.content.title || `Bloque ${section.type}`}</h4><span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">{section.type}</span></div>
                       </div>
                       <div className="flex items-center gap-4">
                          <button onClick={() => setCms(prev => ({ ...prev, homepage_sections: prev.homepage_sections.map(s => s.id === section.id ? { ...s, enabled: !s.enabled } : s) }))}>{section.enabled ? <ToggleRight className="text-blue-500" size={36}/> : <ToggleLeft className="text-slate-200" size={36}/>}</button>
                          <button onClick={() => setExpandedSectionId(expandedSectionId === section.id ? null : section.id)} className={`p-3 rounded-xl transition-colors ${expandedSectionId === section.id ? 'bg-[#1c2d51] text-white shadow-lg' : 'text-slate-300 hover:text-[#1c2d51]'}`}><Edit3 size={20}/></button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'menus' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
               <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                    <div><h3 className="font-black text-[#1c2d51] text-lg uppercase tracking-tight">Menú Principal</h3><p className="text-[10px] text-slate-400 font-bold uppercase">Navegación superior</p></div>
                    <button onClick={() => { setMenuTarget('main'); setEditingMenuItem({ id: crypto.randomUUID(), label: '', path: '', order: cms.menus.main.length, is_external: false }); setIsMenuModalOpen(true); }} className="p-3 bg-slate-50 rounded-xl text-[#1c2d51] hover:bg-blue-50 transition-colors"><Plus size={20}/></button>
                  </div>
                  <div className="space-y-3">
                    {cms.menus.main.sort((a,b) => a.order - b.order).map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group">
                        <div className="flex items-center gap-4">
                           <GripVertical size={16} className="text-slate-300" />
                           <div><p className="font-black text-xs text-[#1c2d51] uppercase">{item.label}</p><p className="text-[9px] text-slate-400 font-bold tracking-widest">{item.path}</p></div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => { setMenuTarget('main'); setEditingMenuItem(item); setIsMenuModalOpen(true); }} className="p-2 text-slate-400 hover:text-[#1c2d51]"><Edit3 size={16}/></button>
                           <button onClick={() => setCms({...cms, menus: {...cms.menus, main: cms.menus.main.filter(i => i.id !== item.id)}})} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="space-y-6">
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex justify-between items-center">
                 <div><h3 className="font-black text-[#1c2d51] text-lg uppercase tracking-tight">Páginas de Contenido</h3><p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Institucional, Servicios y Guías</p></div>
                 <button onClick={() => { setEditingPage({ id: crypto.randomUUID(), title: '', slug: '', content_md: '', enabled: true, equipa: [], galeria_fotos: [] }); setPageModalTab('content'); setIsPageModalOpen(true); }} className="bg-[#1c2d51] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all hover:scale-105"><Plus size={20}/> Crear Página</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {cms.pages.map(page => (
                   <div key={page.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all">
                      <div>
                        <div className="w-10 h-10 bg-slate-50 text-[#1c2d51] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1c2d51] group-hover:text-white transition-all"><FileText size={18}/></div>
                        <h4 className="font-black text-[#1c2d51] text-base mb-1 uppercase tracking-tight">{page.title}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] truncate">/p/{page.slug}</p>
                      </div>
                      <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-slate-50">
                        <button onClick={() => handleAddPageToMenu(page)} className="w-full flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase hover:bg-blue-100 transition-colors">
                          <Link2 size={12}/> Añadir al Menú Navbar
                        </button>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setEditingPage(page); setPageModalTab('content'); setIsPageModalOpen(true); }} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-[#1c2d51]"><Edit3 size={18}/></button>
                          <button onClick={() => setCms({...cms, pages: cms.pages.filter(p => p.id !== page.id)})} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}
      </div>

      {isPageModalOpen && editingPage && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1c2d51] shadow-sm"><FileText size={24}/></div>
                  <div><h3 className="text-xl font-black text-[#1c2d51] tracking-tight uppercase">Editor de Página</h3><p className="text-[10px] text-slate-400 font-bold uppercase">{editingPage.title || 'Nueva Página'}</p></div>
               </div>
               <button onClick={() => setIsPageModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900"><X size={28}/></button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
               <aside className="w-full md:w-56 bg-slate-50 border-r border-slate-100 p-4 space-y-2">
                  <PageTabBtn active={pageModalTab === 'content'} onClick={() => setPageModalTab('content')} icon={<FileText size={16}/>} label="Contenido" />
                  <PageTabBtn active={pageModalTab === 'mission'} onClick={() => setPageModalTab('mission')} icon={<Target size={16}/>} label="Misión/Visión" />
                  <PageTabBtn active={pageModalTab === 'team'} onClick={() => setPageModalTab('team')} icon={<Users size={16}/>} label="El Equipo" />
                  <PageTabBtn active={pageModalTab === 'gallery'} onClick={() => setPageModalTab('gallery')} icon={<ImageIcon size={16}/>} label="Galería" />
               </aside>

               <div className="flex-1 overflow-y-auto p-10">
                  {pageModalTab === 'content' && (
                    <div className="space-y-8 animate-in fade-in">
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-2"><label className="admin-cms-label">Título de la Página</label><input className="admin-input-cms" value={editingPage.title} onChange={e => setEditingPage({...editingPage, title: e.target.value, slug: editingPage.slug || generateSlug(e.target.value)})} /></div>
                          <div className="space-y-2"><label className="admin-cms-label">Slug URL</label><input className="admin-input-cms" value={editingPage.slug} onChange={e => setEditingPage({...editingPage, slug: generateSlug(e.target.value)})} /></div>
                       </div>
                       <div className="space-y-3"><label className="admin-cms-label">Cuerpo de la Página (Markdown)</label><textarea rows={12} className="admin-input-cms font-medium leading-relaxed" value={editingPage.content_md} onChange={e => setEditingPage({...editingPage, content_md: e.target.value})} placeholder="Escriba el contenido principal aquí..." /></div>
                    </div>
                  )}

                  {pageModalTab === 'mission' && (
                    <div className="space-y-8 animate-in fade-in">
                       <div className="space-y-3"><label className="admin-cms-label">Nuestra Misión</label><textarea rows={3} className="admin-input-cms" value={editingPage.missao || ''} onChange={e => setEditingPage({...editingPage, missao: e.target.value})} placeholder="Defina el propósito de la agencia..." /></div>
                       <div className="space-y-3"><label className="admin-cms-label">Nuestra Visión</label><textarea rows={3} className="admin-input-cms" value={editingPage.visao || ''} onChange={e => setEditingPage({...editingPage, visao: e.target.value})} placeholder="Dónde pretenden llegar..." /></div>
                       <div className="space-y-3"><label className="admin-cms-label">Nuestros Valores (Separados por coma)</label><input className="admin-input-cms" value={editingPage.valores?.join(', ') || ''} onChange={e => setEditingPage({...editingPage, valores: e.target.value.split(',').map(v => v.trim())})} placeholder="Excelencia, Confianza, Proximidad..." /></div>
                    </div>
                  )}

                  {pageModalTab === 'team' && (
                    <div className="space-y-8 animate-in fade-in">
                       <div className="flex justify-between items-center"><h4 className="font-black text-[#1c2d51] uppercase text-xs tracking-widest">Gestión del Equipo Profesional</h4><button onClick={() => setEditingPage({ ...editingPage, equipa: [...(editingPage.equipa || []), { id: crypto.randomUUID(), name: '', role: '', email: '', phone: '', avatar_url: '' }] })} className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-blue-100 transition-colors"><Plus size={16}/> Añadir Miembro</button></div>
                    </div>
                  )}
               </div>
            </div>

            <div className="p-8 border-t bg-slate-50/50 flex justify-end gap-4 shrink-0">
               <button onClick={() => setIsPageModalOpen(false)} className="px-8 py-4 text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:text-slate-900 transition-all">Cancelar</button>
               <button onClick={() => { setCms(prev => ({ ...prev, pages: prev.pages.find(p => p.id === editingPage.id) ? prev.pages.map(p => p.id === editingPage.id ? editingPage : p) : [...prev.pages, editingPage] })); setIsPageModalOpen(false); }} className="bg-[#1c2d51] text-white px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center gap-3 transition-all hover:scale-105"><Check size={20}/> Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-input-cms { width: 100%; padding: 1.15rem 1.4rem; background: #f8fafc; border: 2px solid transparent; border-radius: 1.25rem; outline: none; font-weight: 700; color: #1c2d51; transition: all 0.2s; font-size: 0.9rem; }
        .admin-input-cms:focus { background: #fff; border-color: #357fb2; box-shadow: 0 4px 15px -5px rgba(53, 127, 178, 0.1); }
        .admin-cms-label { display: block; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #94a3b8; margin-left: 0.5rem; margin-bottom: 0.5rem; letter-spacing: 0.2em; }
      `}</style>
    </div>
  );
};

const PageTabBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-white text-[#1c2d51] shadow-lg border border-slate-100 scale-105' : 'text-slate-400 hover:bg-white/50 hover:text-[#1c2d51]'}`}>
    {icon} {label}
  </button>
);

export default AdminCMS;
