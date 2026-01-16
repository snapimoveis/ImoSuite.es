
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { updateProfile } from 'firebase/auth';
import { db } from '../../lib/firebase';
import { User, Mail, Shield, Lock, Save, Loader2, CheckCircle2, Camera, Smartphone, Globe } from 'lucide-react';
import { compressImage } from '../../lib/utils';
import { StorageService } from '../../services/storageService';

const AdminProfile: React.FC = () => {
  const { profile, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    professionalEmail: '',
    phone: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        email: profile.email || '',
        professionalEmail: profile.professionalEmail || profile.email || '',
        phone: (profile as any).phone || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const compressed = await compressImage(base64String, 400, 400, 0.8);
      setFormData(prev => ({ ...prev, avatar_url: compressed }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setIsSaving(true);
    setSuccess(false);

    try {
      let finalAvatarUrl = formData.avatar_url;

      if (finalAvatarUrl && finalAvatarUrl.startsWith('data:image')) {
        finalAvatarUrl = await StorageService.uploadBase64(`users/${user.uid}/avatar.jpg`, finalAvatarUrl);
      }

      await updateProfile(user, { displayName: formData.displayName });

      const userRef = doc(db, 'users', user.uid);
      const userUpdates: any = {
        id: user.uid,
        email: user.email,
        displayName: formData.displayName,
        professionalEmail: formData.professionalEmail,
        phone: formData.phone,
        avatar_url: finalAvatarUrl,
        role: profile.role || 'admin',
        tenantId: profile.tenantId || 'pending',
        updated_at: serverTimestamp(),
      };
      await setDoc(userRef, userUpdates, { merge: true });

      if (profile.role === 'admin' && profile.tenantId && profile.tenantId !== 'pending') {
        const tenantRef = doc(db, 'tenants', profile.tenantId);
        await setDoc(tenantRef, {
          professional_email: formData.professionalEmail,
          updated_at: serverTimestamp()
        }, { merge: true });
      }

      setFormData(prev => ({ ...prev, avatar_url: finalAvatarUrl }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al guardar los cambios. Verifique los datos e inténtelo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 font-brand animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-[#1c2d51] tracking-tighter">Mi Perfil</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Gestione sus datos personales y la seguridad de acceso</p>
        </div>
        {success && (
          <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest animate-in slide-in-from-top-4">
            <CheckCircle2 size={16} /> Perfil Actualizado
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center flex flex-col items-center">
            <div className="relative group mb-6">
              <div className="w-24 h-24 rounded-[2rem] bg-[#1c2d51] text-white flex items-center justify-center text-3xl font-black shadow-xl overflow-hidden">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  formData.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()
                )}
              </div>
              <input 
                id="avatar_file_input"
                name="avatar_file_input"
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              <button 
                type="button"
                onClick={handleAvatarClick}
                className="absolute -bottom-2 -right-2 bg-white w-10 h-10 rounded-xl shadow-lg border border-slate-50 flex items-center justify-center text-slate-400 hover:text-[#1c2d51] transition-all"
              >
                <Camera size={18} />
              </button>
            </div>
            <h3 className="font-black text-[#1c2d51] text-lg leading-tight mb-1">{formData.displayName || 'Usuario'}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6">{profile?.role === 'admin' ? 'Administrador de la Agencia' : 'Consultor Inmobiliario'}</p>
            
            <div className="w-full pt-6 border-t border-slate-50 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-300">Estado</span>
                <span className="text-emerald-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> En línea</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-300">Miembro desde</span>
                <span className="text-slate-400">Mar 2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center"><User size={24}/></div>
              <div>
                <h3 className="font-black text-[#1c2d51] uppercase text-xs tracking-widest">Datos de Identificación</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cómo será identificado en la plataforma y en los anuncios</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label htmlFor="user_display_name" className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-2">Nombre Completo</label>
                <input 
                  id="user_display_name"
                  name="user_display_name"
                  type="text" 
                  value={formData.displayName} 
                  onChange={e => setFormData({...formData, displayName: e.target.value})} 
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-[#1c2d51] focus:ring-2 focus:ring-[#1c2d51]/10 transition-all" 
                />
              </div>
              <div>
                <label htmlFor="user_professional_email" className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-2 flex items-center gap-2">
                  <Globe size={12}/> Email Profesional (Exhibido en el sitio)
                </label>
                <input 
                  id="user_professional_email"
                  name="user_professional_email"
                  type="email" 
                  value={formData.professionalEmail} 
                  onChange={e => setFormData({...formData, professionalEmail: e.target.value})} 
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-[#1c2d51] focus:ring-2 focus:ring-[#1c2d51]/10 transition-all" 
                  placeholder="email@profesional.com"
                />
              </div>
              <div>
                <label htmlFor="user_phone" className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-2 flex items-center gap-2"><Smartphone size={12}/> Móvil</label>
                <input 
                  id="user_phone"
                  name="user_phone"
                  type="text" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-[#1c2d51] focus:ring-2 focus:ring-[#1c2d51]/10 transition-all" 
                  placeholder="+34 900 000 000"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-[#1c2d51] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
