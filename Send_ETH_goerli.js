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
const gasPrice = web3.utils.toWei('20', 'gwei');
const gasLimit = 21000;

// console.log(`Đang kiểm tra số dư của địa chỉ ${fromAddress} và ${toAddress}`);
Promise.all([
  web3.eth.getBalance(fromAddress),
  web3.eth.getBalance(toAddress)
])
  .then(([balanceFromBefore, balanceToBefore]) => {
    console.log(`Sender Address: ${web3.utils.fromWei(balanceFromBefore, 'ether')} ETH`);
    console.log(`Receiver Address: ${web3.utils.fromWei(balanceToBefore, 'ether')} ETH`);

    const txObject = {
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
        
        // console.log('Transaction hash:', receipt.transactionHash);
        console.log(`TX details: https://goerli.etherscan.io/tx/${receipt.transactionHash}\n`);
        // console.log('Transaction receipt:', receipt);
        console.log('Gửi giao dịch thành công!🎉🎉🎉');
        // console.log(`Đang kiểm tra số dư của địa chỉ ${fromAddress} và ${toAddress} sau khi gửi giao dịch`);
        return Promise.all([
          web3.eth.getBalance(fromAddress),
          web3.eth.getBalance(toAddress)
        ]);
      })
      .then(([balanceFromAfter, balanceToAfter]) => {
        console.log(`Send Address: ${web3.utils.fromWei(balanceFromAfter, 'ether')} ETH`);
        console.log(`Receive Address: ${web3.utils.fromWei(balanceToAfter, 'ether')} ETH`);
      })
      .catch(err => {
        console.error('Error:', err);
      });
  })
  .catch(err => {
    console.error('Error:', err);
  });
