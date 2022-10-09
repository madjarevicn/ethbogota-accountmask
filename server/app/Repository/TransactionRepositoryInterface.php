<?php

namespace App\Repository;

use App\Models\Transaction;

interface TransactionRepositoryInterface
{

    /**
     * Return airdrop allocations by address and airdrop portion id.
     *
     * @param string $txHash
     * @return Transaction|null
     */
    public function showByTxHash(string $txHash): ?Transaction;

    /**
     * Creates new airdrop allocation instance.
     *
     * @param array $query
     * @return Transaction
     */
    public function create(array $query = []): Transaction;

}
