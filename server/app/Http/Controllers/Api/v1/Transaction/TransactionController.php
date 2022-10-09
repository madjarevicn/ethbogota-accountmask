<?php

namespace App\Http\Controllers\Api\v1\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\TransactionRequest;
use App\Models\Transaction;
use App\Repository\TransactionRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class TransactionController extends Controller
{
    /**
     * @var TransactionRepositoryInterface
     */
    protected $transactionRepositoryInterface;

    /**
     * TokenLockController constructor.
     * @param TransactionRepositoryInterface $transactionRepositoryInterface
     */
    public function __construct(TransactionRepositoryInterface $transactionRepositoryInterface)
    {
        $this->transactionRepositoryInterface = $transactionRepositoryInterface;
    }

    public function create(Request $request)
    {
        $json = $request->all();
        $address = Arr::get($json, 'from');
        $hash = Arr::get($json, 'hash');

        Transaction::create([
            'transaction' => json_encode($json),
            'wallet' => strtolower($address),
            'hash' => $hash
        ]);

        return response()->json(['status' => 'ok']);
    }

    public function delete(Request $request) {

        $wallet = strtolower($request->route('wallet'));

        $transactions = Transaction::where('wallet', $wallet)->orderBy('id', 'DESC')->get();

        foreach ($transactions as $transaction) {
            $transaction->delete();
        }

        return response()->json(['status' => 'ok']);
    }

    public function show(Request $request) {

        $wallet = strtolower($request->route('wallet'));

        $transactions = Transaction::where('wallet', $wallet)->orderBy('id', 'DESC')->get();

        $data = [];

        foreach ($transactions as $transaction) {
            $data[] = [
                'wallet' => $transaction->wallet,
                'note' => $transaction->note,
                'tx' => json_decode($transaction->transaction, true)
            ];
        }

        return response()->json([
            'status' => 'ok',
            'transactions' => $data
        ]);
    }

    public function update(Request $request) {

        $txHash = Arr::get($request->all(), 'hash');
        $wallet = strtolower(Arr::get($request->all(), 'wallet'));
        $note = Arr::get($request->all(), 'note');

        $tx = Transaction::where('hash', $txHash)->where('wallet', $wallet)->first();

        if ($tx !== null) {
            $tx->note = $note;
            $tx->save();
        }
    }

}
