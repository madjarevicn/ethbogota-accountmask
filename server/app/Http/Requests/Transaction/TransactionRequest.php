<?php

namespace App\Http\Requests\Transaction;

use App\Http\Requests\ApiRequest;

class TransactionRequest extends ApiRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'network' => ['required', 'string'],
            'blockHash' => ['required', 'string'],
            'blockNumber' => ['required', 'numeric'],
            'hash' => ['required', 'string'],
            'from' => ['required', 'string'],
            'to' => ['required', 'string'],
            'logs' => [ 'array'],
            'input' => ['required', 'string'],
            'value' => ['required', 'string'],
            'nonce' => ['required', 'string'],
            'gas' => ['required', 'string'],
            'gasUsed' => ['required', 'string'],
            'cumulativeGasUsed' => ['required', 'string'],
            'gasPrice' => ['required', 'string'],
            'gasTipCap' => ['required', 'string'],
            'gasFeeCap' => ['required', 'string'],
            'alertId' => ['required', 'string'],
        ];
    }
}
