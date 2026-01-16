
import React from 'react';
import { Scale, ArrowLeft, ExternalLink, ShieldCheck, Building2, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const RAL_ENTITIES = [
  { name: "Junta Arbitral de Consumo de la Comunidad de Madrid", url: "https://www.comunidad.madrid/servicios/consumo/arbitraje-consumo" },
  { name: "Junta Arbitral de Consumo de Cataluña", url: "http://consum.gencat.cat" },
  { name: "Junta Arbitral de Consumo de Andalucía", url: "https://www.consumoresponde.es" },
  { name: "Junta Arbitral de Consumo de la Comunidad Valenciana", url: "https://cindi.gva.es" },
  { name: "Centro de Arbitraje de Consumo de las Islas Baleares", url: "http://consum.caib.es" },
  { name: "Sistema Arbitral de Consumo del País Vasco (Kontsumobide)", url: "https://www.kontsumobide.euskadi.eus" },
  { name: "Junta Arbitral de Consumo de Galicia", url: "https://consumo.xunta.gal" },
  { name: "Ministerio de Consumo - Junta Arbitral Nacional", url: "https://www.consumo.gob.es" }
];

const RAL: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24 font-brand selection:bg-[#1c2d51] selection:text-white">
      <SEO title="Resolución Alternativa de Litigios" description="Entidades de Resolución Alternativa de Litigios de consumo en España." />
      <div className="max-w-6xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest hover:text-[#1c2d51] transition-all mb-12">
          <ArrowLeft size={16} /> Volver al Inicio
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="w-16 h-16 bg-blue-50 text-[#357fb2] rounded-3xl flex items-center justify-center mb-8">
              <Scale size={32} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#1c2d51] tracking-tighter leading-tight mb-6 uppercase">
              Resolución Alternativa <br/><span className="text-[#357fb2]">de Litigios</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              En caso de litigio, el consumidor puede recurrir a una Entidad de Resolución Alternativa de Litigios (RAL) de consumo. A continuación enumeramos las principales entidades regionales y nacionales en España.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex items-center gap-4">
            <ShieldCheck size={40} className="text-emerald-500" />
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Protección del Consumidor</p>
              <p className="text-sm font-bold text-[#1c2d51]">Ley 7/2017</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RAL_ENTITIES.map((entity, index) => (
            <a 
              key={index} 
              href={entity.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1c2d51] group-hover:text-white transition-colors">
                  <Building2 size={20} />
                </div>
                <h3 className="font-black text-[#1c2d51] leading-tight mb-4 group-hover:text-[#357fb2] transition-colors">{entity.name}</h3>
              </div>
              <div className="pt-6 border-t border-slate-50 mt-6 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-500 transition-colors">Acceder al Sitio Web</span>
                <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-500" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-20 p-12 bg-[#1c2d51] rounded-[3rem] text-white relative overflow-hidden text-center">
          <Gavel className="absolute -left-10 -bottom-10 text-white/5 w-64 h-64 rotate-12" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tight">Más Información</h2>
            <p className="text-lg opacity-70 mb-10 max-w-xl mx-auto">Para más detalles sobre las entidades y derechos del consumidor, consulte el Portal oficial de Consumo de su Comunidad Autónoma o del Ministerio.</p>
            <a 
              href="https://www.consumo.gob.es/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-[#1c2d51] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all"
            >
              Portal del Consumidor <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAL;
