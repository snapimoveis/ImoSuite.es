
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
  GripVertical, Check, Link2, ChevronRight, Eye
} from 'lucide-react';
import { DEFAULT_TENANT_CMS } from '../../constants';
import { TenantCMS, MenuItem, CMSPage, TeamMember } from '../../types';
import { generateSlug, compressImage } from '../../lib/utils';
import { StorageService } from '../../services/storageService';

const AdminCMS: React.FC = () => {
  const { tenant, setTenant } = useTenant();
  const { profile } = useAuth();
  const [cms, setCms] = useState<TenantCMS>(tenant.cms || DEFAULT_TENANT_CMS);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'homepage' | 'menus' | 'pages' | 'social'>('homepage');
  
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
      }

      const tenantRef = doc(db, 'tenants', tenantId);
      await updateDoc(tenantRef, { cms: updatedCms, updated_at: serverTimestamp() });
      setTenant({ ...tenant, cms: updatedCms });
      setCms(updatedCms);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) { console.error(err); alert("Error al guardar: " + err.message); } finally { setIsSaving(false); }
  };

  const handleAddMember = () => {
    if (!editingPage) return;
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: '',
      role: '',
      email: '',
      phone: '',
      avatar_url: ''
    };
    setEditingPage({
      ...editingPage,
      equipa: [...(editingPage.equipa || []), newMember]
    });
  };

  const handleMemberPhotoClick = (idx: number) => {
    setActiveMemberIdx(idx);
    memberPhotoInputRef.current?.click();
  };

  const handleMemberPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && activeMemberIdx !== null && editingPage) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await compressImage(reader.result as string, 400, 500, 0.7);
        const newTeam = [...(editingPage.equipa || [])];
        newTeam[activeMemberIdx].avatar_url = compressed;
        setEditingPage({ ...editingPage, equipa: newTeam });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const TabButton = ({ active, onClick, label, icon }: any) => (
    <button onClick={onClick} className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all whitespace-nowrap ${active ? 'bg-white text-[#1c2d51] shadow-xl scale-105 border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
      {icon} {label}
    </button>
  );

  return (
    <div className="max-w-6xl space-y-10 font-brand animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1c2d51] tracking-tighter uppercase">Gestión de Contenidos</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Sitio Web & Experiencia Digital</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="bg-[#1c2d51] text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase flex items-center gap-3 shadow-2xl transition-all hover:scale-105 active:scale-95">
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18}/>} {success ? 'Publicado Correctamente' : 'Publicar en el Sitio Web'}
        </button>
      </div>

      <div className="flex gap-4 p-2 bg-slate-100/50 rounded-[2.5rem] w-fit overflow-x-auto max-w-full backdrop-blur-sm border border-slate-100 shadow-inner">
        <TabButton active={activeTab === 'homepage'} onClick={() => setActiveTab('homepage')} label="Homepage" icon={<LayoutGrid size={16}/>} />
        <TabButton active={activeTab === 'menus'} onClick={() => setActiveTab('menus')} label="Navegación" icon={<Navigation size={16}/>} />
        <TabButton active={activeTab === 'pages'} onClick={() => setActiveTab('pages')} label="Páginas" icon={<FileText size={16}/>} />
        <TabButton active={activeTab === 'social'} onClick={() => setActiveTab('social')} label="Redes Sociales" icon={<Globe size={16}/>} />
      </div>

      <div className="animate-in slide-in-from-bottom-2 duration-700 min-h-[500px]">
          {activeTab === 'homepage' && (
            <div className="space-y-6">
               {cms.homepage_sections.sort((a,b) => a.order - b.order).map((section) => (
                 <div key={section.id} className={`bg-white rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${section.enabled ? 'border-slate-100 shadow-sm' : 'opacity-60 grayscale border-dashed border-slate-200'}`}>
                    <div className="p-10 flex items-center justify-between">
                       <div className="flex items-center gap-8">
                          <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-inner ${section.enabled ? 'bg-slate-50 text-[#1c2d51]' : 'bg-slate-100 text-slate-300'}`}>{section.type === 'hero' ? <Sparkles size={24}/> : section.type === 'featured' ? <Star size={24}/> : <LayoutGrid size={24}/>}</div>
                          <div><h4 className="font-black text-lg text-[#1c2d51] uppercase tracking-tighter">{section.content.title || `Bloque de ${section.type}`}</h4><span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 ml-0.5">{section.type}</span></div>
                       </div>
                       <div className="flex items-center gap-6">
                          <button onClick={() => setCms(prev => ({ ...prev, homepage_sections: prev.homepage_sections.map(s => s.id === section.id ? { ...s, enabled: !s.enabled } : s) }))}>{section.enabled ? <ToggleRight className="text-blue-500" size={44}/> : <ToggleLeft className="text-slate-200" size={44}/>}</button>
                          <button className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-[#1c2d51] hover:bg-slate-100 transition-all"><Edit3 size={22}/></button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'menus' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in">
               <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                    <div><h3 className="font-black text-[#1c2d51] text-xl uppercase tracking-tighter">Menú Principal</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Navbar Superior</p></div>
                    <button className="p-4 bg-slate-50 rounded-2xl text-[#1c2d51] hover:bg-blue-50 transition-all shadow-sm"><Plus size={24}/></button>
                  </div>
                  <div className="space-y-4">
                    {cms.menus.main.sort((a,b) => a.order - b.order).map(item => (
                      <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-3xl group transition-all hover:bg-white hover:shadow-md">
                        <div className="flex items-center gap-5"><GripVertical size={18} className="text-slate-300" /><div><p className="font-black text-sm text-[#1c2d51] uppercase tracking-tight">{item.label}</p><p className="text-[9px] text-slate-400 font-bold tracking-[0.2em]">{item.path}</p></div></div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-2.5 text-slate-400 hover:text-blue-500"><Edit3 size={18}/></button><button className="p-2.5 text-slate-400 hover:text-red-500"><Trash2 size={18}/></button></div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="space-y-8">
              <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                 <div><h3 className="font-black text-[#1c2d51] text-2xl uppercase tracking-tighter">Páginas Personalizadas</h3><p className="text-[11px] text-slate-400 font-bold uppercase mt-1 tracking-[0.3em]">Quienes Somos, Servicios, Guías de Compra</p></div>
                 <button onClick={() => { setEditingPage({ id: crypto.randomUUID(), title: '', slug: '', content_md: '', enabled: true, equipa: [], galeria_fotos: [] }); setPageModalTab('content'); setIsPageModalOpen(true); }} className="bg-[#1c2d51] text-white px-12 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-4 shadow-2xl transition-all hover:scale-105 active:scale-95"><Plus size={24}/> Crear Nueva Página</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {cms.pages.map(page => (
                   <div key={page.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all duration-500 hover:shadow-xl">
                      <div>
                        <div className="w-14 h-14 bg-slate-50 text-[#1c2d51] rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:bg-[#1c2d51] group-hover:text-white transition-all shadow-inner"><FileText size={28}/></div>
                        <h4 className="font-black text-[#1c2d51] text-xl mb-1 uppercase tracking-tighter leading-tight">{page.title}</h4>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] truncate">URL: /p/{page.slug}</p>
                      </div>
                      <div className="flex flex-col gap-4 mt-10 pt-8 border-t border-slate-50">
                        <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all"><Link2 size={16}/> Vincular en Navegación</button>
                        <div className="flex justify-end gap-3">
                          <button onClick={() => { setEditingPage(page); setPageModalTab('content'); setIsPageModalOpen(true); }} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Edit3 size={20}/></button>
                          <button onClick={() => { if(window.confirm("¿Eliminar página?")) setCms({...cms, pages: cms.pages.filter(p => p.id !== page.id)}) }} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={20}/></button>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}
      </div>

      {isPageModalOpen && editingPage && (
        <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-5xl h-[88vh] rounded-[4rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-[1.75rem] flex items-center justify-center text-[#1c2d51] shadow-xl border border-slate-100"><FileText size={32}/></div>
                  <div><h3 className="text-2xl font-black text-[#1c2d51] tracking-tighter uppercase leading-none">{editingPage.title || 'Nueva Página'}</h3><p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">Editor Estructural de Contenido</p></div>
               </div>
               <button onClick={() => setIsPageModalOpen(false)} className="p-3 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90 duration-300"><X size={36}/></button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white">
               <aside className="w-full md:w-64 bg-slate-50/80 border-r border-slate-100 p-6 space-y-3">
                  <PageTabBtn active={pageModalTab === 'content'} onClick={() => setPageModalTab('content')} icon={<FileText size={18}/>} label="Contenido" />
                  <PageTabBtn active={pageModalTab === 'mission'} onClick={() => setPageModalTab('mission')} icon={<Target size={18}/>} label="Misión/Visión" />
                  <PageTabBtn active={pageModalTab === 'team'} onClick={() => setPageModalTab('team')} icon={<Users size={18}/>} label="El Equipo" />
                  <PageTabBtn active={pageModalTab === 'gallery'} onClick={() => setPageModalTab('gallery')} icon={<ImageIcon size={18}/>} label="Galería" />
               </aside>

               <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                  {pageModalTab === 'content' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                       <div className="grid grid-cols-2 gap-10">
                          <div className="space-y-2"><label className="admin-cms-label">Título de Página</label><input className="admin-input-cms" value={editingPage.title} onChange={e => setEditingPage({...editingPage, title: e.target.value})} /></div>
                          <div className="space-y-2"><label className="admin-cms-label">Slug / URL Amigable</label><input className="admin-input-cms" value={editingPage.slug} onChange={e => setEditingPage({...editingPage, slug: generateSlug(e.target.value)})} /></div>
                       </div>
                       <div className="space-y-3"><label className="admin-cms-label">Cuerpo del Contenido (Markdown)</label><textarea rows={15} className="admin-input-cms !py-6 font-medium leading-relaxed" value={editingPage.content_md} onChange={e => setEditingPage({...editingPage, content_md: e.target.value})} placeholder="Redacte el contenido institucional aquí..." /></div>
                    </div>
                  )}

                  {pageModalTab === 'mission' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                       <div className="space-y-3"><label className="admin-cms-label">Nuestra Misión</label><textarea rows={4} className="admin-input-cms" value={editingPage.missao || ''} onChange={e => setEditingPage({...editingPage, missao: e.target.value})} placeholder="Defina el propósito fundamental..." /></div>
                       <div className="space-y-3"><label className="admin-cms-label">Nuestra Visión</label><textarea rows={4} className="admin-input-cms" value={editingPage.visao || ''} onChange={e => setEditingPage({...editingPage, visao: e.target.value})} placeholder="A dónde queremos llegar..." /></div>
                       <div className="space-y-3"><label className="admin-cms-label">Valores Corporativos (Separados por coma)</label><input className="admin-input-cms" value={editingPage.valores?.join(', ') || ''} onChange={e => setEditingPage({...editingPage, valores: e.target.value.split(',').map(v => v.trim())})} placeholder="Ej: Transparencia, Innovación, Cercanía" /></div>
                    </div>
                  )}

                  {pageModalTab === 'team' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                       <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                          <h4 className="font-black text-[#1c2d51] uppercase text-sm tracking-widest">Mosaico de Consultores</h4>
                          <button onClick={handleAddMember} className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-100 transition-all shadow-sm"><Plus size={18}/> Añadir Miembro</button>
                       </div>
                       
                       <input type="file" ref={memberPhotoInputRef} onChange={handleMemberPhotoChange} className="hidden" accept="image/*" />
                       
                       <div className="grid grid-cols-1 gap-8">
                         {(editingPage.equipa || []).map((member, idx) => (
                           <div key={member.id} className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 relative group animate-in slide-in-from-bottom-4 transition-all hover:bg-white hover:shadow-xl">
                             <button onClick={() => setEditingPage({ ...editingPage, equipa: editingPage.equipa?.filter((_, i) => i !== idx) })} className="absolute -top-3 -right-3 bg-white text-red-500 p-3 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all border border-red-50 hover:scale-110 active:scale-95"><Trash2 size={20}/></button>

                             <div className="flex flex-col md:flex-row gap-10">
                                <div className="shrink-0 flex flex-col items-center gap-4">
                                   <div onClick={() => handleMemberPhotoClick(idx)} className="w-28 h-28 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all overflow-hidden shadow-inner group/avatar">
                                      {member.avatar_url ? (<img src={member.avatar_url} className="w-full h-full object-cover" alt={member.name} />) : (<Camera size={32} className="text-slate-300 group-hover/avatar:text-blue-400 transition-colors" />)}
                                   </div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Foto Perfil</p>
                                </div>
                                
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <div className="space-y-1"><label className="admin-cms-label">Nombre del Consultor</label><input className="admin-input-cms !py-3" value={member.name} onChange={e => { const newTeam = [...(editingPage.equipa || [])]; newTeam[idx].name = e.target.value; setEditingPage({...editingPage, equipa: newTeam}); }} /></div>
                                   <div className="space-y-1"><label className="admin-cms-label">Cargo / Función</label><input className="admin-input-cms !py-3" value={member.role} onChange={e => { const newTeam = [...(editingPage.equipa || [])]; newTeam[idx].role = e.target.value; setEditingPage({...editingPage, equipa: newTeam}); }} /></div>
                                   <div className="space-y-1"><label className="admin-cms-label">Email Corporativo</label><input className="admin-input-cms !py-3" type="email" value={member.email} onChange={e => { const newTeam = [...(editingPage.equipa || [])]; newTeam[idx].email = e.target.value; setEditingPage({...editingPage, equipa: newTeam}); }} /></div>
                                   <div className="space-y-1"><label className="admin-cms-label">Móvil / WhatsApp</label><input className="admin-input-cms !py-3" value={member.phone} onChange={e => { const newTeam = [...(editingPage.equipa || [])]; newTeam[idx].phone = e.target.value; setEditingPage({...editingPage, equipa: newTeam}); }} /></div>
                                </div>
                             </div>
                           </div>
                         ))}
                         
                         {(editingPage.equipa || []).length === 0 && (
                           <div className="py-24 text-center bg-white rounded-[3.5rem] border border-dashed border-slate-200">
                              <Users size={56} className="mx-auto text-slate-100 mb-6" />
                              <p className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">No hay miembros configurados.</p>
                           </div>
                         )}
                       </div>
                    </div>
                  )}

                  {pageModalTab === 'gallery' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                       <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                          <h4 className="font-black text-[#1c2d51] uppercase text-sm tracking-widest">Álbum de la Página</h4>
                          <button onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.multiple = true; input.accept = 'image/*'; input.onchange = async (e: any) => { const files = e.target.files; if (files) { const newUrls: string[] = []; for (let i = 0; i < files.length; i++) { const reader = new FileReader(); const promise = new Promise<string>((resolve) => { reader.onloadend = () => resolve(reader.result as string); reader.readAsDataURL(files[i]); }); const base64 = await promise; const compressed = await compressImage(base64, 1200, 1200, 0.7); newUrls.push(compressed); } setEditingPage({...editingPage, galeria_fotos: [...(editingPage.galeria_fotos || []), ...newUrls]}); } }; input.click(); }} className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-100 transition-all"><Plus size={18}/> Añadir a Galería</button>
                       </div>
                       
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {(editingPage.galeria_fotos || []).map((url, idx) => (
                             <div key={idx} className="aspect-square bg-slate-50 rounded-[2rem] overflow-hidden relative group border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                                <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Galería" />
                                <button onClick={() => setEditingPage({...editingPage, galeria_fotos: editingPage.galeria_fotos?.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 p-2.5 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"><Trash2 size={16}/></button>
                             </div>
                          ))}
                       </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="p-10 border-t bg-slate-50/80 flex justify-end gap-6 shrink-0">
               <button onClick={() => setIsPageModalOpen(false)} className="px-10 py-5 text-slate-400 font-black text-xs uppercase tracking-[0.3em] hover:text-slate-900 transition-all">Cancelar</button>
               <button onClick={() => { setCms(prev => ({ ...prev, pages: prev.pages.find(p => p.id === editingPage.id) ? prev.pages.map(p => p.id === editingPage.id ? editingPage : p) : [...prev.pages, editingPage] })); setIsPageModalOpen(false); }} className="bg-[#1c2d51] text-white px-16 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95"><Check size={24} strokeWidth={3}/> Guardar Página</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-input-cms { width: 100%; padding: 1.25rem 1.6rem; background: #fff; border: 2px solid #f1f5f9; border-radius: 1.75rem; outline: none; font-weight: 700; color: #1c2d51; transition: all 0.3s; font-size: 0.95rem; }
        .admin-input-cms:focus { border-color: #3b82f6; box-shadow: 0 15px 30px -10px rgba(59,130,246,0.2); }
        .admin-cms-label { display: block; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #94a3b8; margin-left: 0.75rem; margin-bottom: 0.75rem; letter-spacing: 0.25em; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const PageTabBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${active ? 'bg-white text-[#1c2d51] shadow-xl border border-slate-100 scale-105' : 'text-slate-400 hover:bg-white/50 hover:text-[#1c2d51]'}`}>
    <span className={active ? 'text-blue-500' : 'text-slate-300'}>{icon}</span> {label}
  </button>
);

export default AdminCMS;
