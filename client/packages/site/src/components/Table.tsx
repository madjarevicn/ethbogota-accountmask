import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// wallet: "0xe264e5ccac1453b29f4f3be71c8cd6bef67f2d1b",
// note: "tx note test",
// tx: {
// network: "5",
// blockHash: "0xbe96e20de850e8c13f0f129bb493634a3ade46a20185ab61dab1218dc8ac1824",
// blockNumber: 7738656,
// from: "0xe264e5cCac1453b29f4f3Be71C8Cd6bEf67F2d1B",
// hash: "0x4923f50ac5465c181ed84565f7a2a6739da9838127e6d99802945336b06fb5a5",
// to: "0x93FE1BFCF7AeB6d84bCB18BF23FE3f10A7d741F7",
// logs: [ ],
// input: "0x",
// value: "0x8ac7230489e80",
// nonce: "0x10",
// gas: "0x5208",
// gasUsed: "0x5208",
// cumulativeGasUsed: "0x983f4b",
// gasPrice: "0x59682f5d",
// gasTipCap: "0x59682f00",
// gasFeeCap: "0x59682f8e",
// transactionHash: "0x4923f50ac5465c181ed84565f7a2a6739da9838127e6d99802945336b06fb5a5",
// alertId: "ff0953ac-582b-4f44-bb36-b570616a5408"
// }
// }

function BasicTable({ rows }: any) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ 'font-size': 16 }}>Network</TableCell>
            <TableCell sx={{ 'font-size': 16 }}>Note</TableCell>
            <TableCell sx={{ 'font-size': 16 }}>Tx Hash</TableCell>
            <TableCell sx={{ 'font-size': 16 }}>From</TableCell>
            <TableCell sx={{ 'font-size': 16 }}>To</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: Record<string, any>) => (
            <TableRow
              key={row.tx?.hash ?? 'key'}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ 'font-size': 16 }}>
                {row.tx?.network}
              </TableCell>
              <TableCell sx={{ 'font-size': 16 }}>
                {row.note ?? 'No note'}
              </TableCell>
              <TableCell sx={{ 'font-size': 16 }}>{row.tx?.hash}</TableCell>
              <TableCell sx={{ 'font-size': 16 }}>{row.tx?.from}</TableCell>
              <TableCell sx={{ 'font-size': 16 }}>{row.tx?.to}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export { BasicTable };
