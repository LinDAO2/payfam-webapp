require('@nomiclabs/hardhat-waffle')
require('dotenv').config({ path: '.env' })

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/RZ0yGQf9HG0xX3a4wLO3jLHBAClxOvRU",
      accounts: ["893ef4749e7b6c7296c3562db278b1d0615bbbccf52c47ba551c7df1f83ac587"],
    },
  },
}
