export interface ReceiptItem {
    id: string; // unique ID
    name: string;
    price: number;
    quantity: number;
    isConfirmed?: boolean;
    assignments: Record<string, number>; // Record of participantId to amount paid, e.g., { "UserA": 5.00, "UserB": 5.00 }
    splitFromId?: string; // Original item ID if this was created from a quantity split
}

export interface ReceiptData {
    items: ReceiptItem[];
    subtotal: number;
    tax: number;
    tip: number;
    fees: number;
    total: number;
}

export interface Participant {
    id: string;
    name: string;
}

export interface ParticipantTotals { [participantId: string]: number; }
