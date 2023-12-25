import AWSHttpSigV4_v2Provider from './awsHttpSigV4-v2.js';
import dotenv from 'dotenv';
import Web3 from 'web3';

dotenv.config();

const endpoint = process.env.AMB_HTTP_ENDPOINT_TEST;
const web3 = new Web3(new AWSHttpSigV4_v2Provider(endpoint));

const fromAddress = process.env.WALLET_AA6;
const privateKey = process.env.PRIVATE_KEY_AA6;
const toAddress = process.env.WALLET_TESTNET;

const transferAmount = web3.utils.toWei('0.01', 'ether');
const gasPrice = web3.utils.toWei('50', 'gwei');
const gasLimit = 50000;

Promise.all([
  web3.eth.getTransactionCount(fromAddress), // Lấy nonce hiện tại của địa chỉ nguồn
  web3.eth.getBalance(fromAddress), // Lấy số dư của địa chỉ nguồn
])
  .then(([nonce, balanceFromBefore]) => {
    console.log(`Nonce hiện tại của địa chỉ nguồn: ${nonce}`);
    console.log(`Số dư của địa chỉ nguồn: ${web3.utils.fromWei(balanceFromBefore, 'ether')} ETH`);
    nonce++; // Tăng nonce lên 1

    // Tạo giao dịch với nonce tăng dần
    const txObject = {
      nonce: nonce,
      from: fromAddress,
      to: toAddress,
      value: transferAmount,
      gasPrice: gasPrice,
      gas: gasLimit
    };

    console.log(`Đang gửi... ${web3.utils.fromWei(transferAmount, 'ether')}ETH đến địa chỉ: ${toAddress}`);
    return web3.eth.accounts.signTransaction(txObject, privateKey)
      .then(signedTx => {
        return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      })
      .then(receipt => {
        console.log(`TX details: https://goerli.etherscan.io/tx/${receipt.transactionHash}\n`);
        console.log('Gửi giao dịch thành công!🎉🎉🎉');
        return Promise.all([
          web3.eth.getBalance(fromAddress),
          web3.eth.getBalance(toAddress)
        ]);
      })
      .then(([balanceFromAfter, balanceToAfter]) => {
        console.log(`Số dư của địa chỉ nguồn sau gửi: ${web3.utils.fromWei(balanceFromAfter, 'ether')} ETH`);
        console.log(`Số dư của địa chỉ nhận sau gửi: ${web3.utils.fromWei(balanceToAfter, 'ether')} ETH`);
      })
      .catch(err => {
        console.error('Lỗi:', err);
      });
  })
  .catch(err => {
    console.error('Lỗi:', err);
  });
