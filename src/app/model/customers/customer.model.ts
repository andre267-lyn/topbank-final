export interface Customer {
  customerId: string;
  name: string;
  accountNumber: string;
  email: string;
  phoneNumber: string;
  motherMaidenName: string;
  accountCreationTime: string;
  debitCardType: string;
  customerCard?: {
    cardId: number;
    cardName: string;
  };
}