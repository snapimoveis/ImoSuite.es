
import React from 'react';
import { BarChart3, Building2, Globe, MessageSquare, Users, Settings } from 'lucide-react';
import { Tenant, TenantCMS } from './types';

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
        title: 'Tu nuevo capítulo comienza aquí.', 
        subtitle: 'Consultoría inmobiliaria premium centrada en resultados y satisfacción.',
        image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600'
      } 
    },
    { 
      id: 'h2', 
      type: 'featured', 
      enabled: true, 
      order: 1, 
      content: { title: 'Selección Premium' } 
    },
    { 
      id: 'h3', 
      type: 'about_mini', 
      enabled: true, 
      order: 2, 
      content: { 
        title: 'Sobre nuestra Agencia', 
        text: 'Líderes en el mercado local con más de una década de experiencia transformando sueños en hogares reales.',
        image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800'
      } 
    }
  ],
  menus: {
    main: [
      { id: 'm1', label: 'Inicio', path: '/', order: 0, is_external: false },
      { id: 'm2', label: 'Propiedades', path: 'imoveis', order: 1, is_external: false },
      { id: 'm3', label: 'Agencia', path: 'quienes-somos', order: 2, is_external: false },
      { id: 'm4', label: 'Contactos', path: 'contactos', order: 3, is_external: false }
    ],
    footer: [
      { id: 'f1', label: 'Política de Privacidad', path: 'privacidad', order: 0, is_external: false },
      { id: 'f2', label: 'Términos de Servicio', path: 'terminos', order: 1, is_external: false },
      { id: 'f3', label: 'Resolución de Litigios', path: 'resolucion-de-litigios', order: 2, is_external: false },
      { id: 'f4', label: 'Libro de Reclamaciones', path: 'https://www.consumo.gob.es/', order: 3, is_external: true }
    ]
  },
  pages: [
    { 
      id: 'p1', 
      title: 'Nuestra Agencia', 
      slug: 'quienes-somos', 
      content_md: 'Fundada con el propósito de simplificar el mercado inmobiliario en España, nuestra agencia destaca por su transparencia y eficacia.', 
      enabled: true
    },
    { id: 'p2', title: 'Contactos', slug: 'contactos', content_md: 'Estamos ubicados en el corazón de Madrid.', enabled: true },
    {
      id: 'p3',
      title: 'Resolución Alternativa de Litigios',
      slug: 'resolucion-de-litigios',
      enabled: true,
      content_md: 'El contenido de esta página se genera automáticamente con las entidades oficiales de resolución de conflictos de consumo en España.'
    },
    {
      id: 'p4',
      title: 'Política de Privacidad',
      slug: 'privacidad',
      enabled: true,
      content_md: 'Sus datos son tratados con la máxima seguridad y confidencialidad, de acuerdo con el RGPD y la LOPDGDD.'
    },
    {
      id: 'p5',
      title: 'Términos de Servicio',
      slug: 'terminos',
      enabled: true,
      content_md: 'Al utilizar este sitio web, usted acepta nuestras condiciones de uso.'
    }
  ],
  social: { facebook: '', instagram: '', linkedin: '', whatsapp: '' }
};

export const DEFAULT_TENANT: Tenant = {
  id: 'default-tenant-uuid',
  slug: 'demo-imosuite',
  nome: 'Heritage Real Estate',
  email: 'geral@heritage-demo.es',
  telefone: '+34 910 000 000',
  cor_primaria: '#1c2d51',
  cor_secundaria: '#357fb2',
  template_id: 'heritage',
  subscription: { status: 'active', plan_id: 'business', trial_ends_at: null },
  cms: DEFAULT_TENANT_CMS,
  ativo: true,
  onboarding_completed: true,
  created_at: new Date().toISOString()
};
