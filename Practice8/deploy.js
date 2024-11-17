const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();
async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./Note_sol_Note.abi", "utf-8");
  const binary = fs.readFileSync("./Note_sol_Note.bin", "utf-8");
  const contractFactory = new ethers.ContractFactory(abi, binary, account);
  console.log("Deploying...");
  const contract = await contractFactory.deploy(); // response
 
  console.log(contract);
  const deploymentReceipt = await contract.waitForDeployment("1");
  //console.log(deploymentReceipt);
  console.log(`Contract address: ${contract.runner.address}`);
  let curNote = await contract.getNote();
  console.log(`First request of note: ${curNote}`);
  const txResponse = await contract.setNote("My first note");
  const txReceipt = await txResponse.wait(1);
  curNote = await contract.getNote();
  console.log(`New note ${curNote}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });