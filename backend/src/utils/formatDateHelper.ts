export const formatDateForSQL = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    return d.toISOString().split('T')[0]; // Menghasilkan "2026-01-05"
};