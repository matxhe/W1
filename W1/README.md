欧科定向培训作业

W1:
counter contract hash: 0x116f5aCFDeC56DA786DD7749DF5c39143b8e9cB2


transation Hash: A904874F1EC27DF0C32189C5014E6B83C7B14D7B010FD9AE912DE26381CD6ACB

OEC Explorer: https://www.oklink.com/en/oec-test/address/0xd21EdEAA807A072ee96B97a39B351499355aE93c




PS D:\BlockChainTrainning\W1\w1_code> truffle migrate --network ropsten

Compiling your contracts...
===========================
> Compiling .\contracts\Counter.sol
> Compiling .\contracts\Migrations.sol
> Artifacts written to D:\BlockChainTrainning\W1\w1_code\build\contracts
> Compiled successfully using:
   - solc: 0.8.11+commit.d7f03943.Emscripten.clang


Starting migrations...
======================
> Network name:    'ropsten'
> Network id:      3
> Block gas limit: 8000000 (0x7a1200)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0xc0e7d957da92ef49ef5dad32029101210f2137d3c4f4ddcd14a4e7c8ac44488e
   > Blocks: 7            Seconds: 161
   > contract address:    0xBbc7C30218f2c5079b2E53913499CB0Ebf82a316
   > block number:        12008571
   > block timestamp:     1645644408
   > account:             0xd21EdEAA807A072ee96B97a39B351499355aE93c
   > balance:             0.999586048796441158
   > gas used:            250142 (0x3d11e)
   > gas price:           1.654864851 gwei
   > value sent:          0 ETH
   > total cost:          0.000413951203558842 ETH

   Pausing for 2 confirmations...

   -------------------------------
   > confirmation number: 1 (block: 12008572)
   > confirmation number: 2 (block: 12008573)
   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.000413951203558842 ETH


2_deploy_contracts.js
=====================

   Deploying 'Counter'
   -------------------
   > transaction hash:    0xbbaa87a1e4104b64f275611206df15d15f0fe50ba354c29dfedf48ceff80b102
   > Blocks: 13           Seconds: 230
   > contract address:    0xF9323cA61653D22B0725fda80e3BA8C29CC6Ac3D
   > block number:        12008589
   > block timestamp:     1645644708
   > account:             0xd21EdEAA807A072ee96B97a39B351499355aE93c
   > balance:             0.999307839028005974
   > gas used:            132053 (0x203d5)
   > gas price:           1.551925446 gwei
   > value sent:          0 ETH
   > total cost:          0.000204936410920638 ETH

   Pausing for 2 confirmations...

   -------------------------------
   > confirmation number: 2 (block: 12008591)
   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.000204936410920638 ETH

Summary
=======
> Total deployments:   2
> Final cost:          0.00061888761447948 ETH
