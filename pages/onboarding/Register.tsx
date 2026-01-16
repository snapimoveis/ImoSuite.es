
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../../lib/firebase';
import { useTenant } from '../../contexts/TenantContext';
import { Building2, ArrowRight, Loader2, AlertCircle, CheckCircle2, Globe, ShieldCheck } from 'lucide-react';
import { generateUniqueSlug } from '../../lib/utils';
import SEO from '../../components/SEO';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setTenant } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ slug: string } | null>(null);

  const [formData, setFormData] = useState({
    agencyName: '',
    email: '',
    password: '',
  });

  const [legalConsent, setLegalConsent] = useState(false);
  const [processorConsent, setProcessorConsent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalConsent || !processorConsent) {
      setError("Debes aceptar las condiciones obligatorias.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const uniqueSlug = await generateUniqueSlug(formData.agencyName);
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: formData.agencyName });

      const tenantId = `tnt_${user.uid.slice(0, 12)}`;
      const now = new Date().toISOString();
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      const tenantDoc = {
        id: tenantId,
        nome: formData.agencyName,
        slug: uniqueSlug,
        owner_uid: user.uid,
        template_id: "heritage", 
        ativo: true,
        cor_primaria: "#1c2d51",
        cor_secundaria: "#357fb2",
        email: formData.email,
        subscription: {
          status: 'trialing',
          plan_id: 'starter',
          trial_ends_at: trialEndsAt.toISOString()
        },
        onboarding_completed: false,
        created_at: now
      };

      await setDoc(doc(db, 'tenants', tenantId), tenantDoc);
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        displayName: formData.agencyName,
        email: formData.email,
        role: 'admin',
        tenantId: tenantId,
        created_at: now
      });

      setTenant(tenantDoc as any);
      setSuccessData({ slug: uniqueSlug });

      setTimeout(() => {
        navigate(`/admin`);
      }, 1500);

    } catch (err: any) {
      console.error("Error en el registro:", err);
      let msg = 'Error al crear la cuenta. Inténtalo de nuevo.';
      if (err.code === 'permission-denied') {
        msg = 'Error de permiso en la base de datos. Verifica las reglas en la consola de Firebase.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Este correo ya está en uso.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'La contraseña debe tener al menos 6 caracteres.';
      }
      setError(msg);
      setIsLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-brand">
        <SEO title="Registro Completado" />
        <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500 border border-slate-100">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={48} strokeWidth={2.5} className="animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-[#1c2d51] tracking-tighter">¡Cuenta Creada!</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Preparando tu cockpit...</p>
          </div>
          <Loader2 className="animate-spin mx-auto text-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-32 pb-20 px-6 font-brand">
      <SEO title="Crea tu Agencia" />
      <div className="max-w-xl w-full bg-white p-12 md:p-16 rounded-[3.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-12">
          <div className="mx-auto h-20 w-20 bg-[#1c2d51] rounded-[2rem] flex items-center justify-center text-white mb-6">
            <Building2 size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#1c2d51] tracking-tighter leading-tight">
            Empieza 14 días gratis. <br/> <span className="text-[#357fb2]">Sin tarjeta.</span>
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-5 rounded-[2rem] flex items-center gap-4 text-sm font-bold border border-red-100 mb-8 animate-in shake">
            <AlertCircle size={20} className="shrink-0" /> {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="space-y-5">
            <input required type="text" placeholder="Nombre de la Inmobiliaria" className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-bold text-[#1c2d51] focus:bg-white focus:border-[#357fb2]/20 transition-all" value={formData.agencyName} onChange={(e) => setFormData({...formData, agencyName: e.target.value})} />
            <input required type="email" placeholder="Email de Gestión" className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-bold text-[#1c2d51] focus:bg-white focus:border-[#357fb2]/20 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input required type="password" placeholder="Contraseña (mín 6)" className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none font-bold text-[#1c2d51] focus:bg-white focus:border-[#357fb2]/20 transition-all" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <div className="space-y-4 py-6 border-y border-slate-50">
             <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required checked={legalConsent} onChange={e => setLegalConsent(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-200 text-[#1c2d51]" />
                <span className="text-[10px] font-medium text-slate-500 leading-normal">Acepto los Términos y Políticas de la plataforma Imosuite.</span>
             </label>
             <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required checked={processorConsent} onChange={e => setProcessorConsent(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-200 text-[#1c2d51]" />
                <span className="text-[10px] font-medium text-slate-500 leading-normal">Autorizo el tratamiento de mis datos de acuerdo con el RGPD.</span>
             </label>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#1c2d51] text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50">
            {isLoading ? <Loader2 className="animate-spin" /> : <>Crear Cuenta <ArrowRight /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
