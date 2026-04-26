import ai from "../config/ai.js";
import Category from "../models/Category.js";
import createError from "../utils/createError.js";

const extractJsonFromText = (text) => {
    const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(cleanText);
};

const fallbackSuggestion = (reason = "No se pudo obtener una sugerencia automática en este momento") => {
    return {
        suggestedCategoryId: null,
        suggestedCategoryName: null,
        confidence: "low",
        reason
    };
};

export const suggestCategory = async (userId, expenseData) => {
    const { title, description, amount } = expenseData;

    const categories = await Category.find({
        user: userId,
        isActive: true
    }).select("_id name description");

    if (categories.length === 0) {
        throw createError("El usuario no tiene categorías disponibles", 400);
    }

    const categoriesForAI = categories.map((category) => ({
        id: category._id.toString(),
        name: category.name,
        description: category.description || ""
    }));

    const prompt = `
Sos un asistente que ayuda a clasificar gastos personales.

Tu tarea es elegir UNA categoría existente para el gasto.
No inventes categorías nuevas.
La propiedad suggestedCategoryId debe ser exactamente uno de los ids listados.
No devuelvas texto adicional.
Respondé únicamente con JSON válido.

Categorías disponibles:
${JSON.stringify(categoriesForAI, null, 2)}

Gasto:
{
  "title": "${title}",
  "description": "${description || ""}",
  "amount": ${amount || null}
}

Formato exacto de respuesta:
{
  "suggestedCategoryId": "id_de_la_categoria",
  "suggestedCategoryName": "nombre_de_la_categoria",
  "confidence": "low | medium | high",
  "reason": "explicación breve"
}
`;

    try {
        const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json"
            }
        });

        const text = response.text;

        if (!text) {
            return fallbackSuggestion("La IA no devolvió una respuesta válida");
        }

        const suggestion = extractJsonFromText(text);

        const selectedCategory = categories.find((category) => {
            return category._id.toString() === suggestion.suggestedCategoryId;
        });

        if (!selectedCategory) {
            return fallbackSuggestion("La IA no devolvió una categoría existente");
        }

        return {
            suggestedCategoryId: selectedCategory._id,
            suggestedCategoryName: selectedCategory.name,
            confidence: suggestion.confidence || "medium",
            reason: suggestion.reason || "Categoría sugerida según los datos del gasto"
        };
    } catch (error) {
        return fallbackSuggestion();
    }
};