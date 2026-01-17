
import React, { useState, useEffect, useCallback } from 'react';
import { PropertyService } from '../../services/propertyService';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { Imovel, TipoImovel, ImovelMedia } from '../../types';
import { Link } from 'react-router-dom';
import { 
  Plus, X, Loader2, Sparkles, Check, ChevronRight, ChevronLeft, 
  Trash, UploadCloud, Building2, Star, MapPin, Edit3, Trash2, Camera, Info, Globe, 
  FileText, Bed, Bath, Square, Home, Shield, Euro, LayoutList, Zap, Lock, Eye, Calendar,
  Tag, Wind, Sun, Coffee, Car, Search
} from 'lucide-react';
import { formatCurrency, generateSlug, compressImage } from '../../lib/utils';
import { generatePropertyDescription } from '../../services/geminiService';

const DISTRICTS_DATA: Record<string, string[]> = {
  "Madrid": ["Madrid", "Alcalá de Henares", "Móstoles", "Fuenlabrada", "Leganés", "Getafe", "Alcorcón", "Torrejón de Ardoz", "Parla", "Alcobendas"],
  "Barcelona": ["Barcelona", "Hospitalet de Llobregat", "Badalona", "Terrassa", "Sabadell", "Mataró", "Santa Coloma de Gramenet", "Cornellà de Llobregat", "Sant Boi de Llobregat", "Sant Cugat del Vallès"],
  "Valencia": ["Valencia", "Gandia", "Torrent", "Sagunt", "Paterna", "Alzira", "Mislata", "Burjassot", "Ontinyent", "Aldaia"],
  "Sevilla": ["Sevilla", "Dos Hermanas", "Alcalá de Guadaíra", "Utrera", "Mairena del Aljarafe", "Écija", "La Rinconada", "Los Palacios y Villafranca"],
  "Málaga": ["Málaga", "Marbella", "Mijas", "Fuengirola", "Vélez-Málaga", "Torremolinos", "Estepona", "Benalmádena"],
  "Alicante": ["Alicante", "Elche", "Torrevieja", "Orihuela", "Benidorm", "Alcoy", "Elda", "San Vicente del Raspeig"],
  "Baleares": ["Palma de Mallorca", "Ibiza", "Mahón", "Manacor", "Inca", "Ciutadella", "Santa Eulària des Riu"],
  "Islas Canarias": ["Las Palmas de Gran Canaria", "Santa Cruz de Tenerife", "San Cristóbal de La Laguna", "Telde", "Arona", "Granadilla de Abona"],
  "Vizcaya": ["Bilbao", "Barakaldo", "Getxo", "Portugalete", "Santurtzi", "Basauri", "Leioa", "Galdakao"],
  "Zaragoza": ["Zaragoza", "Calatayud", "Utebo", "Ejea de los Caballeros", "Tarazona", "Caspe", "Cuarte de Huerva"]
};

const PHOTO_TAGS = ["Dormitorio", "Cocina", "Salón", "Comedor", "Baño", "Balcón", "Terraza", "Exterior", "Vistas", "Garaje", "Jardín", "Plano", "Otro"];

const DivBox = ({ label, val, icon, onInc, onDec }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-all">
     <div className="text-blue-500">{icon}</div>
     <p className="text-[9px] font-black uppercase text-slate-400 leading-tight tracking-widest">{label}</p>
     <div className="flex items-center gap-4">
        <button onClick={onDec} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center font-black text-[#1c2d51] hover:bg-slate-100">-</button>
        <span className="font-black text-xl text-[#1c2d51] min-w-[1.5rem]">{val}</span>
        <button onClick={onInc} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center font-black text-[#1c2d51] hover:bg-slate-100">+</button>
     </div>
  </div>
);

const AdminImoveis: React.FC = () => {
  const { profile } = useAuth();
  const { tenant } = useTenant();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingImovel, setEditingImovel] = useState<Partial<Imovel> | null>(null);
  const [mediaItems, setMediaItems] = useState<ImovelMedia[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isBusiness = tenant.subscription?.plan_id === 'business' || profile?.email === 'snapimoveis@gmail.com';
  const propertyLimit = isBusiness ? 9999 : 50;
  const reachedLimit = imoveis.length >= propertyLimit;

  const loadProperties = useCallback(async () => {
    if (!profile?.tenantId || profile.tenantId === 'pending') return;
    setLoading(true);
    try {
      const data = await PropertyService.getProperties(profile.tenantId);
      setImoveis(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [profile?.tenantId]);

  useEffect(() => { loadProperties(); }, [loadProperties]);

  const openModal = async (imovel: Imovel | null) => {
    if (!imovel && reachedLimit) return;
    setCurrentStep(1);
    if (imovel) {
      setEditingImovel({ ...imovel });
      const media = await PropertyService.getPropertyMedia(profile!.tenantId, imovel.id);
      setMediaItems(media);
    } else {
      setEditingImovel({
        titulo: '',
        ref: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
        tipo_imovel: 'apartamento',
        operacao: 'venda',
        tipologia: 'T2',
        estado_conservacao: 'usado',
        ano_construcao: new Date().getFullYear(),
        publicacao: { estado: 'rascunho', publicar_no_site: true, destaque: false, badges: [], data_publicacao: new Date() },
        localizacao: { pais: 'España', distrito: 'Madrid', concelho: 'Madrid', freguesia: '', codigo_postal: '', morada: '', porta: '', lat: null, lng: null, expor_morada: false },
        financeiro: { preco_venda: 0, preco_arrendamento: null, negociavel: true, comissao_incluida: true, condominio_mensal: null, imi_anual: null, caucao_meses: null, despesas_incluidas: [] },
        divisoes: { quartos: 2, casas_banho: 1, garagem: { tem: false, lugares: 0 }, varanda: false, arrecadacao: false, piscina: false, jardim: false },
        areas: { area_util_m2: 0, area_bruta_m2: null, area_terreno_m2: null, pisos: 1, andar: null, elevador: false },
        certificacao: { certificado_energetico: 'A', licenca_util_numero: '', licenca_util_data: '', isento_licenca: false, estado_licenca: 'sim' },
        descricao: { curta: '', completa_md: '', gerada_por_ia: false, ultima_geracao_ia_at: null },
        caracteristicas: []
      });
      setMediaItems([]);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!profile?.tenantId || !editingImovel) return;
    setIsSaving(true);
    try {
      if (editingImovel.id) {
        await PropertyService.updateProperty(profile.tenantId, editingImovel.id, editingImovel, mediaItems);
      } else {
        const slug = generateSlug(editingImovel.titulo || '');
        await PropertyService.createProperty(profile.tenantId, { ...editingImovel, slug, owner_uid: profile.id }, mediaItems);
      }
      setIsModalOpen(false);
      loadProperties();
    } catch (err) { console.error(err); alert("Error al guardar inmueble."); } finally { setIsSaving(false); }
  };

  const handleGenerateAI = async () => {
    if (!editingImovel) return;
    setIsGenerating(true);
    try {
      const desc = await generatePropertyDescription(editingImovel);
      setEditingImovel(prev => ({
        ...prev!,
        descricao: {
          ...(prev?.descricao || { gerada_por_ia: false, ultima_geracao_ia_at: null }),
          curta: desc.curta,
          completa_md: desc.completa,
          gerada_por_ia: true,
          ultima_geracao_ia_at: new Date()
        }
      }));
    } catch (err) { console.error(err); alert("Error al generar descripción con IA."); } finally { setIsGenerating(false); }
  };

  const processFiles = async (files: FileList) => {
    const newMedia: ImovelMedia[] = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const promise = new Promise<void>((resolve) => {
        reader.onloadend = async () => {
          const compressed = await compressImage(reader.result as string, 1200, 1200, 0.7);
          newMedia.push({
            id: crypto.randomUUID(),
            type: 'image',
            url: compressed,
            storage_path: '',
            order: mediaItems.length + newMedia.length,
            is_cover: mediaItems.length === 0 && newMedia.length === 0,
            alt: editingImovel?.titulo || 'Imagen del inmueble',
            tag: 'Otro',
            created_at: new Date()
          });
          resolve();
        };
        reader.readAsDataURL(files[i]);
      });
      await promise;
    }
    setMediaItems(prev => [...prev, ...newMedia]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFiles(e.target.files);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 10));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const filteredImoveis = imoveis.filter(i => i.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || i.ref.toLowerCase().includes(searchQuery.toLowerCase()));

  const getInputDateValue = (dateVal: any) => {
    if (!dateVal) return '';
    try {
      let d: Date;
      if (dateVal && typeof dateVal === 'object' && 'seconds' in dateVal) d = new Date(dateVal.seconds * 1000);
      else d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch (e) { return ''; }
  };

  return (
    <div className="space-y-8 font-brand animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1c2d51] tracking-tighter">Cartera de Inmuebles</h1>
          <div className="flex items-center gap-2 mt-1">
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest tracking-[0.2em]">Gestión de Activos</p>
             {!isBusiness && (
               <div className="bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1.5 ml-2">
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="bg-[#1c2d51] h-full" style={{ width: `${(imoveis.length / propertyLimit) * 100}%` }}></div></div>
                  <span className="text-[8px] font-black text-[#1c2d51]">{imoveis.length} / {propertyLimit}</span>
               </div>
             )}
          </div>
        </div>
        
        {reachedLimit ? (
          <Link to="/planos" className="bg-amber-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
            <Zap size={18} fill="currentColor"/> Upgrade Plan
          </Link>
        ) : (
          <button onClick={() => openModal(null)} className="bg-[#1c2d51] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:-translate-y-1 transition-all">
            <Plus size={18}/> Nuevo Inmueble
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
         <div className="flex-1 px-4 py-2 bg-slate-50 rounded-xl flex items-center gap-3">
            {/* Fix: Added missing Search icon import */}
            <Search className="text-slate-300" size={18} />
            <input placeholder="Buscar por título o referencia..." className="bg-transparent outline-none w-full font-bold text-sm text-[#1c2d51]" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
             <Loader2 className="animate-spin text-[#1c2d51]" size={32} />
             <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Sincronizando inventario...</p>
          </div>
        ) : filteredImoveis.length === 0 ? (
          <div className="col-span-full bg-white p-20 rounded-[3rem] text-center border border-dashed border-slate-200">
             <Building2 className="mx-auto text-slate-200 mb-4" size={48} />
             <p className="font-black text-slate-300 uppercase text-xs tracking-widest">Sin inmuebles registrados.</p>
          </div>
        ) : (
          filteredImoveis.map(imovel => (
            <div key={imovel.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500">
              <div className="relative h-52 overflow-hidden">
                 <img src={imovel.media?.cover_url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={imovel.titulo} />
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[8px] font-black uppercase text-[#1c2d51]">{imovel.ref}</div>
                 <div className="absolute bottom-4 right-4 flex gap-2">
                    <button onClick={() => openModal(imovel)} className="p-2.5 bg-white rounded-xl text-[#1c2d51] shadow-lg hover:scale-110 transition-all"><Edit3 size={16}/></button>
                    <button onClick={() => { if(window.confirm("¿Confirmar eliminación?")) PropertyService.deleteProperty(profile!.tenantId, imovel.id).then(loadProperties) }} className="p-2.5 bg-white rounded-xl text-red-500 shadow-lg hover:scale-110 transition-all"><Trash2 size={16}/></button>
                 </div>
              </div>
              <div className="p-6">
                 <h4 className="font-black text-[#1c2d51] line-clamp-1 text-lg">{imovel.titulo}</h4>
                 <p className="text-[9px] font-black uppercase text-slate-400 mt-1 flex items-center gap-1.5"><MapPin size={10} className="text-blue-500"/> {imovel.localizacao.concelho}, {imovel.localizacao.distrito}</p>
                 <div className="flex items-center justify-between pt-5 border-t border-slate-50 mt-5">
                    <span className="font-black text-[#1c2d51] text-lg">{formatCurrency((imovel.operacao === 'venda' ? imovel.financeiro?.preco_venda : imovel.financeiro?.preco_arrendamento) || 0)}</span>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${imovel.publicacao?.publicar_no_site ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                       {imovel.publicacao?.publicar_no_site ? 'Online' : 'Privado'}
                    </span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && editingImovel && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl h-[92vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-[#1c2d51] shadow-inner"><Building2 size={28}/></div>
                <div>
                   <h3 className="text-2xl font-black text-[#1c2d51] tracking-tighter uppercase">{editingImovel.id ? 'Editar Ficha' : 'Nueva Ficha de Inmueble'}</h3>
                   <div className="flex gap-1.5 mt-2">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className={`h-1.5 w-7 rounded-full transition-all duration-500 ${currentStep > i ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-100'}`}></div>
                      ))}
                   </div>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={32}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
               {currentStep === 1 && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-3"><Info size={20} className="text-blue-500"/><h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Paso 01: Identificación Principal</h4></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2"><label className="admin-label">Referencia Interna</label><input className="admin-input-v3" value={editingImovel.ref || ''} onChange={e => setEditingImovel({...editingImovel, ref: e.target.value})} /></div>
                       <div className="space-y-2"><label className="admin-label">Título Comercial del Anuncio</label><input className="admin-input-v3" value={editingImovel.titulo || ''} onChange={e => setEditingImovel({...editingImovel, titulo: e.target.value})} placeholder="Ej: Ático de Lujo con Terraza en Salamanca" /></div>
                       <div className="space-y-2">
                          <label className="admin-label">Tipo de Inmueble</label>
                          <select className="admin-input-v3" value={editingImovel.tipo_imovel} onChange={e => setEditingImovel({...editingImovel, tipo_imovel: e.target.value as TipoImovel})}>
                             <option value="apartamento">Piso / Apartamento</option>
                             <option value="moradia">Chalet / Casa</option>
                             <option value="casa_rustica">Casa de Campo / Rústica</option>
                             <option value="escritorio">Oficina</option>
                             <option value="comercial">Local Comercial</option>
                             <option value="terreno">Terreno / Parcela</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="admin-label">Tipología</label>
                          <select className="admin-input-v3" value={editingImovel.tipologia} onChange={e => setEditingImovel({...editingImovel, tipologia: e.target.value})}>
                             {['T0','T1','T2','T3','T4','T5+'].map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="admin-label">Estado de Conservación</label>
                          <select className="admin-input-v3" value={editingImovel.estado_conservacao} onChange={e => setEditingImovel({...editingImovel, estado_conservacao: e.target.value as any})}>
                             <option value="novo">A Estrenar</option>
                             <option value="usado">Buen Estado (Usado)</option>
                             <option value="renovado">Reformado</option>
                             <option value="para_renovar">A Reformar</option>
                          </select>
                       </div>
                       <div className="space-y-2"><label className="admin-label">Año de Construcción</label><input type="number" className="admin-input-v3" value={editingImovel.ano_construcao || ''} onChange={e => setEditingImovel({...editingImovel, ano_construcao: parseInt(e.target.value) || null})} /></div>
                    </div>
                 </div>
               )}

               {currentStep === 2 && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-3"><Zap size={20} className="text-blue-500"/><h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Paso 02: Modalidad de Operación</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="admin-label">Tipo de Operación</label>
                          <select className="admin-input-v3" value={editingImovel.operacao} onChange={e => setEditingImovel({...editingImovel, operacao: e.target.value as any})}>
                             <option value="venda">Venta</option>
                             <option value="arrendamento">Alquiler</option>
                          </select>
                       </div>
                       {editingImovel.operacao === 'arrendamento' && (
                         <>
                           <div className="space-y-2">
                              <label className="admin-label">Tipo de Alquiler</label>
                              <select className="admin-input-v3" value={editingImovel.arrendamento_tipo || 'residencial'} onChange={e => setEditingImovel({...editingImovel, arrendamento_tipo: e.target.value as any})}>
                                 <option value="residencial">Vivienda Habitual</option>
                                 <option value="temporario">Temporal (Trabajo/Estudios)</option>
                                 <option value="ferias">Vacacional</option>
                              </select>
                           </div>
                         </>
                       )}
                       <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="font-black text-[#1c2d51] uppercase text-xs tracking-widest">Disponibilidad</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">¿El inmueble está listo para entrar?</p>
                          </div>
                          <label className="flex items-center gap-3 cursor-pointer">
                             <input type="checkbox" className="w-7 h-7 rounded-xl border-slate-200 text-blue-500 focus:ring-0" checked={editingImovel.disponivel_imediato} onChange={e => setEditingImovel({...editingImovel, disponivel_imediato: e.target.checked})} />
                             <span className="text-xs font-black uppercase text-slate-600">Sí, Inmediata</span>
                          </label>
                       </div>
                    </div>
                 </div>
               )}

               {currentStep === 3 && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-3"><MapPin size={20} className="text-blue-500"/><h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Paso 03: Ubicación y Dirección</h4></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="admin-label">Provincia</label>
                          <select className="admin-input-v3" value={editingImovel.localizacao?.distrito} onChange={e => setEditingImovel({...editingImovel, localizacao: {...editingImovel.localizacao!, distrito: e.target.value, concelho: DISTRICTS_DATA[e.target.value]?.[0] || ''}})}>
                             {Object.keys(DISTRICTS_DATA).sort().map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="admin-label">Municipio</label>
                          <select className="admin-input-v3" value={editingImovel.localizacao?.concelho} onChange={e => setEditingImovel({...editingImovel, localizacao: {...editingImovel.localizacao!, concelho: e.target.value}})}>
                             {(DISTRICTS_DATA[editingImovel.localizacao?.distrito || 'Madrid'] || []).sort().map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2"><label className="admin-label">Barrio / Zona</label><input className="admin-input-v3" value={editingImovel.localizacao?.freguesia || ''} onChange={e => setEditingImovel({...editingImovel, localizacao: {...editingImovel.localizacao!, freguesia: e.target.value}})} placeholder="Ej: Barrio de Salamanca" /></div>
                       <div className="space-y-2"><label className="admin-label">Código Postal</label><input className="admin-input-v3" value={editingImovel.localizacao?.codigo_postal || ''} onChange={e => setEditingImovel({...editingImovel, localizacao: {...editingImovel.localizacao!, codigo_postal: e.target.value}})} placeholder="28001" /></div>
                       <div className="md:col-span-2 space-y-2"><label className="admin-label">Dirección Completa (Privada)</label><input className="admin-input-v3" value={editingImovel.localizacao?.morada || ''} onChange={e => setEditingImovel({...editingImovel, localizacao: {...editingImovel.localizacao!, morada: e.target.value}})} placeholder="Calle, Número, Piso..." /></div>
                       <div className="md:col-span-2 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase text-blue-700 tracking-widest">Mostrar dirección pública en el sitio web</p>
                          <label className="relative inline-flex items-center cursor-pointer">
                             <input type="checkbox" className="sr-only peer" checked={editingImovel.localizacao?.expor_morada} onChange={e => setEditingImovel({...editingImovel, localizacao: {...editingImovel.localizacao!, expor_morada: e.target.checked}})} />
                             <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                       </div>
                    </div>
                 </div>
               )}

               {currentStep === 4 && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-3"><Square size={20} className="text-blue-500"/><h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Paso 04: Áreas y Planta</h4></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <div className="space-y-2"><label className="admin-label">Área Útil (m²)</label><input type="number" className="admin-input-v3" value={editingImovel.areas?.area_util_m2 || ''} onChange={e => setEditingImovel({...editingImovel, areas: {...editingImovel.areas!, area_util_m2: parseFloat(e.target.value)}})} /></div>
                       <div className="space-y-2"><label className="admin-label">Área Bruta (m²)</label><input type="number" className="admin-input-v3" value={editingImovel.areas?.area_bruta_m2 || ''} onChange={e => setEditingImovel({...editingImovel, areas: {...editingImovel.areas!, area_bruta_m2: parseFloat(e.target.value)}})} /></div>
                       <div className="space-y-2"><label className="admin-label">Área Parcela (m²)</label><input type="number" className="admin-input-v3" value={editingImovel.areas?.area_terreno_m2 || ''} onChange={e => setEditingImovel({...editingImovel, areas: {...editingImovel.areas!, area_terreno_m2: parseFloat(e.target.value)}})} /></div>
                       <div className="space-y-2"><label className="admin-label">Nº de Plantas</label><input type="number" className="admin-input-v3" value={editingImovel.areas?.pisos || ''} onChange={e => setEditingImovel({...editingImovel, areas: {...editingImovel.areas!, pisos: parseInt(e.target.value)}})} /></div>
                       <div className="space-y-2"><label className="admin-label">Planta (Nº)</label><input className="admin-input-v3" value={editingImovel.areas?.andar || ''} onChange={e => setEditingImovel({...editingImovel, areas: {...editingImovel.areas!, andar: e.target.value}})} placeholder="Ej: 3º Izq" /></div>
                       <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ascensor</p>
                          <label className="flex items-center gap-3 cursor-pointer">
                             <input type="checkbox" className="w-7 h-7 rounded-xl border-slate-200 text-blue-500" checked={editingImovel.areas?.elevador} onChange={e => setEditingImovel({...editingImovel, areas: {...editingImovel.areas!, elevador: e.target.checked}})} />
                          </label>
                       </div>
                    </div>
                 </div>
               )}

               {currentStep === 5 && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-3"><Home size={20} className="text-blue-500"/><h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Paso 05: Características y Divisiones</h4></div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                       <DivBox label="Habitaciones" val={editingImovel.divisoes?.quartos || 0} icon={<Bed size={20}/>} onInc={() => setEditingImovel({...editingImovel, divisoes: {...editingImovel.divisoes!, quartos: (editingImovel.divisoes?.quartos || 0) + 1}})} onDec={() => setEditingImovel({...editingImovel, divisoes: {...editingImovel.divisoes!, quartos: Math.max(0, (editingImovel.divisoes?.quartos || 0) - 1)}})} />
                       <DivBox label="Baños" val={editingImovel.divisoes?.casas_banho || 0} icon={<Bath size={20}/>} onInc={() => setEditingImovel({...editingImovel, divisoes: {...editingImovel.divisoes!, casas_banho: (editingImovel.divisoes?.casas_banho || 0) + 1}})} onDec={() => setEditingImovel({...editingImovel, divisoes: {...editingImovel.divisoes!, casas_banho: Math.max(0, (editingImovel.divisoes?.casas_banho || 0) - 1)}})} />
                       <DivBox label="Plazas Garaje" val={editingImovel.divisoes?.garagem?.lugares || 0} icon={<Car size={20}/>} onInc={() => setEditingImovel({...editingImovel, divisoes: {...editingImovel.divisoes!, garagem: { tem: true, lugares: (editingImovel.divisoes?.garagem?.lugares || 0) + 1 }}})} onDec={() => setEditingImovel({...editingImovel, divisoes: {...editingImovel.divisoes!, garagem: { tem: (editingImovel.divisoes?.garagem?.lugares || 0) > 1, lugares: Math.max(0, (editingImovel.divisoes?.garagem?.lugares || 0) - 1) }}})} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="admin-label">Estructuras</label>
                          <div className="grid grid-cols-2 gap-3">
                             {['Balcón / Terraza', 'Trastero', 'Piscina', 'Jardín'].map(item => {
                               const keyMap: any = { 'Balcón / Terraza': 'varanda', 'Trastero': 'arrecadacao', 'Piscina': 'piscina', 'Jardín': 'jardim' };
                               const key = keyMap[item];
                               return (
                                 <button key={item} onClick={() => setEditingImovel({...editingImovel, divisoes: {...editingImovel.divisoes!, [key]: !editingImovel.divisoes?.[key as keyof typeof editingImovel.divisoes]}})} className={`p-4 rounded-2xl border text-[10px] font-black uppercase transition-all ${(editingImovel.divisoes as any)?.[key] ? 'border-[#1c2d51] bg-[#1c2d51] text-white shadow-lg' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}>
                                    {item}
                                 </button>
                               );
                             })}
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="admin-label">Extras y Equipamiento</label>
                          <div className="grid grid-cols-2 gap-3">
                             {['Aire acondicionado', 'Calefacción central', 'Paneles solares', 'Chimenea', 'Cocina equipada', 'Amueblado', 'Vistas al mar', 'Vistas a la montaña'].map(feat => (
                               <button key={feat} onClick={() => {
                                  const current = editingImovel.caracteristicas || [];
                                  const next = current.includes(feat) ? current.filter(c => c !== feat) : [...current, feat];
                                  setEditingImovel({...editingImovel, caracteristicas: next});
                               }} className={`p-4 rounded-2xl border text-[10px] font-black uppercase transition-all ${editingImovel.caracteristicas?.includes(feat) ? 'border-blue-500 bg-blue-500 text-white shadow-lg' : 'border-slate-100 bg-white text-slate-400 hover:border-blue-100'}`}>
                                  {feat}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {currentStep === 6 && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-3"><Shield size={20} className="text-blue-500"/><h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Paso 06: Certificación y Legalidad</h4></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="admin-label">Certificado Energético</label>
                          <select className="admin-input-v3" value={editingImovel.certificacao?.certificado_energetico} onChange={e => setEditingImovel({...editingImovel, certificacao: {...editingImovel.certificacao!, certificado_energetico: e.target.value}})}>
                             {['A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F', 'G', 'Exento', 'En Trámite'].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="admin-label">Cédula de Habitabilidad / Licencia</label>
                          <select className="admin-input-v3" value={editingImovel.certificacao?.estado_licenca || 'sim'} onChange={e => setEditingImovel({...editingImovel, certificacao: {...editingImovel.certificacao!, estado_licenca: e.target.value as any}})}>
                             <option value="sim">Disponible</option>
                             <option value="processo">En Trámite</option>
                             <option value="isento">Exento</option>
                          </select>
                       </div>
                       <div className="space-y-2"><label className="admin-label">IBI Estimado (Anual €)</label><input type="number" className="admin-input-v3" value={editingImovel.financeiro?.imi_anual || ''} onChange={e => setEditingImovel({...editingImovel, financeiro: {...editingImovel.financeiro!, imi_anual: parseFloat(e.target.value)}})} /></div>
                       <div className="space-y-2"><label className="admin-label">Comunidad (Mensual €)</label><input type="number" className="admin-input-v3" value={editingImovel.financeiro?.condominio_mensal || ''} onChange={e => setEditingImovel({...editingImovel, financeiro: {...editingImovel.financeiro!, condominio_mensal: parseFloat(e.target.value)}})} /></div>
                    </div>
                 </div>
               )}

               {currentStep === 7 && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-3"><Euro size={20} className="text-blue-500"/><h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Paso 07: Valores y Condiciones</h4></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="admin-label">Precio de {editingImovel.operacao === 'venda' ? 'Venta' : 'Alquiler'} (€)</label>
                          <input type="number" className="admin-input-v3 !text-2xl !font-black !text-blue-600" value={(editingImovel.operacao === 'venda' ? editingImovel.financeiro?.preco_venda : editingImovel.financeiro?.preco_arrendamento) || ''} 
                            onChange={e => setEditingImovel({...editingImovel, financeiro: {...editingImovel.financeiro!, preco_venda: editingImovel.operacao === 'venda' ? parseFloat(e.target.value) : null, preco_arrendamento: editingImovel.operacao === 'arrendamento' ? parseFloat(e.target.value) : null}})} 
                          />
                       </div>
                       <div className="space-y-4 pt-8">
                          <label className="flex items-center gap-3 cursor-pointer p-4 bg-white rounded-2xl border border-slate-100">
                             <input type="checkbox" className="w-6 h-6 rounded-lg border-slate-200 text-[#1c2d51]" checked={editingImovel.financeiro?.negociavel} onChange={e => setEditingImovel({...editingImovel, financeiro: {...editingImovel.financeiro!, negociavel: e.target.checked}})} />
                             <span className="text-xs font-black uppercase text-slate-600">Precio Negociable</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer p-4 bg-white rounded-2xl border border-slate-100">
                             <input type="checkbox" className="w-6 h-6 rounded-lg border-slate-200 text-[#1c2d51]" checked={editingImovel.financeiro?.comissao_incluida} onChange={e => setEditingImovel({...editingImovel, financeiro: {...editingImovel.financeiro!, comissao_incluida: e.target.checked}})} />
                             <span className="text-xs font-black uppercase text-slate-600">Comisión Incluida</span>
                          </label>
                       </div>
                       {editingImovel.operacao === 'arrendamento' && (
                         <>
                           <div className="space-y-2"><label className="admin-label">Fianza (Meses o €)</label><input type="number" className="admin-input-v3" value={editingImovel.financeiro?.caucao_meses || ''} onChange={e => setEditingImovel({...editingImovel, financeiro: {...editingImovel.financeiro!, caucao_meses: parseFloat(e.target.value)}})} /></div>
                           <div className="space-y-4"><label className="admin-label">Suministros Incluidos</label><div className="flex flex-wrap gap-2">{['Agua', 'Luz', 'Gas', 'Internet'].map(d => (<button key={d} onClick={() => { const current = editingImovel.financeiro?.despesas_incluidas || []; const next = current.includes(d) ? current.filter(x => x !== d) : [...current, d]; setEditingImovel({...editingImovel, financeiro: {...editingImovel.financeiro!, despesas_incluidas: next}}); }} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase border transition-all ${editingImovel.financeiro?.despesas_incluidas?.includes(d) ? 'border-blue-500 bg-blue-500 text-white shadow-lg' : 'border-slate-100 bg-white text-slate-400'}`}>{d}</button>))}</div></div>
                         </>
                       )}
                    </div>
                 </div>
               )}

               {currentStep === 8 && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="flex justify-between items-center"><div className="flex items-center gap-3"><FileText size={20} className="text-blue-500"/><h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Paso 08: Descripción Creativa</h4></div>
                       <button onClick={handleGenerateAI} disabled={isGenerating} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-[1.25rem] text-[10px] font-black uppercase hover:bg-blue-100 disabled:opacity-50 shadow-sm border border-blue-100 transition-all">
                          {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14}/>} {isGenerating ? 'Generando...' : 'Optimizar con IA'}
                       </button>
                    </div>
                    <div className="space-y-8">
                       <div className="space-y-2"><label className="admin-label">Eslogan del Anuncio (Corta)</label><input className="admin-input-v3" value={editingImovel.descricao?.curta || ''} onChange={e => setEditingImovel({...editingImovel, descricao: {...editingImovel.descricao!, curta: e.target.value}})} placeholder="Una frase potente para el catálogo..." /></div>
                       <div className="space-y-2"><label className="admin-label">Descripción Detallada (Storytelling)</label><textarea rows={12} className="admin-input-v3 !py-6 font-medium leading-relaxed" value={editingImovel.descricao?.completa_md || ''} onChange={e => setEditingImovel({...editingImovel, descricao: {...editingImovel.descricao!, completa_md: e.target.value}})} placeholder="Cuente la historia de este inmueble..." /></div>
                    </div>
                 </div>
               )}

               {currentStep === 9 && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-3"><Camera size={20} className="text-blue-500"/><h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Paso 09: Multimedia y Visual</h4></div>
                    
                    <div className={`h-72 border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center transition-all duration-500 ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[0.99]' : 'border-slate-100 bg-slate-50/50'}`} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) processFiles(e.dataTransfer.files); }}>
                       <UploadCloud size={64} className="text-slate-200 mb-4" />
                       <p className="text-sm font-black text-[#1c2d51] uppercase tracking-widest">Arrastra tus fotos profesionales</p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 mb-8 tracking-widest">Formatos: JPG, PNG • Máx 10MB por archivo</p>
                       <label className="bg-[#1c2d51] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:scale-105 transition-all shadow-xl">Explorar Archivos<input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} /></label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                       {mediaItems.map((item, idx) => (
                         <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-lg">
                            <div className="relative aspect-square overflow-hidden bg-slate-50">
                               <img src={item.url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={item.alt} />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                  <button onClick={() => setMediaItems(prev => prev.map((m, i) => ({...m, is_cover: i === idx})))} className={`p-3 rounded-xl transition-all ${item.is_cover ? 'bg-amber-400 text-white' : 'bg-white text-slate-400 hover:text-amber-400'}`}><Star size={18} fill={item.is_cover ? 'currentColor' : 'none'} /></button>
                                  <button onClick={() => setMediaItems(prev => prev.filter((_, i) => i !== idx))} className="p-3 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform shadow-lg"><Trash2 size={18} /></button>
                               </div>
                               {item.is_cover && <div className="absolute top-4 left-4 bg-amber-400 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase shadow-lg">Portada</div>}
                            </div>
                            <div className="p-4 border-t border-slate-50">
                               <select value={item.tag || 'Otro'} onChange={(e) => setMediaItems(prev => prev.map((m, i) => i === idx ? { ...m, tag: e.target.value } : m))} className="w-full bg-slate-50 text-[9px] font-black uppercase py-3 px-4 rounded-[1rem] border-none focus:ring-1 focus:ring-blue-500 outline-none text-[#1c2d51] appearance-none">
                                  {PHOTO_TAGS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                               </select>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               {currentStep === 10 && (
                 <div className="space-y-10 animate-in slide-in-from-right-4">
                    <div className="flex items-center gap-3"><Globe size={20} className="text-blue-500"/><h4 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Paso 10: Publicación y Visibilidad</h4></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                          <div className="space-y-2">
                             <label className="admin-label">Estado de Comercialización</label>
                             <select className="admin-input-v3" value={editingImovel.publicacao?.estado} onChange={e => setEditingImovel({...editingImovel, publicacao: {...editingImovel.publicacao!, estado: e.target.value as any}})}>
                                <option value="rascunho">Borrador (Privado)</option>
                                <option value="publicado">Disponible (Público)</option>
                                <option value="reservado">Reservado</option>
                                <option value="vendido">Vendido / Alquilado</option>
                             </select>
                          </div>
                          <div className="space-y-5">
                             <label className="flex items-center gap-4 cursor-pointer p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-colors hover:bg-white">
                                <input type="checkbox" className="w-7 h-7 rounded-xl border-slate-200 text-blue-500" checked={editingImovel.publicacao?.destaque} onChange={e => setEditingImovel({...editingImovel, publicacao: {...editingImovel.publicacao!, destaque: e.target.checked}})} />
                                <div className="flex flex-col"><span className="text-xs font-black uppercase text-[#1c2d51]">Inmueble Destacado</span><span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Aparecerá en la página principal</span></div>
                             </label>
                             <label className="flex items-center gap-4 cursor-pointer p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-colors hover:bg-white">
                                <input type="checkbox" className="w-7 h-7 rounded-xl border-slate-200 text-emerald-500" checked={editingImovel.publicacao?.publicar_no_site} onChange={e => setEditingImovel({...editingImovel, publicacao: {...editingImovel.publicacao!, publicar_no_site: e.target.checked}})} />
                                <div className="flex flex-col"><span className="text-xs font-black uppercase text-[#1c2d51]">Publicar Online</span><span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Visible en el portal de la agencia</span></div>
                             </label>
                          </div>
                       </div>
                       <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                          <div className="space-y-2">
                             <label className="admin-label">Fecha de Publicación</label>
                             <div className="relative">
                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                <input type="date" className="admin-input-v3 !pl-14" value={getInputDateValue(editingImovel.publicacao?.data_publicacao)} onChange={e => setEditingImovel({...editingImovel, publicacao: {...editingImovel.publicacao!, data_publicacao: e.target.value ? new Date(e.target.value) : null}})} />
                             </div>
                          </div>
                          <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
                             <Info className="text-blue-500 shrink-0 mt-1" size={24} />
                             <div className="space-y-1">
                                <p className="text-[10px] text-blue-700 font-black uppercase tracking-widest">Consejo de Experto</p>
                                <p className="text-[10px] text-blue-600/80 font-bold leading-relaxed uppercase">Para obtener los mejores resultados, asegúrese de que el inmueble tenga al menos 5 fotos de alta calidad antes de publicarlo.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-10 border-t bg-slate-50 flex justify-between items-center shrink-0">
               <button onClick={prevStep} disabled={currentStep === 1} className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-[#1c2d51] disabled:opacity-30 flex items-center gap-2">
                  <ChevronLeft size={20}/> Anterior
               </button>
               <div className="flex gap-4">
                  {currentStep < 10 ? (
                    <button onClick={nextStep} className="bg-[#1c2d51] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
                       Continuar <ChevronRight size={20}/>
                    </button>
                  ) : (
                    <button onClick={handleSave} disabled={isSaving} className="bg-emerald-500 text-white px-16 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 shadow-2xl hover:scale-105 transition-all disabled:opacity-50">
                       {isSaving ? <Loader2 className="animate-spin" /> : <><Check size={24} strokeWidth={3}/> Finalizar y Guardar</>}
                    </button>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-label { display: block; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #94a3b8; margin-left: 0.75rem; margin-bottom: 0.75rem; letter-spacing: 0.2em; }
        .admin-input-v3 { width: 100%; padding: 1.25rem 1.6rem; background: #fff; border: 2px solid #f1f5f9; border-radius: 1.75rem; outline: none; font-weight: 700; color: #1c2d51; transition: all 0.3s; font-size: 0.95rem; }
        .admin-input-v3:focus { border-color: #3b82f6; box-shadow: 0 10px 25px -10px rgba(59,130,246,0.15); }
        .admin-input-v3::placeholder { color: #cbd5e1; font-weight: 500; }
      `}</style>
    </div>
  );
};

export default AdminImoveis;
