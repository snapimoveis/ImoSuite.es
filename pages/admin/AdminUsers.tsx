
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../../lib/firebase';
import { useTenant } from '../../contexts/TenantContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Users, UserPlus, MoreVertical, Shield, Loader2, X, Mail, User, Check, AlertCircle, Zap, Lock } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const { tenant } = useTenant();
  const { profile } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user'
  });

  const isBusiness = tenant.subscription?.plan_id === 'business' || profile?.email === 'snapimoveis@gmail.com';
  const userLimit = isBusiness ? 10 : 1;
  const reachedLimit = users.length >= userLimit;

  const fetchTeam = async () => {
    if (!profile?.tenantId || profile.tenantId === 'pending' || profile.tenantId === 'default-tenant-uuid') {
      setIsLoading(false);
      return;
    }
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("tenantId", "==", profile.tenantId));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map(userDoc => ({ id: userDoc.id, ...(userDoc.data() as any) })));
    } catch (err: any) {
      if (err.code !== 'permission-denied') {
        console.error("Error al cargar equipo:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [profile?.tenantId]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.tenantId || profile.tenantId === 'pending' || profile.tenantId === 'default-tenant-uuid') {
      setInviteError("Error de sesión: Agencia no identificada. Recargue la página.");
      return;
    }
    if (reachedLimit) {
      setInviteError("Límite de usuarios alcanzado para su plan.");
      return;
    }
    setIsSendingInvite(true);
    setInviteError(null);
    try {
      const inviteData = {
        displayName: inviteForm.name.trim(),
        email: inviteForm.email.toLowerCase().trim(),
        role: inviteForm.role,
        tenantId: profile.tenantId,
        status: 'pending',
        invited_at: serverTimestamp(),
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };
      await addDoc(collection(db, 'users'), inviteData);
      setInviteSuccess(true);
      await fetchTeam();
      setTimeout(() => {
        setIsInviteModalOpen(false);
        setInviteSuccess(false);
        setInviteForm({ name: '', email: '', role: 'user' });
      }, 2000);
    } catch (err: any) {
      console.error("Error detallado de la invitación:", err);
      if (err.code === 'permission-denied') {
        setInviteError("Sin permiso para crear usuarios en esta agencia.");
      } else {
        setInviteError("Fallo en la conexión al servidor. Verifique los datos e intente de nuevo.");
      }
    } finally {
      setIsSendingInvite(false);
    }
  };

  if (profile?.tenantId === 'pending') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="animate-spin mb-4 text-[#1c2d51]" size={32} />
        <p className="text-[10px] font-black uppercase tracking-widest">Sincronizando accesos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-brand animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1c2d51]">Gestión del Equipo</h1>
          <div className="flex items-center gap-2 mt-1">
             <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">Accesos de {tenant.nome}</p>
             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${isBusiness ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                Plan: {isBusiness ? 'Business (Hasta 10)' : 'Starter (1 Usuario)'}
             </span>
          </div>
        </div>
        {reachedLimit ? (
          <Link to="/planos" className="bg-amber-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl active:scale-95">
            <Zap size={20} fill="currentColor" /> Límite Alcanzado - Upgrade
          </Link>
        ) : (
          <button onClick={() => { setInviteError(null); setIsInviteModalOpen(true); }} className="bg-[#1c2d51] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl active:scale-95">
            <UserPlus size={20} /> Invitar Consultor
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">Nombre / Email</th>
                <th className="px-8 py-5">Cargo</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-slate-300" size={32} />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-slate-300 text-xs font-bold uppercase tracking-widest italic">
                    Ningún miembro encontrado. Comience invitando a su equipo.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${u.status === 'pending' ? 'bg-slate-100 text-slate-400' : 'bg-[#1c2d51] text-white'}`}>
                          {u.displayName?.charAt(0).toUpperCase() || u.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-[#1c2d51] text-sm">{u.displayName || 'Invitado'}</div>
                          <div className="text-[10px] text-slate-400 font-bold">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Shield size={14} className="text-blue-200" />
                        {u.role === 'admin' ? 'Administrador' : 'Consultor'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {u.status === 'pending' ? (
                        <span className="px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100 animate-pulse">Pendiente</span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">Activo</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-300 hover:text-[#1c2d51] transition-colors"><MoreVertical size={20}/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-2xl font-black text-[#1c2d51] tracking-tight uppercase">Nuevo Consultor</h3>
                 <button onClick={() => setIsInviteModalOpen(false)}><X className="text-slate-300 hover:text-slate-900" size={28}/></button>
              </div>
              {inviteSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <h4 className="text-xl font-black text-[#1c2d51]">¡Invitación Enviada!</h4>
                </div>
              ) : (
                <form onSubmit={handleSendInvite} className="space-y-6">
                  {inviteError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100 animate-in shake">
                      <AlertCircle size={16} /> {inviteError}
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Nombre del Consultor</label>
                    <input required className="admin-invite-input" placeholder="Ej: Juan Pérez" value={inviteForm.name} onChange={e => setInviteForm({...inviteForm, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Email Profesional</label>
                    <input required type="email" className="admin-invite-input" placeholder="juan@agencia.es" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm, email: e.target.value})} />
                  </div>
                  <button type="submit" disabled={isSendingInvite || reachedLimit} className="w-full bg-[#1c2d51] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-all disabled:opacity-50">
                    {isSendingInvite ? <Loader2 className="animate-spin" /> : <><Check size={18}/> Enviar Invitación</>}
                  </button>
                </form>
              )}
           </div>
        </div>
      )}
      <style>{`
        .admin-invite-input { width: 100%; padding: 1.15rem 1.4rem; background: #f8fafc; border: 2px solid transparent; border-radius: 1.25rem; outline: none; font-weight: 700; color: #1c2d51; transition: all 0.2s; font-size: 0.875rem; }
        .admin-invite-input:focus { background: #fff; border-color: #357fb2; box-shadow: 0 4px 20px -5px rgba(53, 127, 178, 0.1); }
      `}</style>
    </div>
  );
};

export default AdminUsers;
