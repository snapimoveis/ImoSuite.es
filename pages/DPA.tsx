
import React from 'react';
import { 
  FileText, ArrowLeft, Mail, Phone, Scale, Building2, 
  CheckCircle2, Globe, ShieldCheck, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DPA: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 font-brand selection:bg-[#1c2d51] selection:text-white">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/privacidade" className="inline-flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-[#1c2d51] transition-all mb-12">
          <ArrowLeft size={16} /> Volver a la Política de Privacidad
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-50 text-[#357fb2] rounded-2xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1c2d51] tracking-tighter uppercase leading-tight">
            CLÁUSULA DE DATA PROCESSING AGREEMENT (DPA) <br/>
            <span className="text-[#357fb2]">Imosuite – SaaS White-Label</span>
          </h1>
        </div>

        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12 border-b border-slate-100 pb-8">
          Imosuite – SaaS White-Label • Moderno e Peculiar Unip. Lda
        </p>

        <div className="prose prose-slate max-w-none space-y-12">
          
          <section className="space-y-6">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">01.</span> Partes
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium m-0">El presente Acuerdo de Tratamiento de Datos (“DPA”) se celebra entre:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h3 className="text-xs font-black uppercase text-[#357fb2] mb-4">Responsable del Tratamento (Data Controller):</h3>
                <p className="text-sm font-bold text-[#1c2d51] m-0">Cliente de la plataforma Imosuite (empresa que utiliza la solución en régimen de marca blanca)</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h3 className="text-xs font-black uppercase text-[#357fb2] mb-4">Encargado del Tratamiento (Data Processor):</h3>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#1c2d51] m-0">Moderno e Peculiar Unip. Lda</p>
                  <p className="text-xs font-medium text-slate-500 m-0">NIF: 515017170</p>
                  <p className="text-xs font-medium text-slate-500 m-0">Email: datos@imosuite.pt</p>
                  <p className="text-xs font-medium text-slate-500 m-0">Teléfono: +351 918 152 116</p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">02.</span> Objeto
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium m-0">
              El presente DPA regula el tratamiento de datos personales efectuado por Imosuite, como Encargado del Tratamiento, por cuenta y siguiendo instrucciones del Responsable del Tratamiento, en los términos del Reglamento (UE) 2016/679 (RGPD) y la LOPDGDD española.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">03.</span> Naturaleza y Finalidad del Tratamiento
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium m-0">El tratamiento de datos personales se destina exclusivamente a:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0">
              {[
                "Disponibilización y funcionamiento de la plataforma SaaS",
                "Gestión de usuarios, inmuebles, leads y clientes",
                "Almacenamiento, consulta y procesamiento de datos",
                "Soporte técnico y mantenimiento",
                "Seguridad y prevención de fraude"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <CheckCircle2 size={16} className="text-[#357fb2]" />
                  <span className="text-xs font-bold text-slate-700">{text}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">04.</span> Tipos de Datos y Categorías de Interesados
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Tipos de datos:</p>
                <div className="flex flex-wrap gap-2">
                  {["Nombre, email, teléfono", "Datos profesionales y comerciales", "Datos de autenticación", "Datos de facturación", "Dirección IP y logs técnicos"].map((t, i) => (
                    <span key={i} className="px-4 py-2 bg-blue-50 text-[#357fb2] text-[10px] font-black uppercase rounded-lg border border-blue-100">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Categorías de interesados:</p>
                <div className="flex flex-wrap gap-2">
                  {["Usuarios de la plataforma", "Clientes finales del Responsable", "Colaboradores y socios"].map((t, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 text-[#1c2d51] text-[10px] font-black uppercase rounded-lg border border-slate-100">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">05.</span> Obligaciones del Encargado (Imosuite)
            </h2>
            <div className="bg-[#1c2d51] p-10 rounded-[3rem] text-white space-y-4">
              <p className="text-sm font-bold opacity-80 m-0">Imosuite se compromete a:</p>
              <ul className="space-y-3 list-none p-0">
                {[
                  "Tratar datos solo mediante instrucciones documentadas del Cliente",
                  "Garantizar la confidencialidad de los datos",
                  "Implementar medidas técnicas y organizativas adecuadas",
                  "Auxiliar al Cliente en el ejercicio de los derechos de los interesados",
                  "Notificar al Cliente sin demora en caso de violación de datos",
                  "Eliminar o devolver los datos al término del contrato, salvo obligación legal"
                ].map((t, i) => (
                  <li key={i} className="flex gap-4 items-start text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#357fb2] mt-2 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">06.</span> Obligaciones del Responsable
            </h2>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4">
              <p className="text-sm font-bold text-slate-700 m-0">El Cliente se compromete a:</p>
              <ul className="space-y-3 list-none p-0">
                {[
                  "Garantizar la base legal para el tratamiento de los datos",
                  "Informar a los interesados sobre el tratamiento",
                  "Obtener consentimientos cuando sea aplicable",
                  "Utilizar la plataforma de forma conforme al RGPD"
                ].map((t, i) => (
                  <li key={i} className="flex gap-3 items-center text-sm font-medium text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="pt-12 text-center">
            <ShieldCheck className="mx-auto text-slate-200 mb-6" size={48}/>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-lg mx-auto m-0">
              Imosuite • Software desarrollado por Moderno e Peculiar Unip. Lda
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DPA;
