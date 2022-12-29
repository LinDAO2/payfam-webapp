const hre = require('hardhat')

async function main() {
  const PayfamBankFactory = await hre.ethers.getContractFactory('PayfamBank')
  const PayfamBank = await PayfamBankFactory.deploy()

  await PayfamBank.deployed()

  console.log('PayfamBank deployed to:', PayfamBank.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
