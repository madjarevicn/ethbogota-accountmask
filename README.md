# ETH Bogota AccountMask

Repository for EthBogota hackathon submission.

## AccountMask

Extending Metamask capabilities by allowing users to add description notes (comments) to the transactions they make through MM, alongside options for CSV export, as well as a Watchlist feature. :)

![](https://storage.googleapis.com/ethglobal-api-production/projects%2Fa51c3%2Fimages%2Fphoto_2022-10-09_08-15-38.jpg)
![](https://storage.googleapis.com/ethglobal-api-production/projects%2Fa51c3%2Fimages%2Fphoto_2022-10-09_08-14-26.jpg)
![](https://storage.googleapis.com/ethglobal-api-production/projects%2Fa51c3%2Fimages%2Fphoto_2022-10-09_08-17-06.jpg)

## Project Description

The project itself brings an option for users to add notes to their transactions (for internal use of course), which by itself will make their life easier by having a human readable explanation of every transaction made. Alongside that, we added an option to export the transactions to csv, with the notes.

Besides that, we have built watchlist feature, in order to get notifications when selected wallets perform specific actions.

## How it's Made

The project consist of 3 parts: React client, Laravel (PHP) backend and Tenderly Alerting using Web3 Actions under the hood.

The users will have 3 options to do:

- adding a note on every transaction sent through MM, it will be persisted in storage
- allowing an export to csv of all transactions with mapped descriptions
- get notified for the alerts mentioned below
- predefined 3 types of alerts: ETH Balance change, successful tx from address and tx value match

### Transaction Notes

We were using storage feature to link added note with tx hash. Every time when a wallet sends a successful tx, the Tenderly Web3 Action will be triggered and it will send a request to our backend. We will store the tx with note in Postgres database and our frontend client will be able to retrieve all txs for given wallet.

### Export to CSV

Users are one click away for getting txs with notes exported to CSV file. All the data is transformed and parsed in order to be human readable and easy to download.

MetaMask Notifications (Alerts)

Users will be notified every time their wallet made a successful tx with the appropriate message such as 'wallet X sent a tx to wallet Y'. Also, every time their ETH Balance is below certain threshold, they will get a notification in their MM account. We were using Tenderly Alerts in order to listen to on-chain txs for our wallet addresses and each time the alert is created, we will use Tenderly Web3 Actions in order to send a payload to our backend and store the data.
