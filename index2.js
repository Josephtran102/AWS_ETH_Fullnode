import AWSHttpSigV4_v2Provider from './awsHttpSigV4-v2.js';
import dotenv from 'dotenv';
import fs from 'fs';
import Web3 from 'web3';

dotenv.config();

const endpoint = process.env.AMB_HTTP_ENDPOINT;
const web3 = new Web3(new AWSHttpSigV4_v2Provider(endpoint));

const contractAddress = '0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6'; // (Contract Bridge Scroll)

web3.eth.getBlockNumber().then(async (latestBlock) => {
    let interactingAddresses = new Set();

    const startBlock = 18306934;
    const endBlock = 18839027;
    for (let i = startBlock; i <= endBlock; i++) {
        let block = await web3.eth.getBlock(i, true);

        block.transactions.forEach((tx) => {
            if (tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()) {
                interactingAddresses.add(tx.from.toLowerCase());
            }
        });
    }

    const addressesArray = [...interactingAddresses];
    const outputFilePath = 'Scroll_Bridge_addresses.txt';

    fs.writeFile(outputFilePath, addressesArray.join('\n'), (err) => {
        if (err) {
            console.error('Lỗi khi ghi file:', err);
            return;
        }
        console.log([...interactingAddresses]);
        console.log(`Đã lưu danh sách các địa chỉ ví vào file ${outputFilePath}`);
    });
});
