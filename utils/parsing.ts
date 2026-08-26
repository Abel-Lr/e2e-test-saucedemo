export function extractAmount(text: string): number {
    const match = text.match(/\$([\d.]+)/);
    if (!match) throw new Error(`Impossible d'extraire un montant depuis: "${text}"`);
    return parseFloat(match[1]);
}

function parsePdfDate(text: string): Date {
    const match = text.match(/(\w+) (\d{1,2}), (\d{4}) at (\d{1,2}):(\d{2}) (AM|PM)/);
    if (!match) throw new Error(`Date introuvable dans: "${text}"`);

    const [, monthName, day, year, hour, minute, ampm] = match;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months.indexOf(monthName);

    let hour24 = parseInt(hour, 10);
    if (ampm === 'PM' && hour24 !== 12) hour24 += 12;
    if (ampm === 'AM' && hour24 === 12) hour24 = 0;

    return new Date(parseInt(year, 10), month, parseInt(day, 10), hour24, parseInt(minute, 10));
}

export function parsePdfInvoice(text: string) {
    const dateMatch = text.match(/Order Date (.+)/);
    const shipToMatch = text.match(/S H I P TO\s*\n(.+)\n(.+)/);
    const subtotalMatch = text.match(/Item total \$([\d.]+)/);
    const taxMatch = text.match(/Tax \$([\d.]+)/);
    const totalMatch = text.match(/Total \$([\d.]+)/);

    const itemLines = Array.from(text.matchAll(/^(.+) \$([\d.]+)$/gm))
        .filter(m => !m[1].includes('total') && !m[1].startsWith('Tax') && !m[1].startsWith('Total'));

    if (!dateMatch) throw new Error('Date introuvable');
    if (!shipToMatch) throw new Error('Ship to introuvable');
    if (!subtotalMatch) throw new Error('Sous-total introuvable');
    if (!taxMatch) throw new Error('Taxe introuvable');
    if (!totalMatch) throw new Error('Total introuvable');

    return {
        orderDate: parsePdfDate(dateMatch[1]),
        fullName: shipToMatch[1].trim(),
        zipCode: shipToMatch[2].trim(),
        items: itemLines.map(m => ({name: m[1].trim(), price: parseFloat(m[2])})),
        subtotal: parseFloat(subtotalMatch[1]),
        tax: parseFloat(taxMatch[1]),
        total: parseFloat(totalMatch[1]),
    };
}