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
  defaultNetwork: "mainnet",
  networks: {
    mainnet: {
      url: "https://eth-mainnet.g.alchemy.com/v2/Mv0SyvjiJxHYwn3JfwWs_HJXAxdB639T",
      accounts: ["0e093ef3e2618591ca5dbc15240194b79418d95f78d4f11947b9d644ecb19149"],
    },
    // goerli:{
    //   url:"https://eth-goerli.g.alchemy.com/v2/bZJ77goY8CYFOLHNCBfOgSeQD2aM4OdS",
    //   accounts:["893ef4749e7b6c7296c3562db278b1d0615bbbccf52c47ba551c7df1f83ac587"]
    // }
  },
}
