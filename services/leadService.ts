
import { collection, getDocs, addDoc, query, orderBy, where, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Lead } from "../types";

export const LeadService = {
  async getLeads(tenantId: string): Promise<Lead[]> {
    if (!tenantId || tenantId === 'pending') return [];
    try {
      const leadsRef = collection(db, "tenants", tenantId, "leads");
      // Query filtrada y ordenada (requiere índice compuesto en Firestore)
      const q = query(leadsRef, orderBy("created_at", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Lead));
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.error("Acceso denegado a leads del tenant:", tenantId);
      }
      return [];
    }
  },

  async fetchUserIp(): Promise<string> {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip || '0.0.0.0';
    } catch {
      return '0.0.0.0';
    }
  },

  async createLead(tenantId: string, leadData: Partial<Lead>) {
    if (!tenantId) throw new Error("ID de agencia requerido para crear el lead.");

    const ip = await this.fetchUserIp();
    const leadsRef = collection(db, "tenants", tenantId, "leads");
    
    const defaultConsentText = "Declaro que he leído y acepto la Política de Privacidad y autorizo el tratamiento de mis datos personales para fines de contacto comercial.";

    const finalLead = {
      ...leadData,
      tenant_id: tenantId,
      estado: 'nuevo',
      lido: false,
      source_url: window.location.href,
      gdpr_ip: ip,
      gdpr_timestamp: serverTimestamp(),
      gdpr_consent_text: leadData.gdpr_consent_text || defaultConsentText,
      user_agent: navigator.userAgent,
      created_at: serverTimestamp()
    };

    return await addDoc(leadsRef, finalLead);
  },

  async markAsRead(tenantId: string, leadId: string) {
    const leadRef = doc(db, "tenants", tenantId, "leads", leadId);
    return await updateDoc(leadRef, { lido: true, estado: 'em_analise' });
  }
};
