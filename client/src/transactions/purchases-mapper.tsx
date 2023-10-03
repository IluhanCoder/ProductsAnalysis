import { Transaction } from "./transaction-types";

type LocalParams = {
    transaction: Transaction,
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>> 
}

const PurchasesMapper = (params: LocalParams) => {
    return <div>
        {
            transaction
        }
    </div>
}

export default PurchasesMapper;