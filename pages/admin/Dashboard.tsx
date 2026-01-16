
import React, { useEffect, useState } from 'react';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, MessageSquare, Users, Eye, Loader2, Globe, Edit3, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { profile, isSessionReady } = useAuth();
  const { tenant } = useTenant();
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({
    properties: 0,
    leads: 0,
    visits: 0,
    team: 0
  });

  useEffect(() => {
    const fetchRealData = async () => {
      if (!isSessionReady || !profile?.tenantId) return;

      try {
        // Consultas de conteo optimizadas (usando getCountFromServer)
        const propsQuery = query(collection(db, "tenants", profile.tenantId, "properties"));
        const leadsQuery = query(collection(db, "tenants", profile.tenantId, "leads"));
        const teamQuery = query(collection(db, "users"), where("tenantId", "==", profile.tenantId));

        const [propsSnap, leadsSnap, teamSnap] = await Promise.all([
          getCountFromServer(propsQuery),
          getCountFromServer(leadsQuery),
          getCountFromServer(teamQuery)
        ]);

        setCounts({
          properties: propsSnap.data().count,
          leads: leadsSnap.data().count,
          visits: 0, // Implementar tracking de visitas si es necesario
          team: teamSnap.data().count
        });
      } catch (err) {
        console.error("Error al cargar datos del Dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, [profile?.tenantId, isSessionReady]);

  if (isLoading || !isSessionReady) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="animate-spin mb-4 text-[#1c2d51]" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest">Cargando Panel Real...</p>
      </div>
    );
  }

  const stats = [
    { name: 'INMUEBLES ACTIVOS', value: counts.properties, icon: <Building2 size={20} className="text-blue-600" /> },
    { name: 'LEADS TOTALES', value: counts.leads, icon: <MessageSquare size={20} className="text-emerald-600" /> },
    { name: 'VISITAS WEB', value: counts.visits, icon: <Eye size={20} className="text-orange-600" /> },
    { name: 'MIEMBROS EQUIPO', value: counts.team, icon: <Users size={20} className="text-purple-600" /> },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-[#1c2d51] tracking-tighter">Hola, {profile?.displayName || tenant.nome}</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Gestión integral de tu agencia inmobiliaria</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistema Conectado</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Tiempo Real</span>
            </div>
            <div className="text-4xl font-black text-[#1c2d51] tracking-tighter mb-1">{stat.value}</div>
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm">
          <h3 className="font-black text-[#1c2d51] uppercase text-[10px] tracking-[0.2em] mb-12 flex items-center gap-2">
            <Zap size={14} className="text-amber-500" /> Rendimiento de Negocio
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{name: 'Hoy', val: counts.leads}]}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1c2d51" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1c2d51" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#cbd5e1'}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="val" stroke="#1c2d51" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#1c2d51] p-10 rounded-[3rem] shadow-2xl text-white flex flex-col justify-center relative overflow-hidden">
          <Globe className="absolute -right-10 -top-10 text-white/5 w-64 h-64" />
          <h3 className="text-2xl font-black tracking-tight mb-4 relative z-10">Tu Portal Digital</h3>
          <p className="text-white/60 text-sm font-medium mb-10 max-w-xs relative z-10">Tu inmobiliaria ya es visible bajo el dominio propio o el subdominio de ImoSuite.</p>
          <div className="flex flex-col gap-3 relative z-10">
            <a 
              href={`#/agencia/${tenant.slug}`} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-white text-[#1c2d51] py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
            >
              <Eye size={16} /> Ver Mi Sitio Público
            </a>
            <Link 
              to="/admin/cms" 
              className="bg-white/10 text-white border border-white/20 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            >
              <Edit3 size={16} /> Personalizar Diseño
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
