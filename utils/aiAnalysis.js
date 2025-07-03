const AIAnalysisUtils = {
    publicWorksAdjectives: [
        'excelente', 'bueno', 'malo', 'pésimo', 'deficiente', 'regular', 'óptimo',
        'inadecuado', 'satisfactorio', 'insatisfactorio', 'eficiente', 'ineficiente',
        'rápido', 'lento', 'costoso', 'económico', 'transparente', 'corrupto',
        'necesario', 'innecesario', 'útil', 'inútil', 'moderno', 'obsoleto',
        'seguro', 'peligroso', 'limpio', 'sucio', 'ordenado', 'desordenado',
        'funcional', 'disfuncional', 'accesible', 'inaccesible', 'completo', 'incompleto',
        'profesional', 'amateur', 'duradero', 'frágil', 'innovador', 'tradicional',
        'sostenible', 'insostenible', 'práctico', 'impractical', 'estético', 'feo',
        'avanzado', 'atrasado', 'confiable', 'poco_confiable'
    ],

    analyzeObservations: async (observations) => {
        try {
            const systemPrompt = `Eres un analista experto en participación ciudadana y obras públicas. Analiza las observaciones y determina:

1. Sentimiento: APROBACION o DESAPROBACION
2. Adjetivo principal de esta lista: ${AIAnalysisUtils.publicWorksAdjectives.join(', ')}
3. Nivel de criticidad: ALTO, MEDIO, BAJO

Devuelve JSON:
{
  "sentiment": "APROBACION|DESAPROBACION", 
  "mainAdjective": "adjetivo_de_la_lista",
  "criticality": "ALTO|MEDIO|BAJO",
  "summary": "resumen breve en 8 palabras"
}

No incluyas prefijos como \`\`\`json ni sufijos.`;

            const userPrompt = `Analiza esta observación ciudadana: "${observations}"`;
            
            let result = await invokeAIAgent(systemPrompt, userPrompt);
            result = result.replace(/json/g, '').replace(//g, '').trim();
            
            const analysis = JSON.parse(result);
            
            // Validate adjective is in our list
            if (!AIAnalysisUtils.publicWorksAdjectives.includes(analysis.mainAdjective)) {
                analysis.mainAdjective = 'regular';
            }
            
            return analysis;
        } catch (error) {
            console.error('Error analyzing observations:', error);
            return {
                sentiment: 'NEUTRAL',
                mainAdjective: 'regular',
                criticality: 'MEDIO',
                summary: 'Error en análisis'
            };
        }
    },

    generateAdjectiveRanking: async (workData) => {
        try {
            const systemPrompt = `Analiza los datos de obras públicas y genera un ranking de las 10 obras más criticadas.

Para cada obra calcula:
1. Porcentaje de críticas por tipo de adjetivo
2. Estado de ejecución (porcentajes)
3. Adjetivo más repetido

Devuelve JSON:
{
  "topCriticizedWorks": [
    {
      "codigo": "codigo_obra",
      "obra": "nombre_obra",
      "distrito": "distrito",
      "totalCritics": numero,
      "mainAdjective": "adjetivo_principal",
      "adjectivePercentage": porcentaje,
      "statusDistribution": {
        "terminado": porcentaje,
        "en_ejecucion": porcentaje,
        "interrumpido": porcentaje
      },
      "criticismRate": porcentaje
    }
  ]
}`;

            const userPrompt = `Analiza estos datos: ${JSON.stringify(workData)}`;
            
            let result = await invokeAIAgent(systemPrompt, userPrompt);
            result = result.replace(/json/g, '').replace(//g, '').trim();
            
            return JSON.parse(result);
        } catch (error) {
            console.error('Error generating adjective ranking:', error);
            return { topCriticizedWorks: [] };
        }
    }
};
