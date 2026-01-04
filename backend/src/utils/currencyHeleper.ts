export const sanitizeCurrency = (value: string | number): string => {
    if (typeof value === 'number') return value.toString();

    let cleanString = value.replace(/[^0-9,]/g, ''); 

    cleanString = cleanString.replace(',', '.');

    return cleanString;
}