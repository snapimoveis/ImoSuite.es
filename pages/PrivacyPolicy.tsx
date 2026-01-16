
import React from 'react';
import { 
  Shield, Lock, ArrowLeft, Mail, Phone, Building2, 
  Database, Globe, Scale, CheckCircle2, Target, Clock, FileText, RefreshCw, Cookie
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 font-brand selection:bg-[#1c2d51] selection:text-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col gap-4 mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-[#1c2d51] transition-all">
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link to="/privacidad-saas" className="inline-flex items-center gap-2 bg-slate-50 text-[#1c2d51] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1c2d51] hover:text-white transition-all shadow-sm border border-slate-100">
              <Globe size={14} /> POLÍTICA DE PRIVACIDAD SaaS
            </Link>
            <Link to="/dpa" className="inline-flex items-center gap-2 bg-slate-50 text-[#1c2d51] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1c2d51] hover:text-white transition-all shadow-sm border border-slate-100">
              <FileText size={14} /> Acuerdo de Tratamiento de Datos (“DPA”)
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-50 text-[#357fb2] rounded-2xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1c2d51] tracking-tighter uppercase">Política de Privacidad</h1>
        </div>

        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12 border-b border-slate-100 pb-8">
          Última Actualización: {new Date().toLocaleDateString('es-ES')} • ImoSuite
        </p>

        <div className="prose prose-slate max-w-none space-y-12">
          
          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">01.</span> Identificación del Responsable
            </h2>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-slate-600 leading-relaxed font-medium">
              <p className="m-0">El presente documento regula el tratamiento de datos personales realizado a través de la plataforma ImoSuite, propiedad de:</p>
              <ul className="mt-6 space-y-2 list-none p-0 text-slate-900">
                <li className="flex items-center gap-3"><Building2 size={16} className="text-slate-400"/> <strong>Empresa:</strong> Moderno e Peculiar Unip. Lda (ImoSuite SaaS)</li>
                <li className="flex items-center gap-3"><Scale size={16} className="text-slate-400"/> <strong>NIF:</strong> 515017170</li>
                <li className="flex items-center gap-3"><Mail size={16} className="text-slate-400"/> <strong>Email:</strong> <a href="mailto:datos@imosuite.es" className="text-[#357fb2] no-underline">datos@imosuite.es</a></li>
              </ul>
              <p className="mt-6 text-sm font-bold text-[#1c2d51] border-t border-slate-200 pt-4">
                Moderno e Peculiar Unip. Lda es la Responsable del Tratamiento de los datos personales, de acuerdo con el Reglamento General de Protección de Datos (RGPD) y la LOPDGDD española.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">02.</span> Datos Personales Recopilados
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium m-0">ImoSuite puede recopilar y tratar los siguientes datos personales:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {[
                "Nombre completo",
                "Dirección de email",
                "Número de teléfono",
                "Datos de identificación fiscal",
                "Datos de autenticación y acceso",
                "Datos de facturación",
                "Dirección IP y datos de navegación",
                "Datos de inmuebles y leads insertados"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">03.</span> Finalidades del Tratamiento
            </h2>
            <div className="bg-[#1c2d51] p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
              <Target className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 rotate-12" />
              <ul className="space-y-4 list-none p-0 relative z-10">
                {[
                  "Creación y gestión de cuenta en la plataforma",
                  "Prestación de los servicios contratados",
                  "Gestión comercial, administrativa y financiera",
                  "Comunicación directa con el usuario",
                  "Cumplimiento de obligaciones legales y fiscales",
                  "Mejora de la experiencia y seguridad"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm font-medium opacity-90">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#357fb2] mt-2 shrink-0"></div>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">04.</span> Fundamento Legal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <LegalCard title="Ejecución de Contrato" desc="Para viabilizar el servicio suscrito." />
               <LegalCard title="Consentimiento" desc="Cuando es expresamente autorizado por el titular." />
               <LegalCard title="Obligaciones Legales" desc="Cumplimiento de normas fiscales y jurídicas." />
               <LegalCard title="Interés Legítimo" desc="Seguridad y mejora continua del software." />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">05.</span> Conservación de los Datos
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
              <Clock className="text-[#357fb2] shrink-0" size={20} />
              Los datos personales se conservarán solo durante el periodo necesario para cumplir las finalidades descritas o mientras exista obligación legal para su mantenimiento.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">06.</span> Compartir con Terceros
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium m-0">Los datos podrán ser compartidos con:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
               <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center space-y-3">
                  <Database className="mx-auto text-blue-500" size={24} />
                  <p className="text-[10px] font-black uppercase text-[#1c2d51]">Servicios Tech</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Cloud, Email, Pagos</p>
               </div>
               <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center space-y-3">
                  <Scale className="mx-auto text-blue-500" size={24} />
                  <p className="text-[10px] font-black uppercase text-[#1c2d51]">Autoridades</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Legales o Fiscales</p>
               </div>
               <div className="p-6 bg-white border border-slate-100 rounded-3xl text-center space-y-3">
                  <Shield size={24} className="mx-auto text-emerald-500" />
                  <p className="text-[10px] font-black uppercase text-[#1c2d51]">Conformidad</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Cumplimiento RGPD</p>
               </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">07.</span> Derechos del Titular
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium m-0">De acuerdo con el RGPD, el titular de los datos tiene derecho a:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
               {["Acceso", "Rectificación", "Supresión", "Limitación", "Portabilidad", "Oposición", "Retirada de Consentimiento"].map((dir, i) => (
                 <div key={i} className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100">
                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight">{dir}</span>
                 </div>
               ))}
            </div>
            <p className="text-xs font-bold text-slate-400 mt-4 italic">Las solicitudes deben enviarse a: <a href="mailto:datos@imosuite.es" className="text-[#357fb2]">datos@imosuite.es</a></p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">08.</span> Seguridad de los Datos
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 flex items-start gap-4">
              <Lock className="text-[#357fb2] shrink-0" size={20} />
              ImoSuite aplica medidas técnicas y organizativas adecuadas para proteger los datos personales contra pérdida, acceso no autorizado, alteración o divulgación indebida.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">09.</span> Cookies
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium bg-amber-50/50 p-6 rounded-2xl border border-amber-100/50 flex items-start gap-4">
              <Cookie className="text-amber-600 shrink-0" size={20} />
              La plataforma puede utilizar cookies estrictamente necesarias para el funcionamiento y cookies analíticas. El usuario puede gestionar sus preferencias a través de la configuración de su navegador.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">10.</span> Alteraciones
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium flex items-start gap-4">
              <RefreshCw size={20} className="text-slate-300 shrink-0 mt-1" />
              La presente Política de Privacidad puede actualizarse en cualquier momento. Se recomienda la consulta periódica de este documento en el sitio web oficial.
            </p>
          </section>

          <section className="pt-12 text-center border-t border-slate-100">
            <Shield className="mx-auto text-slate-200 mb-6" size={48}/>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-lg mx-auto m-0">
              ImoSuite SaaS • Software desarrollado por Moderno e Peculiar Unip. Lda
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

const LegalCard = ({ title, desc }: { title: string, desc: string }) => (
  <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
    <h4 className="text-xs font-black uppercase text-[#1c2d51] mb-2">{title}</h4>
    <p className="text-xs text-slate-500 m-0 leading-relaxed">{desc}</p>
  </div>
);

export default PrivacyPolicy;
