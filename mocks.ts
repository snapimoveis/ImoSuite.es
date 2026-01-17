import { Imovel } from './types';

export const MOCK_IMOVEIS: Imovel[] = [
  {
    id: '1',
    tenant_id: 'default-tenant-uuid',
    ref: 'IMO-101',
    titulo: 'Moderno Piso T2 con Vistas al Río',
    slug: 'piso-t2-vistas-rio-madrid',
    tipo_imovel: 'apartamento',
    subtipo_imovel: null,
    tipology: 'T2',
    tipologia: 'T2',
    estado_conservacao: 'usado',
    ano_construcao: 2020,
    operacao: 'venda',
    arrendamento_tipo: null,
    arrendamento_duracao_min_meses: null,
    disponivel_imediato: true,
    localizacao: {
      pais: 'España',
      distrito: 'Madrid',
      concelho: 'Madrid',
      freguesia: null,
      codigo_postal: '28001',
      morada: 'Avenida de la Castellana',
      porta: '1',
      lat: 40.4167,
      lng: -3.7037,
      expor_morada: false
    },
    areas: {
      area_util_m2: 95,
      area_bruta_m2: 110,
      area_terreno_m2: null,
      pisos: 1,
      andar: 3,
      elevador: true
    },
    divisoes: {
      quartos: 2,
      casas_banho: 2,
      garagem: {
        tem: true,
        lugares: 1
      },
      varanda: true,
      arrecadacao: true,
      piscina: false,
      jardim: false
    },
    caracteristicas: ['Aire Acondicionado', 'Terraza', 'Cocina Equipada', 'Ascensor'],
    certificacao: {
      certificado_energetico: 'A',
      licenca_util_numero: '123',
      licenca_util_data: '2020-01-01',
      isento_licenca: false,
      estado_licenca: 'sim'
    },
    financeiro: {
      preco_venda: 450000,
      preco_arrendamento: null,
      negociavel: true,
      comissao_incluida: true,
      condominio_mensal: 50,
      imi_anual: 300,
      caucao_meses: null,
      despesas_incluidas: []
    },
    descricao: {
      curta: 'Moderno Piso T2 con Vistas al Río en Madrid',
      completa_md: 'Excelente piso reformado con acabados de lujo. Ubicado en una de las zonas más prestigiosas de la ciudad, ofrece una vista deslumbrante.\n\nCompuesto por salón amplio, cocina totalmente equipada y dos dormitorios con armarios empotrados.',
      gerada_por_ia: false,
      ultima_geracao_ia_at: null
    },
    media: {
      cover_media_id: 'm1',
      total: 3,
      items: [
        { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80', storage_path: '', order: 0, is_cover: true, alt: 'Salón', created_at: new Date().toISOString() },
        { id: 'm1-2', type: 'image', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80', storage_path: '', order: 1, is_cover: false, alt: 'Cocina Moderna', created_at: new Date().toISOString() },
        { id: 'm1-3', type: 'image', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80', storage_path: '', order: 2, is_cover: false, alt: 'Dormitorio principal', created_at: new Date().toISOString() }
      ]
    },
    publicacao: {
      estado: 'publicado',
      publicar_no_site: true,
      destaque: true,
      badges: [],
      data_publicacao: new Date().toISOString()
    },
    tracking: {
      views: 1250,
      favorites: 45
    },
    owner_uid: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    tenant_id: 'default-tenant-uuid',
    ref: 'IMO-102',
    titulo: 'Chalet de Lujo V4 con Piscina Privada',
    slug: 'chalet-lujo-v4-marbella',
    tipo_imovel: 'moradia',
    subtipo_imovel: null,
    tipology: 'V4',
    tipologia: 'V4',
    estado_conservacao: 'novo',
    ano_construcao: 2023,
    operacao: 'venda',
    arrendamento_tipo: null,
    arrendamento_duracao_min_meses: null,
    disponivel_imediato: true,
    localizacao: {
      pais: 'España',
      distrito: 'Málaga',
      concelho: 'Marbella',
      freguesia: null,
      codigo_postal: '29600',
      morada: 'Urbanización Lujo',
      porta: '12',
      lat: 36.5100,
      lng: -4.8800,
      expor_morada: false
    },
    areas: {
      area_util_m2: 240,
      area_bruta_m2: 350,
      area_terreno_m2: 600,
      pisos: 2,
      andar: null,
      elevador: false
    },
    divisoes: {
      quartos: 4,
      casas_banho: 4,
      garagem: {
        tem: true,
        lugares: 2
      },
      varanda: true,
      arrecadacao: false,
      piscina: true,
      jardim: true
    },
    caracteristicas: ['Piscina', 'Jardín', 'Chimenea', 'Domótica'],
    certificacao: {
      certificado_energetico: 'A+',
      licenca_util_numero: '456',
      licenca_util_data: '2023-05-01',
      isento_licenca: false,
      estado_licenca: 'sim'
    },
    financeiro: {
      preco_venda: 1250000,
      preco_arrendamento: null,
      negociavel: false,
      comissao_incluida: true,
      condominio_mensal: null,
      imi_anual: 800,
      caucao_meses: null,
      despesas_incluidas: []
    },
    descricao: {
      curta: 'Chalet de Lujo V4 con Piscina Privada en Marbella',
      completa_md: 'Fantástica vivienda unifamiliar en parcela de 600m². Diseño contemporáneo con amplios ventanales que permiten una excelente entrada de luz natural.\n\nJardín con riego automático y piscina de cloración salina.',
      gerada_por_ia: false,
      ultima_geracao_ia_at: null
    },
    media: {
      cover_media_id: 'm2',
      total: 3,
      items: [
        { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80', storage_path: '', order: 0, is_cover: true, alt: 'Exterior Chalet', created_at: new Date().toISOString() },
        { id: 'm2-2', type: 'image', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', storage_path: '', order: 1, is_cover: false, alt: 'Piscina', created_at: new Date().toISOString() },
        { id: 'm2-3', type: 'image', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', storage_path: '', order: 2, is_cover: false, alt: 'Fachada Nocturna', created_at: new Date().toISOString() }
      ]
    },
    publicacao: {
      estado: 'publicado',
      publicar_no_site: true,
      destaque: true,
      badges: [],
      data_publicacao: new Date().toISOString()
    },
    tracking: {
      views: 890,
      favorites: 72
    },
    owner_uid: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    tenant_id: 'default-tenant-uuid',
    ref: 'IMO-103',
    titulo: 'Estudio Moderno en Centro Histórico',
    slug: 'estudio-moderno-madrid-centro',
    tipo_imovel: 'apartamento',
    subtipo_imovel: null,
    tipology: 'T0',
    tipologia: 'T0',
    estado_conservacao: 'renovado',
    ano_construcao: 1950,
    operacao: 'arrendamento',
    arrendamento_tipo: 'residencial',
    arrendamento_duracao_min_meses: 12,
    disponivel_imediato: true,
    localizacao: {
      pais: 'España',
      distrito: 'Madrid',
      concelho: 'Madrid',
      freguesia: 'Centro',
      codigo_postal: '28012',
      morada: 'Calle Mayor',
      porta: '45',
      lat: 40.4155,
      lng: -3.7108,
      expor_morada: true
    },
    areas: {
      area_util_m2: 35,
      area_bruta_m2: 40,
      area_terreno_m2: null,
      pisos: 1,
      andar: 2,
      elevador: true
    },
    divisoes: {
      quartos: 0,
      casas_banho: 1,
      garagem: {
        tem: false,
        lugares: 0
      },
      varanda: false,
      arrecadacao: false,
      piscina: false,
      jardim: false
    },
    caracteristicas: ['Amueblado', 'Doble Acristalamiento', 'Metro a la puerta'],
    certificacao: {
      certificado_energetico: 'C',
      licenca_util_numero: '789',
      licenca_util_data: '1950-10-10',
      isento_licenca: false,
      estado_licenca: 'sim'
    },
    financeiro: {
      preco_venda: null,
      preco_arrendamento: 950,
      negociavel: false,
      comissao_incluida: true,
      condominio_mensal: 30,
      imi_anual: null,
      caucao_meses: 2,
      despesas_incluidas: []
    },
    descricao: {
      curta: 'Estudio Moderno en pleno Centro Histórico de Madrid',
      completa_md: 'Estudio totalmente recuperado y amueblado en el corazón de Madrid. Ideal para estudiantes o nómadas digitales que pretenden vivir la experiencia urbana de la capital.',
      gerada_por_ia: false,
      ultima_geracao_ia_at: null
    },
    media: {
      cover_media_id: 'm3',
      total: 2,
      items: [
        { id: 'm3', type: 'image', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', storage_path: '', order: 0, is_cover: true, alt: 'Salón Dormitorio', created_at: new Date().toISOString() },
        { id: 'm3-2', type: 'image', url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80', storage_path: '', order: 1, is_cover: false, alt: 'Cocina Americana', created_at: new Date().toISOString() }
      ]
    },
    publicacao: {
      estado: 'publicado',
      publicar_no_site: true,
      destaque: true,
      badges: [],
      data_publicacao: new Date().toISOString()
    },
    tracking: {
      views: 4500,
      favorites: 120
    },
    owner_uid: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];