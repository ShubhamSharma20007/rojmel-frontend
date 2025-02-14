export interface TransactionFormData {
    transaction_date: '';
    // headName: string;
    head_id: string;
    amount: string;
    transaction_type: 'In' | 'Out' | '';
    payment_method: 'Cash' | 'Online' | 'Cheque' | '';
    details: string;
    cheque_number: string;
    cheque_pfms_clearing_date: '';
    // documentNumber?: string;
    // clearingDate?: Date | null;
}
