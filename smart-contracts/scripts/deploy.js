const hre = require('hardhat')

async function main() {
  const PayfamBankFactory = await hre.ethers.getContractFactory('PayfamBank')
  
  // const PayfamBank = await PayfamBankFactory.deploy()

  // await PayfamBank.deployed()

  // console.log('PayfamBank deployed to:', PayfamBank.address)


  const gasPrice = await PayfamBankFactory.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);

  const estimatedGas = await PayfamBankFactory.signer.estimateGas(
    PayfamBankFactory.getDeployTransaction(),
  );
  console.log(`Estimated gas: ${estimatedGas}`);

  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await PayfamBankFactory.signer.getBalance();
  console.log(`Deployer balance:  ${hre.ethers.utils.formatEther(deployerBalance)}`);
  console.log(`Deployment price:  ${hre.ethers.utils.formatEther(deploymentPrice)}`);
  if (deployerBalance.lt(deploymentPrice)) {
    throw new Error(
      `Insufficient funds. Top up your account balance by ${hre.ethers.utils.formatEther(
        deploymentPrice.sub(deployerBalance),
      )}`,
    );
  }

  const payfamBankFactory = await PayfamBankFactory.deploy();
  await payfamBankFactory.deployed();

   console.log('PayfamBank deployed to:', PayfamBank.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
