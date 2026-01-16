
import React from 'react';
import { BarChart3, Building2, Globe, MessageSquare, Users, Settings } from 'lucide-react';
// Import Tenant to allow defining the default object
import { TenantCMS, Tenant } from './types';

export const ADMIN_NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: <BarChart3 className="w-5 h-5" /> },
  { name: 'Inmuebles', path: '/admin/imoveis', icon: <Building2 className="w-5 h-5" /> },
  { name: 'Sitio Web & CMS', path: '/admin/cms', icon: <Globe className="w-5 h-5" /> },
  { name: 'Leads', path: '/admin/leads', icon: <MessageSquare className="w-5 h-5" /> },
  { name: 'Usuarios', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
  { name: 'Configuraciones', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
];

export const DEFAULT_TENANT_CMS: TenantCMS = {
  homepage_sections: [
    { 
      id: 'h1', 
      type: 'hero', 
      enabled: true, 
      order: 0, 
      content: { 
        title: 'Su nueva etapa comienza aquí.', 
        subtitle: 'Consultoría inmobiliaria profesional centrada en resultados.',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600'
      } 
    },
    { 
      id: 'h2', 
      type: 'featured', 
      enabled: true, 
      order: 1, 
      content: { title: 'Propiedades Destacadas' } 
    }
  ],
  menus: {
    main: [
      { id: 'm1', label: 'Inicio', path: '/', order: 0, is_external: false },
      { id: 'm2', label: 'Inmuebles', path: 'imoveis', order: 1, is_external: false }
    ],
    footer: [
      { id: 'f1', label: 'Privacidad', path: 'privacidad', order: 0, is_external: false },
      { id: 'f2', label: 'Términos', path: 'terminos', order: 1, is_external: false }
    ]
  },
  pages: [],
  social: { facebook: '', instagram: '', linkedin: '', whatsapp: '' }
};

// Fix: Added DEFAULT_TENANT to resolve import errors in TenantContext and PublicPage
export const DEFAULT_TENANT: Tenant = {
  id: 'default-tenant-uuid',
  slug: 'demo-imosuite',
  nome: 'ImoSuite Demo',
  email: 'demo@imosuite.es',
  ativo: true,
  cor_primaria: "#1c2d51",
  cor_secundaria: "#357fb2",
  template_id: 'heritage',
  subscription: {
    status: 'active',
    plan_id: 'business',
    trial_ends_at: null
  },
  cms: DEFAULT_TENANT_CMS,
  created_at: new Date()
};
