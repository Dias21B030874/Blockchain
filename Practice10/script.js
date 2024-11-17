const contractAddress = "0xCc78a4882356D1D72CbC07A221AA1aDD5c671906"; 

const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_note",
				"type": "string"
			}
		],
		"name": "setNote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getNote",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const provider = new ethers.providers.Web3Provider(window.ethereum, 97);
let signer;
let contract;

provider.send("eth_requestAccounts", []).then(() => {
    provider.listAccounts().then((accounts) => {
        signer = provider.getSigner(accounts[0]);
        contract = new ethers.Contract(contractAddress, abi, signer);
        console.log("Contract:", contract);
    });
});

async function setNote() {
    const note = document.getElementById("note").value;
    const setNoteTransaction = await contract.setNote(note);
    await setNoteTransaction.wait();
    console.log("Note saved to the blockchain:", note);
}

async function getNote() {
    const note = await contract.getNote();
    document.getElementById("result").innerText = note;
    console.log("Retrieved note:", note);
}
