
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, Zap, MessageSquare, Building2, TrendingUp, Users, 
  ShieldCheck, Check, Smartphone, ArrowRight, Star 
} from 'lucide-react';
import SEO from '../components/SEO';

const FeaturesPage: React.FC = () => {
  return (
    <div className="bg-white pt-32 pb-20 font-brand">
      <SEO 
        title="Funcionalidades" 
        description="Explore las herramientas que convierten a ImoSuite en el sistema inmobiliario más avanzado: CRM de leads, portales automáticos e Inteligencia Artificial." 
      />
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black mb-6 uppercase tracking-wider">
            <Star size={14} fill="currentColor" /> Potencia Máxima
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#1c2d51] mb-6 tracking-tighter">
            Potencie su operación inmobiliaria.
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            Centralice inmuebles, contactos y procesos comerciales en un único sistema creado específicamente para consultores e inmobiliarias que no tienen tiempo que perder.
          </p>
        </div>

        {/* Group 1: Gestão & Operação */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-slate-100"></div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Gestión & Operación</h2>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Globe />} 
              title="Sitio Web Propio" 
              desc="Tenga un sitio inmobiliario profesional, siempre actualizado con sus inmuebles, listo para generar contactos sin esfuerzo técnico."
            />
            <FeatureCard 
              icon={<Building2 />} 
              title="Gestión de Inmuebles" 
              desc="Cree, edite y publique inmuebles en pocos clics, con control total del estado de cada negocio."
            />
            <FeatureCard 
              icon={<MessageSquare />} 
              title="Gestión de Leads" 
              desc="Todos los contactos organizados en un único panel, con historial completo y seguimiento de cada oportunidad."
            />
            <FeatureCard 
              icon={<Users />} 
              title="Gestión de Equipo" 
              desc="Distribuya leads, defina permisos y siga el desempeño de su equipo comercial en tiempo real."
            />
          </div>
        </div>

        {/* Group 2: Produtividade & Tecnologia */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-slate-100"></div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Productividad & Tecnología</h2>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Zap />} 
              title="IA Generativa" 
              desc="Cree descripciones comerciales profesionales en segundos y publique inmuebles más rápido, sin perder tiempo escribiendo textos."
            />
            <FeatureCard 
              icon={<Check />} 
              title="Marca Blanca" 
              desc="Trabaje con su propia marca, dominio e identidad visual, como si el sistema fuera suyo."
            />
            <FeatureCard 
              icon={<Smartphone />} 
              title="Mobile First" 
              desc="Gestione inmuebles, responda a clientes y siga leads directamente en el móvil, en cualquier lugar."
            />
            <FeatureCard 
              icon={<ShieldCheck />} 
              title="Seguridad de Datos" 
              desc="Los datos de su inmobiliaria quedan totalmente aislados y protegidos, garantizando privacidad absoluta."
            />
          </div>
        </div>

        {/* Final Phrase & CTA */}
        <div className="bg-[#1c2d51] rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#357fb2] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <p className="text-xl md:text-2xl font-black mb-12 opacity-90">
              Todo lo que necesita para gestionar y vender inmuebles, en un único sistema.
            </p>
            <Link to="/planos" className="inline-flex items-center gap-3 bg-white text-[#1c2d51] px-12 py-6 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-all">
              Ver Planes y Precios <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-xl transition-all duration-300">
    <div className="w-14 h-14 bg-white text-[#1c2d51] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-black mb-3 text-[#1c2d51]">{title}</h3>
    <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default FeaturesPage;
