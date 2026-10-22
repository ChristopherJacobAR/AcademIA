export interface FeynmanEvaluationResponse {
  score: number;
  rubricScores: {
    exactitud: number; // /30
    supuestos: number; // /20
    deduccion: number; // /20
    causalidad: number; // /15
    transferencia: number; // /15
  };
  feedback: string[];
  recommendation: string;
}

export class GeminiService {
  private static getStoredKey(): string {
    return localStorage.getItem('academia_gemini_key') || '';
  }

  public static setStoredKey(key: string): void {
    localStorage.setItem('academia_gemini_key', key.trim());
  }

  public static hasKey(): boolean {
    return !!this.getStoredKey();
  }

  public static async callGemini(prompt: string, customKey?: string): Promise<string> {
    const key = customKey || this.getStoredKey();
    if (!key) {
      throw new Error('No se ha configurado ninguna API Key de Gemini. Ingresa tu clave en Configuración.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048
        }
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.error?.message || `Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sin respuesta del modelo.';
  }

  public static async evaluateFeynmanWithGemini(
    concept: string,
    userText: string
  ): Promise<FeynmanEvaluationResponse> {
    const prompt = `Eres un evaluador académico doctoral de Física y Matemáticas.
Evalúa la siguiente explicación según la técnica Feynman para el concepto: "${concept}".

Explicación del estudiante:
"""
${userText}
"""

Debes evaluar con la rúbrica oficial de 5 criterios:
1. Exactitud conceptual (máx 30 puntos)
2. Supuestos y límites de validez (máx 20 puntos)
3. Rigor deductivo y matemático (máx 20 puntos)
4. Claridad causal (máx 15 puntos)
5. Transferencia interdisciplinar o analogía (máx 15 puntos)

Responde estrictamente en formato JSON válido con la siguiente estructura:
{
  "score": <suma total 0 a 100>,
  "rubricScores": {
    "exactitud": <0-30>,
    "supuestos": <0-20>,
    "deduccion": <0-20>,
    "causalidad": <0-15>,
    "transferencia": <0-15>
  },
  "feedback": ["observación 1", "observación 2", "observación 3"],
  "recommendation": "consejo conciso para alcanzar el dominio doctoral"
}`;

    const text = await this.callGemini(prompt);
    // Parse json out of response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('La respuesta de Gemini no devolvió un JSON estructurado.');
    }
    return JSON.parse(jsonMatch[0]);
  }

  public static async explainTopic(topic: string, course: string): Promise<string> {
    const prompt = `Actúa como profesor emérito de ciencias exactas.
Explica de manera concisa pero matemáticamente rigurosa el tema: "${topic}" perteneciente a la asignatura "${course}".
Estructura tu respuesta en:
1. Intuición Física/Matemática (analogía memorable pero honesta).
2. Formulación Matemática (ecuaciones en sintaxis LaTeX $...$ o $$...$$).
3. Supuestos y Límites de Validez (dónde deja de aplicar la aproximación).
4. Ejemplo de Aplicación Concreta o Problema de Transferencia.`;

    return await this.callGemini(prompt);
  }
}
