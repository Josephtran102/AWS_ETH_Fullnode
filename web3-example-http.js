import AWSHttpSigV4_v2Provider from './awsHttpSigV4-v2.js';
import Web3 from 'web3';
const endpoint = process.env.AMB_HTTP_ENDPOINT
const web3 = new Web3(new AWSHttpSigV4_v2Provider(endpoint));
web3.eth.getNodeInfo().then(console.log);