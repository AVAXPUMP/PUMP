<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import {ElMessage} from 'element-plus';
import {ElUpload, ElIcon} from 'element-plus';
import {Plus} from '@element-plus/icons-vue';
import axios from '../utils/axios';
import {mapState} from "vuex";
import {ethers} from "ethers";
import {factory_address} from "@/store";
import {FactoryAbi} from "@/store/TokenFactory";
import {getSigner} from "@/utils/wallet";

export default {
  name: "DeployView",
  components: {
    HeaderComponent,
    ElMessage,
    ElUpload,
    ElIcon,
    Plus
  },
  data() {
    return {
      imageUrl: '',
      tokenName: '',
      tokenSymbol: '',
      tokenDescription: '',
      website: '',
      telegram: '',
      twitter: '',
      initialBuyAmount: '',
      loading: false
    };
  },
  computed: {
    ...mapState(['wallet_address', 'wallet_type']), // 映射 state
    connected() {
      if (this.wallet_address) {
        return this.wallet_address.substr(0, 6) + '...' + this.wallet_address.substr(-4)
      } else {
        return 'Connect Wallet'
      }
    }
  },
  mounted() {


  },
  methods: {
    async onClickSubmit() {
      // Check if wallet is connected
      if (!this.wallet_address) {
        ElMessage.error('Please connect wallet first.');
        return;
      }

      // Data validation
      if (!this.tokenName) {
        ElMessage.error('Token name is required.');
        return;
      }

      if (!this.tokenSymbol) {
        ElMessage.error('Token symbol is required.');
        return;
      }

      if (!this.tokenDescription) {
        ElMessage.error('Token description is required.');
        return;
      }

      if (!this.imageUrl) {
        ElMessage.error('Token image is required.');
        return;
      }


      // if (this.website || !isValidUrl(this.website)) {
      //   ElMessage.error('A valid website URL is required.');
      //   return;
      // }
      //
      // if (this.telegram && !isValidUrl(this.telegram)) {
      //   ElMessage.error('A valid Telegram URL is required.');
      //   return;
      // }
      //
      // if (this.twitter && !isValidUrl(this.twitter)) {
      //   ElMessage.error('A valid Twitter URL is required.');
      //   return;
      // }
      //
      // if (!this.initialBuyAmount || isNaN(this.initialBuyAmount) || this.initialBuyAmount <= 0) {
      //   ElMessage.error('Initial buy amount must be a positive number.');
      //   return;
      // }

      try {
        if (this.loading) {
          return
        }
        this.loading = true

        const signerInfo = await getSigner(this.wallet_type); // Get the signer information
        // Check if signerInfo is an array with two elements
        let provider, signer;
        if (Array.isArray(signerInfo) && signerInfo.length === 2) {
          [provider, signer] = signerInfo;
        } else {
          throw new Error('getSigner() did not return an array with provider and signer');
        }

        if (!this.wallet_address) {
          throw new Error('Wallet address is not defined');
        }

        const factory = new ethers.Contract(factory_address, FactoryAbi, signer)

        console.log('factory_address', factory_address)

        console.log('FactoryAbi', FactoryAbi)
        console.log('factory', factory);


        const tx = await factory.createToken(this.tokenName, this.tokenSymbol)
        console.log('tx', tx,)
        ElMessage.success('Transaction submitted. Waiting for confirmation...');

        const receipt = await tx.wait();
        let parsedLogs = null;
        console.log('receipt', receipt)
        if (receipt.status === 1) {
          console.log('Order completed successfully.');
          ElMessage.success('Order completed successfully.');

          parsedLogs = receipt.logs.map(log => {
            try {
              const iface = new ethers.Interface(FactoryAbi);
              return iface.parseLog(log);
            } catch (error) {
              console.error("Error parsing log:", error);
              return null; // or handle the error as needed
            }
          }).filter(log => log !== null); // Filter out any null values

          console.log('parsedLogs', parsedLogs);

        } else {
          console.log('Order failed.');
          ElMessage.success('Order failed.');
          this.loading = false
          return;
        }


        // Proceed with the API request
        const url = "/api/create_token";
        const tokenAddress = parsedLogs[1].args[0]
        const resp = await axios.post(url, {
          name: this.tokenName,
          symbol: this.tokenSymbol,
          description: this.tokenDescription,
          website: this.website,
          telegram: this.telegram,
          twitter: this.twitter,
          initialBuyAmount: this.initialBuyAmount,
          iconUrl: this.imageUrl,
          txid: tx.hash,
          tokenAddress: tokenAddress,
          creatorAddress: this.wallet_address
        });
        this.loading = false


        if (resp.data.code === 0) {
          // await router.push('/detail?token=' + tokenAddress, {})
        }

        if (this.initialBuyAmount) {
          const tx = await factory.buy(tokenAddress, {
            value: ethers.parseEther(this.initialBuyAmount.toString())
          });
          ElMessage.success("Transaction submitted. Waiting for confirmation...");

          const receipt = await tx.wait();

          if (receipt.status === 1) {
            ElMessage.success("Buy completed successfully.");
            await axios.post('/api/create_history', {
              tradeType: 'buy',
              tokenAddress: tokenAddress,
              txid: tx.hash,
              amount: this.amount,
              state: 'FUNDING',
              creatorAddress: this.wallet_address
            })
          }
        }

      } catch (e) {
        this.loading = false
        console.log(e)
        if (e.reason) {
          ElMessage.error(e.reason)
        } else if (e.shortMessage) {
          ElMessage.error(("Transaction failed: " + e.shortMessage));
        }

      }finally {
        this.loading = false

      }
    },

    handleAvatarSuccess(response, uploadFile) {
      //接口返回

      //   {
      //     message: "File uploaded successfully", file
      //   :
      //     "http://www.bump.ceo/uploads/1733239919988.jpg"
      //   }
      //   file
      //       :
      //       "http://www.bump.ceo/uploads/1733239919988.jpg"
      //   message
      //       :
      //       "File uploaded successfully"
      // }
      console.log(response, uploadFile)
      this.imageUrl = response.file;
    },
    beforeAvatarUpload(rawFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const maxSizeInMB = 4;

      if (!allowedTypes.includes(rawFile.type)) {
        ElMessage.error('Avatar picture must be in JPG, PNG, GIF, or WEBP format!');
        return false;
      } else if (rawFile.size / 1024 / 1024 > maxSizeInMB) {
        ElMessage.error('Avatar picture size cannot exceed 4MB!');
        return false;
      }

      return true;
    }
  }
}
</script>

<template>
  <div>
    <HeaderComponent/>

    <div class="index">
      <div class="section6">
        <div class="title_1">Launch your token on BUMP</div>
        <div class="shadow content">
          <div class="block1">
            <div class="left">
              <div class="title">
                <div class="s1">Image *</div>
              </div>
              <el-upload
                  class=""
                  action="https://www.bump.ceo/upload"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
              >
                <div class="imgfile" style="">
                  <div class="title" v-if="!imageUrl">JPEG/PNG/WEBP/GIF Less Than 4MB</div>
                  <div class="filesWrap" v-if="!imageUrl"></div>
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" alt=""/>
                </div>

                <!--                <el-icon v-else class="avatar-uploader-icon">-->
                <!--                  <Plus/>-->
                <!--                </el-icon>-->
              </el-upload>
            </div>
            <div class="right">
              <div class="title">
                <div class="s1">Token Name *</div>
                <div class="s2">{{ tokenName.length }}/20</div>
              </div>
              <input type="text" v-model="tokenName" class="words" maxlength="20">
              <div class="title">
                <div class="s1">Token Symbol ($Ticker) *</div>
                <div class="s2">{{ tokenSymbol.length }}/10</div>
              </div>
              <input type="text" v-model="tokenSymbol" class="words" maxlength="10">
            </div>
          </div>
          <div class="block2">
            <div class="title">
              <div class="s1">Token Description *</div>
              <div class="s2">{{ tokenDescription.length }}/256</div>
            </div>
            <textarea v-model="tokenDescription" class="txt" maxlength="256"></textarea>
            <div class="title">
              <div class="s1">Website</div>
            </div>
            <input type="text" v-model="website" placeholder="Optional" class="words">
            <div class="title">
              <div class="s1">Telegram</div>
            </div>
            <input type="text" v-model="telegram" placeholder="Optional" class="words">
            <div class="title">
              <div class="s1">Twitter</div>
            </div>
            <input type="text" v-model="twitter" placeholder="Optional" class="words">
            <div class="title">
              <div class="s1">Initial Buy <em>be the first person to buy your token</em></div>
            </div>
            <div class="txtwrap">
              <input type="text" v-model="initialBuyAmount" placeholder="Optional. Enter the amount"
                     class="words words2">
              <div class="tit"><span>ETH</span><img src="images/rif2.png" alt=""></div>
            </div>
            <button class="send" @click="onClickSubmit" v-loading="loading">Launch</button>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="wrap">
        <p>
          Disclaimer: Digital assets are highly speculative and involve significant risk of loss. The value of meme
          coins is extremely volatile, and anyone who wishes to trade in any meme coin should be prepared for the
          possibility of losing their entire investment. AIPUMP makes no representations or warranties regarding the
          success or profitability of any meme coin developed on the platform. AIPUMP is a public, decentralized, and
          permissionless platform.
        </p>
        <p>
          Participation by any project should not be seen as an endorsement or recommendation by FAIPUMP. Users should
          assess their financial situation, risk tolerance, and do their own research before trading in any meme coins
          on the platform. AIPUMP will not be held liable for any losses, damages, or issues that may arise from trading
          in any meme coins developed on the platform.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-uploader .el-upload {
  height: calc(284 / 1920 * 100vw);
  background: #202038;
  border-radius: calc(10 / 1920 * 100vw);
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  height: 100%;
  width: 100%;
}

.imgfile {
  width: calc(284 / 1920 * 100vw);
  border-radius: calc(10 / 800 * 100vw);
  position: relative;
  overflow: hidden;
}

@media screen and (max-width: 768px) {
  .imgfile {
    height: calc(302 / 800 * 100vw) !important;;
    /* background: #363533; */
    border-radius: calc(10 / 800 * 100vw) !important;;
    position: relative !important;;
    overflow: hidden !important;;
    //left: 0;
    //right: 0;
    width: 100vw !important;
  }
}

</style>