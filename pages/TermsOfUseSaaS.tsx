import React from 'react';
import { Scale, ShieldCheck, ArrowLeft, Mail, Phone, AlertCircle, Check, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfUseSaaS: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 font-brand selection:bg-[#1c2d51] selection:text-white">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/termos" className="inline-flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-[#1c2d51] transition-all mb-12">
          <ArrowLeft size={16} /> Volver a los Términos Generales
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-50 text-[#357fb2] rounded-2xl flex items-center justify-center">
            <Globe size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1c2d51] tracking-tighter uppercase leading-tight">
            Términos de Uso <br/><span className="text-[#357fb2]">SaaS White-Label</span></h1>
        </div>

        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12 border-b border-slate-100 pb-8">
          ImoSuite – SaaS White-Label • Moderno e Peculiar Unip. Lda
        </p>

        <div className="prose prose-slate max-w-none space-y-12">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">01.</span> Objeto
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Los presentes Términos regulan el acceso y uso de la plataforma ImoSuite, puesta a disposición en modelo SaaS white-label, propiedad de <strong>Moderno e Peculiar Unip. Lda.</strong>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">02.</span> Registro y Cuenta
            </h2>
            <div className="bg-slate-50 p-8 rounded-[2rem] space-y-4 text-slate-600 font-medium">
              <p>El acceso a la plataforma depende del registro efectuado directamente o a través de un cliente white-label. El usuario se compromete a:</p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex gap-3"><Check size={16} className="text-emerald-500 shrink-0 mt-1"/> Mantener los datos correctos y actualizados.</li>
                <li className="flex gap-3"><Check size={16} className="text-emerald-500 shrink-0 mt-1"/> Garantizar la confidencialidad de sus credenciales.</li>
                <li className="flex gap-3"><Check size={16} className="text-emerald-500 shrink-0 mt-1"/> No compartir accesos de forma indebida.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">03.</span> Responsabilidad de los Clientes White-Label
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">Los clientes que utilicen ImoSuite como white-label son íntegramente responsables de:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Los datos introducidos en la plataforma",
                "La relación con sus usuarios finales",
                "La conformidad legal del tratamiento de datos",
                "Los contenidos y comunicaciones realizadas"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#357fb2]"></div>
                  <span className="text-xs font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">04.</span> Uso Permitido
            </h2>
            <div className="p-8 bg-red-50/30 border border-red-100/50 rounded-[2rem] space-y-4 text-slate-600 font-medium">
              <p>Queda expresamente prohibido:</p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex gap-3">Utilizar la plataforma para fines ilícitos.</li>
                <li className="flex gap-3">Introducir malware o código malicioso.</li>
                <li className="flex gap-3">Vioilar derechos de terceros.</li>
                <li className="flex gap-3">Intentar acceder a datos de otros inquilinos (tenants).</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">05.</span> Propiedad Intelectual
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              La plataforma, el código fuente, las funcionalidades y la tecnología son propiedad exclusiva de <strong>Moderno e Peculiar Unip. Lda.</strong> El cliente adquiere solo un derecho de uso no exclusivo, no transferible y limitado a la vigencia del contrato.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">06.</span> Disponibilidad del Servicio
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              ImoSuite realiza esfuerzos para garantizar una alta disponibilidad, pero no garantiza un funcionamiento ininterrumpido. Pueden ocurrir mantenimientos programados, actualizaciones técnicas o interrupciones por motivos ajenos a la empresa.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">07.</span> Limitación de Responsabilidad
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">ImoSuite no se hace responsable de:</p>
            <ul className="list-disc ml-6 space-y-2 text-slate-600 font-medium">
              <li>Contenidos introducidos por los clientes.</li>
              <li>Datos tratados bajo instrucciones del cliente.</li>
              <li>Daños resultantes del uso indebido.</li>
              <li>Pérdidas indirectas o lucro cesante.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">08.</span> Suspensión y Rescisión
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              La empresa podrá suspender o rescindir el acceso en caso de violación de estos Términos, uso abusivo o incumplimiento legal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">09.</span> Cambios en los Términos
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Los Términos pueden ser modificados en cualquier momento. La continuación del uso implica la aceptación de los mismos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">10.</span> Ley Aplicable y Jurisdicción
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Se aplica la legislación española, siendo competentes los juzgados y tribunales que correspondan legalmente.
            </p>
          </section>

          <section className="space-y-6 pt-12 border-t border-slate-100">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">11.</span> Contacto
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1c2d51] shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Soporte SaaS</p>
                  <p className="font-bold text-[#1c2d51]">datos@imosuite.es</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1c2d51] shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Línea Directa</p>
                  <p className="font-bold text-[#1c2d51]">+34 918 152 116</p>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-12 text-center">
            <ShieldCheck className="mx-auto text-slate-200 mb-6" size={48}/>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-lg mx-auto">
              ImoSuite SaaS • Desarrollado por Moderno e Peculiar Unip. Lda
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUseSaaS;