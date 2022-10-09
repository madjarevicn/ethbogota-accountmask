<?php

namespace App\Repository;

use App\Models\Transaction;

class EloquentTransactionRepository implements TransactionRepositoryInterface
{

    public function showByTxHash($txHash): ?Transaction
    {
        return Transaction::find($txHash);
    }

    public function create(array $query = []): Transaction
    {
        return Transaction::create($query);
    }

}
