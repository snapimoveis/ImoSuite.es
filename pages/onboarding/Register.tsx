
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from '../../lib/firebase';
import { useTenant } from '../../contexts/TenantContext';
import { Building2, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { generateUniqueSlug } from '../../lib/utils';
import SEO from '../../components/SEO';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setTenant } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    agencyName: '',
    email: '',
    password: '',
  });

  const [legalConsent, setLegalConsent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalConsent) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const uniqueSlug = await generateUniqueSlug(formData.agencyName);
      
      // 1. Crear usuario en Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: formData.agencyName });

      // 2. Definir IDs
      const tenantId = `tnt_${user.uid.slice(0, 12)}`;
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      // 3. Crear documento de la inmobiliaria (Tenant)
      const tenantData = {
        id: tenantId,
        nome: formData.agencyName,
        slug: uniqueSlug,
        email: formData.email,
        ativo: true,
        cor_primaria: "#1c2d51",
        cor_secundaria: "#357fb2",
        template_id: "heritage",
        subscription: {
          status: 'trialing',
          plan_id: 'starter',
          trial_ends_at: trialEndsAt.toISOString()
        },
        onboarding_completed: false,
        created_at: serverTimestamp()
      };

      await setDoc(doc(db, 'tenants', tenantId), tenantData);

      // 4. Crear documento del usuario con el tenantId (Vínculo Crítico)
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        displayName: formData.agencyName,
        email: formData.email,
        role: 'admin',
        tenantId: tenantId,
        created_at: serverTimestamp()
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);

    } catch (err: any) {
      console.error("Error en registro:", err);
      let msg = "Ocurrió un error al crear la cuenta.";
      if (err.code === 'auth/email-already-in-use') msg = "Este correo ya está registrado.";
      if (err.code === 'auth/weak-password') msg = "La contraseña debe tener al menos 6 caracteres.";
      setError(msg);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-black text-[#1c2d51]">¡Cuenta creada!</h2>
          <p className="text-slate-500 font-medium">Estamos preparando tu panel de control profesional...</p>
          <Loader2 className="animate-spin mx-auto text-slate-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6 font-brand">
      <SEO title="Registro" />
      <div className="max-w-xl w-full bg-white p-10 md:p-16 rounded-[3.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="mx-auto h-16 w-16 bg-[#1c2d51] rounded-2xl flex items-center justify-center text-white mb-4">
            <Building2 size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#1c2d51] tracking-tighter">Empieza Gratis</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Prueba ImoSuite durante 14 días</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100 mb-8 animate-in shake">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleRegister}>
          <div className="space-y-4">
            <input required type="text" placeholder="Nombre de la Inmobiliaria" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-[#1c2d51] focus:bg-white focus:border-[#357fb2]/20 transition-all" value={formData.agencyName} onChange={(e) => setFormData({...formData, agencyName: e.target.value})} />
            <input required type="email" placeholder="Email profesional" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-[#1c2d51] focus:bg-white focus:border-[#357fb2]/20 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input required type="password" placeholder="Contraseña segura" className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-[#1c2d51] focus:bg-white focus:border-[#357fb2]/20 transition-all" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <label className="flex items-start gap-3 cursor-pointer py-2">
            <input type="checkbox" required checked={legalConsent} onChange={e => setLegalConsent(e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-200 text-[#1c2d51]" />
            <span className="text-xs font-medium text-slate-500 leading-tight">Acepto los Términos de Uso y la Política de Privacidad de ImoSuite para el tratamiento de mis datos personales.</span>
          </label>

          <button type="submit" disabled={isLoading} className="w-full bg-[#1c2d51] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50">
            {isLoading ? <Loader2 className="animate-spin" /> : <>Crear Mi Agencia <ArrowRight size={20}/></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
