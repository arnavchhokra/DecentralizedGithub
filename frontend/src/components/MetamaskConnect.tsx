import Web3 from 'web3';

interface ConnectResult {
  account: string | null;
  networkId: number | null;
}

const MetamaskConnect = async (): Promise<ConnectResult> => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const web3 = new Web3((window as any).ethereum);
      const accounts = await web3.eth.requestAccounts();
      const account = accounts[0];
      const networkIdString= await web3.eth.net.getId();
      const networkId = parseInt(networkIdString.toString(), 10); 

      return { account, networkId };
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      return { account: null, networkId: null };
    }
  } else {
    console.error('MetaMask is not installed.');
    return { account: null, networkId: null };
  }
};

export default MetamaskConnect;
