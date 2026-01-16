import React from 'react';
import { FileText, Scale, ShieldCheck, ArrowLeft, Mail, Phone, AlertCircle, Check, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfUse: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-20 font-brand selection:bg-[#1c2d51] selection:text-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-[#1c2d51] transition-all">
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
          <Link to="/termos-saas" className="inline-flex items-center gap-2 bg-slate-50 text-[#1c2d51] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1c2d51] hover:text-white transition-all shadow-sm border border-slate-100">
            <Globe size={14} /> Términos de Uso - SaaS White-Label
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-50 text-[#357fb2] rounded-2xl flex items-center justify-center">
            <Scale size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1c2d51] tracking-tighter">Términos de Uso</h1>
        </div>

        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12 border-b border-slate-100 pb-8">
          Última Actualización: {new Date().toLocaleDateString('es-ES')} • ImoSuite SaaS
        </p>

        <div className="prose prose-slate max-w-none space-y-12">
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex gap-6 items-start">
             <AlertCircle className="text-[#357fb2] shrink-0" size={24}/>
             <p className="text-sm font-bold text-slate-600 leading-relaxed">
               Al utilizar la plataforma Imosuite, el usuario declara que ha leído, comprendido y acepta íntegramente estos términos. Si no está de acuerdo con cualquier parte de estos términos, no deberá utilizar nuestros servicios.
             </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">01.</span> Objeto
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Los presentes Términos de Uso regulan el acceso y utilización de la plataforma Imosuite, propiedad de <strong>Moderno e Peculiar Unip. Lda</strong>. La plataforma funciona como un ecosistema digital para la gestión inmobiliaria y la creación de portales white-label.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">02.</span> Condiciones de Acceso
            </h2>
            <div className="bg-slate-50 p-8 rounded-[2rem] space-y-4 text-slate-600 font-medium">
              <p>El usuario se compromete expresamente a:</p>
              <ul className="space-y-3 list-none p-0">
                <li className="flex gap-3"><Check size={16} className="text-emerald-500 shrink-0 mt-1"/> Proporcionar información veraz, exacta y actualizada en todos los formularios.</li>
                <li className="flex gap-3"><Check size={16} className="text-emerald-500 shrink-0 mt-1"/> Mantener la estricta confidencialidad de sus credenciales de acceso (email y contraseña).</li>
                <li className="flex gap-3"><Check size={16} className="text-emerald-500 shrink-0 mt-1"/> Utilizar la plataforma exclusivamente para fines legales y profesionales.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">03.</span> Utilización de la Plataforma
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">Queda expresamente prohibido al usuario:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Utilizar la plataforma para fines ilícitos",
                "Intentar acceder a áreas no autorizadas",
                "Introducir código malicioso o virus",
                "Vioilar derechos de propiedad de terceros"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-red-50/30 border border-red-100/50 rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                  <span className="text-xs font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">04.</span> Responsabilidad del Usuario
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              El usuario es el <strong>único responsable</strong> de los datos, imágenes y textos introducidos en la plataforma, incluyendo datos personales de terceros (leads y clientes). Garantiza, al utilizar el servicio, que dispone de la base legal necesaria para el respectivo tratamiento de datos conforme al RGPD y la LOPDGDD española.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">05.</span> Propiedad Intelectual
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Todo el contenido, software, marcas, algoritmos de IA y funcionalidades de Imosuite son propiedad exclusiva de <strong>Moderno e Peculiar Unip. Lda</strong> o de sus licenciadores. El uso de la plataforma otorga solo una licencia de uso limitada y revocable, no transfiriendo ningún derecho de propiedad.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">06.</span> Limitación de Responsabilidad
            </h2>
            <div className="bg-slate-50 p-8 rounded-[2rem] text-slate-600 leading-relaxed font-medium space-y-3 text-sm">
              <p>Imosuite y Moderno e Peculiar Unip. Lda no se responsabilizan de:</p>
              <ul className="space-y-2">
                <li>Interrupciones temporales del servicio por mantenimiento o fallos técnicos externos.</li>
                <li>Pérdidas de negocio derivadas del uso indebido de la plataforma.</li>
                <li>Veracidad o legalidad de los contenidos introducidos por los usuarios finales.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">07.</span> Suspensión o Cancelación
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              La empresa se reserva el derecho de suspender o cancelar el acceso a cuentas que infrinjan estos términos, sin previo aviso, especialmente en casos de fraude o uso abusivo de recursos tecnológicos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">08.</span> Cambios en los Términos
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Estos Términos de Uso pueden ser actualizados periódicamente. La continuación del uso de la plataforma tras la publicación de los cambios constituye la aceptación de los mismos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">09.</span> Ley Aplicable y Jurisdicción
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Los presentes Términos se rigen por la <strong>legislación española</strong> (sin perjuicio de la sede de la empresa proveedora, adaptándose a las normas de comercio electrónico y consumo en España). Para la resolución de cualquier litigio, las partes se someten a la jurisdicción de los juzgados y tribunales competentes conforme a la normativa aplicable.
            </p>
          </section>

          <section className="space-y-6 pt-12 border-t border-slate-100">
            <h2 className="text-xl font-black text-[#1c2d51] uppercase tracking-tight flex items-center gap-3">
              <span className="text-[#357fb2]">10.</span> Contacto
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#1c2d51] shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Soporte y Datos</p>
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
              ImoSuite SaaS • Una solución tecnológica de Moderno e Peculiar Unip. Lda
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;