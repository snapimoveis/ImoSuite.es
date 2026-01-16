import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

/* ============================================================
   CONFIGURACIÓN GEMINI (VITE / FRONTEND)
============================================================ */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

if (!GEMINI_API_KEY) {
  throw new Error(
    "VITE_GEMINI_API_KEY no encontrada. Verifique el .env o las variables del Vercel."
  );
}

const gemini = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

/* ============================================================
   TIPOS
============================================================ */

type Tone = "formal" | "casual" | "lujo";

interface PropertyInput {
  titulo?: string;
  tipo_inmueble?: string;
  tipologia?: string;
  estado?: string;
  localizacion?: {
    municipio?: string;
    provincia?: string;
    zona?: string;
  };
  areas?: {
    area_total?: number;
    area_util?: number;
  };
  divisiones?: {
    dormitorios?: number;
    banos?: number;
  };
  caracteristicas?: string[];
}

/* ============================================================
   CTA ESTÁNDAR (GARANTIZADO)
============================================================ */

const CTA_PADRAO =
  "No pierda esta oportunidad. Contáctenos y reserve su visita.";

/* ============================================================
   DESCRIPCIÓN DEL INMUEBLE (PROMPT ROBUSTO + CTA)
============================================================ */

export const generatePropertyDescription = async (
  property: PropertyInput,
  tone: Tone = "formal"
): Promise<{ corta: string; completa: string }> => {
  const toneMap: Record<Tone, string> = {
    formal: `
Tono profesional, informativo y objetivo.
Adecuado para portales inmobiliarios y perfiles inversores.
`,
    casual: `
Tono cercano y acogedor.
Enfoque en el confort, el estilo de vida y la experiencia de uso.
`,
    lujo: `
Tono sofisticado, exclusivo y aspiracional.
Lenguaje premium y enfoque en diferenciación y valor.
`,
  };

  const systemInstruction = `
Eres un especialista senior en marketing inmobiliario en España.

REGLAS OBLIGATORIAS:
1. Escribe exclusivamente en Español de España (ES-ES)
2. No utilices español latinoamericano
3. Usa siempre terminología inmobiliaria habitual en España
4. No inventes datos técnicos o legales
5. Si falta información, simplemente omítela
6. Texto natural, humano y comercial (no robótico)
7. No utilices emojis ni listas
8. Usa párrafos con separación (\n\n)

REGLA OBLIGATORIA DE CIERRE:
- El ÚLTIMO párrafo de la descripción completa DEBE ser siempre un call to action
- El call to action debe invitar explícitamente a contactar o reservar visita
- Utiliza solo UN call to action

Ejemplos válidos de call to action:
- "No pierda esta oportunidad. Contáctenos y reserve su visita."
- "Descubra personalmente este inmueble. Reserve su visita."
- "Póngase en contacto con nosotros y solicite su visita."

ESTILO:
${toneMap[tone]}
`.trim();

  const prompt = `
INMUEBLE:
${JSON.stringify(
  {
    titulo: property.titulo,
    tipo: property.tipo_inmueble,
    tipologia: property.tipologia,
    estado: property.estado,
    localizacion: property.localizacion,
    areas: property.areas,
    divisiones: property.divisiones,
    caracteristicas: property.caracteristicas,
  },
  null,
  2
)}

OBJETIVO:
Crear una descripción inmobiliaria clara, realista y persuasiva para su publicación online.

DEVUELVE ESTRICTAMENTE UN OBJETO JSON VÁLIDO.
`.trim();

  try {
    const response: GenerateContentResponse =
      await gemini.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              corta: {
                type: Type.STRING,
                description:
                  "Descripción corta (máx. 200 caracteres) para listados.",
              },
              completa: {
                type: Type.STRING,
                description:
                  "Descripción completa con varios párrafos y call to action final.",
              },
            },
            required: ["corta", "completa"],
          },
        },
      });

    if (!response.text) {
      throw new Error("Respuesta vacía de Gemini.");
    }

    const result = JSON.parse(response.text) as {
      corta: string;
      completa: string;
    };

    /* ========================================================
       BLINDAJE FINAL — GARANTIZA CTA
    ======================================================== */

    if (!result.completa.toLowerCase().includes("visita")) {
      result.completa = `${result.completa.trim()}\n\n${CTA_PADRAO}`;
    }

    return result;
  } catch (error) {
    console.error("Error Gemini (descripción del inmueble):", error);

    // Fallback seguro con CTA
    return {
      corta: `${property.titulo ?? "Inmueble"} en ${
        property.localizacion?.municipio ?? "zona atractiva"
      }.`,
      completa: `Este ${property.tipo_inmueble ?? "inmueble"} se encuentra en ${
        property.localizacion?.municipio ?? "una zona de alta demanda"
      }, ofreciendo una solución equilibrada entre confort y funcionalidad.

Dispone de ${property.divisiones?.dormitorios ?? 0} dormitorios y ${
        property.divisiones?.banos ?? 0
      } baños, adaptándose a diferentes perfiles de uso, tanto residencial como de inversión.

${CTA_PADRAO}`,
    };
  }
};

/* ============================================================
   SLOGAN INMOBILIARIA
============================================================ */

export const generateAgencySlogan = async (
  agencyName: string
): Promise<string> => {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
Crea un eslogan corto, profesional y memorable en Español de España (ES-ES)
para la inmobiliaria "${agencyName}".

Reglas:
- Máximo 8 palabras
- Tono institucional y profesional
- No utilices comillas
`,
    });

    return (
      response.text?.trim().replace(/^"|"$/g, "") ||
      "Tu inmobiliaria de confianza."
    );
  } catch {
    return "Excelencia en el sector inmobiliario.";
  }
};
