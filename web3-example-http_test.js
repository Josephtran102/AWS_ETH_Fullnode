import AWSHttpSigV4_v2Provider from './awsHttpSigV4-v2.js';
import dotenv from 'dotenv';
// import fs from 'fs';
import Web3 from 'web3';

dotenv.config();
const endpoint = process.env.AMB_HTTP_ENDPOINT_TEST
const web3 = new Web3(new AWSHttpSigV4_v2Provider(endpoint));
web3.eth.getNodeInfo().then(console.log);