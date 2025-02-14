export const currency = (value: number | string | undefined | null) => {
    if (value == null || value === '') {
        return '₹0';
    }
    const num = typeof value === 'string' ? Number(value) : value;
    if (isNaN(num)) {
        return '₹0';
    }
    return num.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    });
};
