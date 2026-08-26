export function extractAmount(text: string): number {
    const match = text.match(/\$([\d.]+)/);
    if (!match) throw new Error(`Impossible d'extraire un montant depuis: "${text}"`);
    return parseFloat(match[1]);
}
