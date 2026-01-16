
import React, { useEffect, useState } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { Search, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import ImovelCard from '../components/ImovelCard';
import { collectionGroup, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Imovel } from '../types';

const Home: React.FC = () => {
  const { tenant } = useTenant();
  const [featuredProperties, setFeaturedProperties] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalFeatured = async () => {
      try {
        // Busca imóveis marcados como destaque em todos os tenants (coleção de grupo)
        const q = query(
          collectionGroup(db, 'properties'), 
          where('publicacao.destaque', '==', true),
          where('publicacao.publicar_no_site', '==', true),
          limit(3)
        );
        const snap = await getDocs(q);
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Imovel));
        setFeaturedProperties(items);
      } catch (err) {
        console.error("Erro ao carregar imóveis reais:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalFeatured();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Encuentre su próximo <span className="text-[#357fb2]">hogar perfecto</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Descubra las mejores oportunidades inmobiliarias gestionadas con ImoSuite.
          </p>
          
          <div className="bg-white p-2 md:p-4 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-lg border border-gray-100">
              <Search className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Ej: Piso en Madrid..." 
                className="w-full py-4 bg-transparent outline-none text-gray-700"
              />
            </div>
            <button className="bg-[#1c2d51] text-white px-10 py-4 rounded-lg font-bold hover:opacity-95 transition-opacity">
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Inmuebles Destacados</h2>
            <p className="text-gray-500 max-w-md">Propiedades exclusivas publicadas recientemente por nuestros asociados.</p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-slate-300" size={40} />
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
             <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No hay propiedades destacadas en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(imovel => (
              <ImovelCard key={imovel.id} imovel={imovel} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegir nuestra tecnología?</h2>
            <div className="w-20 h-1.5 bg-[#1c2d51] mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Gestión Profesional', desc: 'Control total de cartera y clientes en un solo panel centralizado.' },
              { title: 'IA Generativa', desc: 'Anuncios optimizados automáticamente para mayor conversión.' },
              { title: 'White-Label Real', desc: 'Su portal inmobiliario con su marca, colores y dominio propio.' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                <CheckCircle2 className="w-12 h-12 text-[#357fb2] mb-6" />
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
