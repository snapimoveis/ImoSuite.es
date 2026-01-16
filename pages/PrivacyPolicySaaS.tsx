import React from 'react';
import { 
  Shield, Lock, Eye, ArrowLeft, Mail, Phone, Users, 
  Database, Globe, Scale, AlertCircle, Cookie, RefreshCw,
  Building2, CheckCircle2, Target, Share2, Clock, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicySaaS: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 font-brand selection:bg-[#1c2d51] selection:text-white">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/privacidade" className="inline-flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-[#1c2d51] transition-all mb-12">
          <ArrowLeft size={16} /> Volver a la Política General
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-50 text-[#357fb2] rounded-2xl flex items-center justify-center">
            <Globe size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1c2d51] tracking-tighter uppercase leading-tight">
            POLÍTICA DE PRIVACIDAD <br/>
            <span className="text-[#357fb2]">ImoSuite – Plataforma SaaS White-Label</span>
          </h1>
        </div>

        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12 border-b border-slate-100 pb-8">
          Última Actualización: {new Date().toLocaleDateString('es-ES')} • ImoSuite
        </p>

        <div className="prose prose-slate max-w-none space-y-12">
          
          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">01.</span> Identificación del Proveedor de la Plataforma
            </h2>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-slate-600 leading-relaxed font-medium">
              <p className="m-0">La plataforma ImoSuite es un software SaaS white-label, desarrollado y operado por:</p>
              <ul className="mt-6 space-y-2 list-none p-0 text-slate-900">
                <li className="flex items-center gap-3"><Building2 size={16} className="text-slate-400"/> <strong>Empresa:</strong> Moderno e Peculiar Unip. Lda</li>
                <li className="flex items-center gap-3"><Scale size={16} className="text-slate-400"/> <strong>NIF:</strong> 515017170</li>
                <li className="flex items-center gap-3"><Mail size={16} className="text-slate-400"/> <strong>Email de contacto:</strong> <a href="mailto:datos@imosuite.es" className="text-[#357fb2] no-underline">datos@imosuite.es</a></li>
                <li className="flex items-center gap-3"><Phone size={16} className="text-slate-400"/> <strong>Teléfono:</strong> +34 918 152 116</li>
              </ul>
              <p className="mt-6 text-sm font-bold text-[#1c2d51] border-t border-slate-200 pt-4">
                ImoSuite actúa, según los términos del RGPD, mayoritariamente como Encargado del Tratamiento (Data Processor), procesando datos personales por cuenta de sus clientes.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">02.</span> Modelo White-Label y Responsabilidades
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium m-0">
              ImoSuite pone a disposición su plataforma en modelo white-label, permitiendo que sus clientes utilicen el software bajo su propia marca.
            </p>
            <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100/50 space-y-4">
              <p className="font-bold text-[#1c2d51] m-0">En estos casos:</p>
              <ul className="space-y-3 list-none p-0 text-slate-600">
                <li className="flex gap-3"><CheckCircle2 size={16} className="text-[#357fb2] shrink-0 mt-1"/> El cliente es el Responsable del Tratamiento (Data Controller) de los datos introducidos en la plataforma.</li>
                <li className="flex gap-3"><CheckCircle2 size={16} className="text-[#357fb2] shrink-0 mt-1"/> ImoSuite actúa como Encargado del Tratamiento, tratando los datos únicamente de acuerdo con las instrucciones del cliente.</li>
              </ul>
              <p className="text-xs font-bold text-slate-500 m-0 pt-2">
                Cada cliente es responsable de: Garantizar la base legal para la recogida y tratamiento de datos; informar a los interesados; y disponer de su propia Política de Privacidad, cuando sea aplicable.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">03.</span> Datos Personales Tratados
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium m-0">ImoSuite puede tratar, en nombre de sus clientes, los siguientes datos:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {[
                "Datos de identificación (nombre, email, teléfono)",
                "Datos de clientes finales introducidos por los usuarios",
                "Datos de inmuebles, contratos, leads e interacciones",
                "Datos de autenticación y acceso",
                "Datos técnicos (IP, logs, fecha/hora de acceso)",
                "Datos de facturación y suscripción"
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
              <span className="text-[#357fb2]">04.</span> Finalidades del Tratamiento
            </h2>
            <div className="bg-[#1c2d51] p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
              <Target className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 rotate-12" />
              <p className="text-sm font-bold mb-6 opacity-80">Los datos son tratados exclusivamente para:</p>
              <ul className="space-y-4 list-none p-0 relative z-10">
                {[
                  "Prestación y funcionamiento de la plataforma SaaS",
                  "Gestión de cuentas y usuarios",
                  "Prestación de los servicios contratados",
                  "Soporte técnico y seguridad",
                  "Cumplimiento de obligaciones legales"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm font-medium opacity-90">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#357fb2] mt-2 shrink-0"></div>
                    {text}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-xs font-black uppercase tracking-widest text-[#357fb2] relative z-10">ImoSuite no utiliza los datos para fines propios de marketing de los clientes finales.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">05.</span> Base Legal
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium m-0">El tratamiento de datos se basa en:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
               <LegalCard title="Ejecución de Contrato" desc="Con los clientes de la plataforma." />
               <LegalCard title="Obligaciones Legales" desc="Cumplimiento de las normativas vigentes." />
               <LegalCard title="Interés Legítimo" desc="Seguridad y prevención del fraude." />
               <LegalCard title="Consentimiento" desc="Cuando sea aplicable (bajo responsabilidad del cliente)." />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">06.</span> Conservación de los Datos
            </h2>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4 text-slate-600 font-medium text-sm">
              <p className="m-0 font-bold text-[#1c2d51]">Los datos se conservan:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Durante la vigencia del contrato.</li>
                <li>Por el periodo necesario para obligaciones legales.</li>
                <li>Hasta la solicitud de eliminación por parte del cliente, salvo obligación legal en contrario.</li>
              </ul>
              <p className="mt-4 m-0 font-bold text-[#1c2d51]">Tras la finalización del contrato, los datos pueden ser:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Exportados por el cliente.</li>
                <li>Eliminados de forma segura.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">07.</span> Encargados del Tratamiento e Infraestructura
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium m-0">
              ImoSuite puede recurrir a proveedores tecnológicos, concretamente: servicios cloud, servicios de email transaccional, pasarelas de pago y herramientas de monitorización y seguridad. Todos cumplen con el RGPD y garantizan niveles adecuados de protección.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">08.</span> Transferencias Internacionales
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
              <Globe className="text-[#357fb2] shrink-0" size={20} />
              En caso de existir transferencias de datos fuera de la Unión Europea, estas se realizarán únicamente con las garantías adecuadas, como las Cláusulas Contractuales Tipo de la Comisión Europea o Decisiones de adecuación.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">09.</span> Derechos de los Interesados
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium m-0">
              Los interesados pueden ejercer sus derechos ante el Responsable del Tratamiento (cliente). Siempre que sea necesario, ImoSuite prestará apoyo técnico para: acceso, rectificación, supresión, portabilidad, limitación u oposición. Las solicitudes también pueden enviarse a <a href="mailto:datos@imosuite.es" className="text-[#357fb2]">datos@imosuite.es</a>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">10.</span> Seguridad de la Información
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
               {["Control de accesos", "Cifrado", "Aislamiento de datos", "Logs y monitorización", "Backups regulares"].map((dir, i) => (
                 <div key={i} className="p-4 bg-slate-50 rounded-xl text-center border border-slate-100 flex items-center justify-center">
                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight leading-tight">{dir}</span>
                 </div>
               ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">11.</span> Cambios
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium flex items-start gap-4">
              <RefreshCw size={20} className="text-slate-300 shrink-0 mt-1" />
              Esta Política puede ser actualizada en cualquier momento. Se recomienda su consulta periódica.
            </p>
          </section>

          <section className="space-y-6 pt-12 border-t border-slate-100">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3 m-0">
              <span className="text-[#357fb2]">12.</span> Contacto
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1c2d51] shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Soporte de Datos</p>
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
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-lg mx-auto m-0">
              ImoSuite • Software desarrollado por Moderno e Peculiar Unip. Lda
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

export default PrivacyPolicySaaS;