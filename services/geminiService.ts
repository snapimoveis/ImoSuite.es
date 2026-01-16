import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

export const generatePropertyDescription = async (property: any, tone: string = 'formal'): Promise<{ curta: string; completa: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const toneInstructions = {
    formal: "Usa un tono serio, profesional y centrado en hechos técnicos.",
    casual: "Usa un tono ligero, acogedor y centrado en el estilo de vida.",
    luxo: "Usa un tono sofisticado, exclusivo y aspiracional."
  }[tone] || "Usa un tono profesional.";

  const systemInstruction = `Eres un experto en marketing inmobiliario en España. Escribes exclusivamente en Español de España (ES-ES). 
  Reglas: 
  - Usa 'baño' o 'aseo'.
  - Usa 'alquiler' en lugar de 'arrendamiento'.
  - Usa 'planta baja' en lugar de 'térreo'.
  - Usa 'piso' o 'vivienda' en lugar de 'apartamento'.
  - Usa párrafos (\n\n) para la descripción completa.
  Instrucción de Estilo: ${toneInstructions}`;

  const prompt = `Genera dos descripciones (corta y completa) para este inmueble: ${JSON.stringify({
    titulo: property.titulo,
    tipo: property.tipo_imovel,
    tipology: property.tipologia,
    localizacion: property.localizacao,
    areas: property.areas,
    divisiones: property.divisoes,
    caracteristicas: property.caracteristicas
  })}. 
  Devuelve estrictamente un objeto JSON.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            curta: { type: Type.STRING, description: "Descripción corta (máx 200 caracteres) para eslogan de catálogo." },
            completa: { type: Type.STRING, description: "Descripción detallada con varios párrafos resaltando los puntos fuertes." }
          },
          required: ["curta", "completa"],
        },
      },
    });
    
    const text = response.text;
    if (!text) throw new Error("La IA no devolvió texto.");

    return JSON.parse(text);
  } catch (error) {
    console.error("Error Crítico Gemini:", error);
    return {
      curta: `${property.titulo} en ${property.localizacao?.concelho || 'excelente ubicación'}.`,
      completa: `Este excelente inmueble destaca por sus amplias estancias y ubicación privilegiada en ${property.localizacao?.concelho}.\n\nConsta de ${property.divisoes?.quartos || 0} habitaciones y ${property.divisoes?.casas_banho || 0} baños, ofreciendo el confort ideal para su familia. Concierte su visita ahora para conocer todos los detalles de esta propiedad.`
    };
  }
};

export const generateAgencySlogan = async (agencyName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera un eslogan corto y memorable en ES-ES para la inmobiliaria "${agencyName}". Devuelve solo el texto del eslogan sin comillas.`,
    });
    return response.text?.trim().replace(/^"|"$/g, '') || "Su inmobiliaria de confianza.";
  } catch { 
    return "Excelencia en el mercado inmobiliario."; 
  }
};