<template>
  <div class="home">
    <HeaderComponent/>
    <div class="index">
      <div class="nums">
        <p><span>1</span><img src="images/ic.png" alt=""><span>AAAA</span></p>
        <p><span>2</span><img src="images/ic.png" alt=""><span>BBBB</span></p>
        <p><span>3</span><img src="images/ic.png" alt=""><span>CCCC</span></p>
        <p><span>4</span><img src="images/ic.png" alt=""><span>DDDD</span></p>
        <p><span>5</span><img src="images/ic.png" alt=""><span>EEEE</span></p>
        <p><span>6</span><img src="images/ic.png" alt=""></p>
      </div>
      <div class="section1">
        <div class="title">
          <img src="images/icon1.png" alt="">
          <span>Create your token</span>
        </div>
        <div class="vals">
          <div class="tit">
            Progress Ranking
            <div class="inputwords">
              <input type="text" placeholder="Enter the Token name or contract address" class="words"
                     v-model="search_for_token"
                     @keyup.enter="onClickSearch">
              <input type="button" value=" " class="send" @click="onClickSearch">
            </div>
          </div>
          <div class="val"><a href="javascript:;" @click="showModal=true">Create Token +</a></div>
        </div>
        <div class="content">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" class="">
            <tr>
              <th>RANK</th>
              <th>TOKEN NAME</th>
              <th>MARKET CAP</th>
              <th>PROGRESS</th>
            </tr>
            <tr
                v-for="item in token_list"
                :key="item.id"
                @click="toDetail(item)">
              <td>1</td>
              <td><img src='images/iconb1.png'>{{ item.name }}</td>
              <td>${{ (item.marketCap * this.eth_price).toFixed(3) }}</td>
              <td>{{ item.bondingCurveProgress.toFixed(2) }}%
                <div class="line">
                  <i :style="{ width: item.bondingCurveProgress + '%' }"></i>
                </div>
              </td>
            </tr>
          </table>
          <div class="pagesize">
            <a href="#"><</a>
            <a href="#" class="current">1</a>
            <a href="#">2</a>
            <a href="#">3</a>
            <a href="#">></a>
          </div>
        </div>
        <div class="desc">
          <p>
            AVAXPUMP is a MEME token launch platform based on the Avalanche Network,
          </p>
          <p>
            currently running in its test version.
          </p>
        </div>
      </div>
      <div class="section2" v-show="token.id!==0">
        <div class="items">
          <div class="left">
            <div class="title">
              <img src="images/ic1.png" alt="">
              <span>Buy/Sell</span>
            </div>
            <div class="content">
              <div class="hd">
                <!--                <a href="javascript:;" class="current">Buy</a>-->
                <!--                <a href="javascript:;">Sell</a>-->

                <a href="javascript:;"
                   :class="{'current': tab === 'buy'}"
                   @click="onClickSelectTab('buy')">Buy</a>
                <a href="javascript:;"
                   :class="{'current': tab === 'sell'}"
                   @click="onClickSelectTab('sell')">Sell</a>

              </div>
              <div class="bd">
                <div class="model">
                  <div class="con1">
                    <div class="s1">Swict to {{ token.symbol }}</div>
                    <div class="s2"></div>
                  </div>
                  <div class="con2">
                    <!--                    <input type="text" placeholder="Ehter the amout" class="words" v-model="amount">-->
                    <input type="number" placeholder="Enter the amount" class="words" v-model="amount"
                           @input="onChangeAmount">

                    <div class="s1" v-show="tab==='buy'">Balance : {{ eth_balance }} AVAX</div>
                    <div class="s1" v-show="tab==='sell'">Balance : {{ token_balance }} {{ token.symbol }}</div>
                    <div class="s2" v-show="tab==='buy'">AVAX</div>
                    <div class="s2" v-show="tab==='sell'">{{ token.symbol }}</div>
                  </div>
                  <div class="con3">
                    <div class="lef" v-show="tab==='sell'">
                      <p @click="onClickPercent(25)">25%</p>
                      <p @click="onClickPercent(50)">50%</p>
                      <p @click="onClickPercent(75)">75%</p>
                      <p @click="onClickPercent(100)">100%</p>
                    </div>
                    <div class="lef" v-show="tab==='buy'">
                      <p @click="onClickAmount(0.1)">0.1</p>
                      <p @click="onClickAmount(0.2)">0.2</p>
                      <p @click="onClickAmount(0.5)">0.5</p>
                      <p @click="onClickAmount(1)">1</p>
                    </div>
                    <div class="rig" v-show="tab==='buy'">
                      AVAX
                    </div>

                    <div class="rig" v-show="tab==='sell'">
                      {{ token.symbol }}
                    </div>
                  </div>
                  <div class="con4" v-show="tab==='buy' && amount>0" v-loading="loading_amount">
                    Expected to get: {{ can_buy_amount.toFixed(10) }} <b>{{ token.symbol }}</b>
                  </div>
                  <div class="con4" v-show="tab==='sell' && amount>0" v-loading="loading_amount">
                    Expected to get: {{ can_sell_amount.toFixed(10) }} ETH
                  </div>
                  <div class="con4" v-show="amount<=0">

                  </div>
                  <button class="send" type="button" @click="onClickTrade" v-loading="loading">Trade</button>
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="title">
              <img src="images/ic2.png" alt="">
              <span>PUMP Platform Interface</span>
            </div>
            <div class="content">
              <div class="content1">
                <div class="tit">Buy/Sell</div>
                <div class="tablelist">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="">
                    <tr>
                      <th>Address</th>
                      <th>Token</th>
                      <th>Quantity</th>
                      <th>Time</th>
                    </tr>
                    <tr v-for="history in history_list" class="green">
                      <td>{{ short_address(history.creatorAddress) }}</td>
                      <td>${{ token.symbol }}</td>
                      <td>{{ history.tokenAmount }}</td>
                      <td>{{ timeAgo(history.createdAt) }}</td>
                    </tr>
                    <!--                    <tr class="red">-->
                    <!--                      <td>0x1455....4454</td>-->
                    <!--                      <td>$AVAXP</td>-->
                    <!--                      <td>45574.1</td>-->
                    <!--                      <td>15.40 12/23</td>-->
                    <!--                    </tr>-->
                  </table>
                </div>
              </div>
              <div class="content2">
                <div class="tit">Exchange Rate</div>
                <div class="tablelist">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" class="">
                    <tr>
                      <th>Token</th>
                      <th>USD</th>
                      <th>AVAX</th>
                    </tr>
                    <tr class="green">
                      <td><img src='images/iconb1.png'>{{ token.symbol }}</td>
                      <td>{{ (token.price * this.eth_price).toFixed(2) }} USD</td>
                      <td>{{ token.price.toFixed(9) }} AVAX</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="alertModel" v-show="showModal">
      <div class="shadow" @click="showModal=false"></div>
      <div class="center">
        <div class="section1">
          <div class="title">
            <img src="images/icon1.png" alt="">
            <span>Create your token</span>
          </div>
          <div class="content2">
            <div class="tar">
              <a href="#">Create Token -</a>
            </div>
            <div class="contents">
              <div class="block1">
                <div class="left">
                  <div class="title">
                    <div class="s1">Image *</div>
                  </div>
                  <el-upload
                      class=""
                      action="https://www.avaxpump.com/upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                  >
                    <!--                    <div class="imgfile">-->
                    <!--                      <div class="title">JPEG/PNG/WEBP/GIF Less Than 4MB</div>-->
                    <!--                      <div class="filesWrap"></div>-->
                    <!--                    </div>-->

                    <div class="imgfile" style="">
                      <div class="title" v-if="!imageUrl">JPEG/PNG/WEBP/GIF Less Than 4MB</div>
                      <div class="filesWrap" v-if="!imageUrl"></div>
                      <img v-if="imageUrl" :src="imageUrl" class="avatar" alt=""/>
                    </div>
                  </el-upload>
                </div>
                <div class="right">
                  <div class="title">
                    <div class="s1">Token Name *</div>
                    <div class="s2">{{ tokenName.length }}/20</div>
                  </div>
                  <input type="text" class="words" v-model="tokenName" maxlength="20">
                  <div class="title">
                    <div class="s1">Token Symbol ($Ticker) *</div>
                    <div class="s2">{{ tokenSymbol.length }}/10</div>
                  </div>
                  <input type="text" class="words" v-model="tokenSymbol" maxlength="10">
                  <div class="title">
                    <div class="s1">Initial price *</div>
                    <div class="s2">{{ initialBuyAmount.length }}/10</div>
                  </div>
                  <div class="inputs">
                    <input type="text" placeholder="0" class="words" v-model="initialBuyAmount" maxlength="10">
                    <button class="max" type="button">AVAX</button>
                  </div>
                </div>
              </div>
              <div class="block2">
                <div class="title">
                  <div class="s1">Token Description *</div>
                  <div class="s2">{{ tokenDescription.length }}/256</div>
                </div>
                <textarea name="" class="txt" id="" v-model="tokenDescription" maxlength="256"></textarea>
                <button class="send" @click="onClickSubmit">Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-carousel {
  width: 100%;
  height: auto; /* 允许高度自适应 */
  aspect-ratio: 799 / 337; /* 保持宽高比 */
  margin-bottom: 16px;
}

.el-carousel-item {
  width: 100%;
  height: auto; /* 允许高度自适应 */
  aspect-ratio: 799 / 337; /* 保持宽高比 */
}

.el-carousel img {
  width: 100%; /* 确保图片宽度为100% */
  height: auto; /* 允许高度自适应 */
  object-fit: fill; /* 保持图片比例，裁剪多余部分 */
}

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

<script>
// @ is an alias to /src

import router from "@/router";
import axios from '../utils/axios';
import {short_address, timeAgo} from "@/utils/utils";
import {ElMessage, ElUpload, ElIcon} from "element-plus";
import {mapState} from "vuex";
import {getSigner} from "@/utils/wallet";
import {ethers} from "ethers";
import {factory_address, weth_address} from "@/store";
import {FactoryAbi} from "@/store/TokenFactory"; // 引入你创建的 Axios 实例
import HeaderComponent from "@/components/HeaderComponent.vue";
import {Plus} from '@element-plus/icons-vue';
import {bondingCurve, default_provider, factory, uni_factory_contract} from "@/utils/ethRpc";
import {TokenAbi} from "@/store/TokenAbi";
import {PairAbi} from "@/store/PairAbi";
import {ChainId, CurrencyAmount, Percent, Token, TradeType} from "@uniswap/sdk-core";
import {Pair, Route, Trade} from "@uniswap/v2-sdk";

export default {
  name: 'HomeView',
  components: {
    ElUpload,
    HeaderComponent,
    ElMessage,
    ElIcon,
    Plus
  },
  computed: {
    ...mapState(['wallet_address', 'wallet_type']), // 映射 state
  },
  data: function () {
    return {
      page: 1,
      pageSize: 8,
      token_list: [],
      eth_price: 0,
      totalPages: 0,
      carousels: [],
      search_for_token: "",
      showModal: false,


      imageUrl: '',
      tokenName: '',
      tokenSymbol: '',
      tokenDescription: '',
      website: '',
      telegram: '',
      twitter: '',
      initialBuyAmount: '',
      loading: false,

      holders: [],
      token: {
        id: 0,
        name: 'Loading...',
        symbol: 'LD',
        creatorAddress: 'N/A',
        iconUrl: '',
        price: 0,
        marketCap: 0,
        bondingCurveProgress: 0,
        remain: 0,
        collateral: 0,
        state: '',
        virtualLiquidity: 0,
        VolumeIn24: 0,
        rise: 0
      },
      tab: 'buy',
      eth_balance: 0,
      token_balance: 0,
      slippage_tolerance: 5,
      amount: 0,
      history_list: [],

      can_buy_amount: 0,
      can_sell_amount: 0,
      loading_amount: false,
    }
  },
  methods: {
    timeAgo,
    short_address,
    toDetail(item) {
      // router.push('/detail?token=' + item.tokenAddress)
      this.token_address = item.tokenAddress
      this.loadDetail(item.tokenAddress)
    },

    handleAvatarSuccess(response, uploadFile) {
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
    },
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

      } finally {
        this.loading = false

      }
    },

    async loadDetail(address) {
      const load_resp = await axios.get("/api/token/" + address);
      if (load_resp.data.code === 0) {
        this.token = load_resp.data.data.token;
        this.eth_price = load_resp.data.data.eth_price;
        // this.render();
        // await this.loadComment(address);
        await this.loadHistory(address);
      }
      // const url = "/api/token_price/" + this.token_address + "?duration=" + 60 * 15 + "&amount=25"
      // const load_price_resp = await axios.get(url);
      // this.render(load_price_resp.data.data.formattedData)
    },


    async onClickSearch() {
      if (this.search_for_token) {
        const load_resp = await axios.get("/api/token/" + this.search_for_token);
        if (load_resp.data.code === 0 && load_resp.data.data.token != null) {
          await router.push('/detail?token=' + this.search_for_token)
        } else {
          ElMessage.error("Token not found")
        }
      }
    },
    async load() {
      const load_resp = await axios.post('/api/token_list', {
        page: this.page,
        pageSize: this.pageSize
      })
      if (load_resp.data.code === 0) {
        this.token_list = load_resp.data.data.tokens
        this.eth_price = load_resp.data.data.eth_price;
        this.totalPages = Math.ceil(load_resp.data.data.total / this.pageSize); // Calculate total pages
      }
      const load_carousel_resp = await axios.get('/api/carousel');
      if (load_carousel_resp.data.code === 0) {
        this.carousels = load_carousel_resp.data.data.carousels;
      }
    },
    changePage(newPage) {
      if (newPage < 1 || newPage > this.totalPages) {
        return; // Prevent going out of bounds
      }
      this.page = newPage;
      this.load(); // Reload the data for the new page
    },
    onClickSelectTab(tab) {
      this.tab = tab
    },
    onClickAmount(amt) {
      this.amount = amt;
      this.onChangeAmount()
    },
    async onChangeAmount() {
      try {
        // if (this.loading_amount) {
        //   return;
        // }
        this.loading_amount = true;
        if (this.tab === 'buy' && this.token.state === 'FUNDING') {
          await this.refreshCanBuyAmount()
        }
        if (this.tab === 'sell' && this.token.state === 'FUNDING') {
          await this.refreshCanSellAmount()
        }
        if (this.tab === 'buy' && this.token.state === 'TRADING') {
          await this.refreshCanBuyOnUni()
        }
        if (this.tab === 'sell' && this.token.state === 'TRADING') {
          await this.refreshCanSellOnUni()
        }
      } finally {
        this.loading_amount = false;
      }
    },
    async onClickTrade() {
      console.log('onClickTrade', this.token_address)
      if (!this.wallet_address) {
        ElMessage.error('Please connect wallet first.');
        return;
      }

      if (this.loading) {
        return
      }
      this.loading = true

      try {

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

        if (this.tab === 'buy' && this.token.state === 'FUNDING') {
          const tx = await factory.buy(this.token_address, {
            value: ethers.parseEther(this.amount.toString())
          });
          console.log('tx', tx.hash)
          ElMessage.success('Transaction submitted: ' + tx.hash);
          const receipt = await tx.wait();
          console.log('receipt', receipt)
          if (receipt.status === 1) {
            ElMessage.success('Transaction confirmed');
            await axios.post('/api/create_history', {
              tradeType: this.tab,
              tokenAddress: this.token_address,
              txid: tx.hash,
              amount: this.amount,
              state: this.token.state,
              creatorAddress: this.wallet_address
            })
          }
        } else if (this.tab === 'sell' && this.token.state === 'FUNDING') {
          const amount_in_wei = ethers.parseEther(this.amount.toString()).toString();
          console.log('amount_in_wei', amount_in_wei)
          const tx = await factory.sell(this.token_address, amount_in_wei, {})
          ElMessage.success('Transaction submitted: ' + tx.hash);
          const receipt = await tx.wait();
          console.log('receipt', receipt)
          if (receipt.status === 1) {
            ElMessage.success('Transaction confirmed');
            await axios.post('/api/create_history', {
              tradeType: this.tab,
              tokenAddress: this.token_address,
              txid: tx.hash,
              amount: this.amount,
              state: this.token.state,
              creatorAddress: this.wallet_address
            })
          }
        } else if (this.tab === 'buy' && this.token.state === 'TRADING') {
          let tx = await this.outerBuy()
          ElMessage.success('Transaction submitted: ' + tx.hash);
          const receipt = await tx.wait();
          console.log('receipt', receipt)
          if (receipt.status === 1) {
            ElMessage.success('Transaction confirmed');
            await axios.post('/api/create_history', {
              tradeType: this.tab,
              tokenAddress: this.token_address,
              txid: tx.hash,
              amount: this.amount,
              state: this.token.state,
              creatorAddress: this.wallet_address
            })
          }
        } else if (this.tab === 'sell' && this.token.state === 'TRADING') {
          let tx = await this.outerSell()
          ElMessage.success('Transaction submitted: ' + tx.hash);
          const receipt = await tx.wait();
          console.log('receipt', receipt)
          if (receipt.status === 1) {
            ElMessage.success('Transaction confirmed');
            await axios.post('/api/create_history', {
              tradeType: this.tab,
              tokenAddress: this.token_address,
              txid: tx.hash,
              amount: this.amount,
              state: this.token.state,
              creatorAddress: this.wallet_address
            })
          }
        }
        this.loading = false;
      } catch (e) {
        // ElMessage.error('Error: ' + e);
        console.log(e)
        if (e.reason) {
          ElMessage.error(e.reason)
        } else if (e.shortMessage) {
          ElMessage.error(("Transaction failed: " + e.shortMessage));
        }

        this.loading = false;
      } finally {
        this.loading = false
      }
    },
    async loadHistory(address) {
      const load_resp = await axios.post("/api/history_list", {
        page: this.page,
        pageSize: this.pageSize,
        tokenAddress: this.token_address
      });
      if (load_resp.data.code === 0) {
        this.history_list = load_resp.data.data.histories;
      }
    },
    async loadEthBalance() {
      try {
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

        const balanceBigNumber = await provider.getBalance(this.wallet_address);
        const balance = ethers.formatEther(balanceBigNumber); // Format balance to Ether
        this.eth_balance = (Number)(balance);
        // console.log('Balance:', balance);
      } catch (error) {
        console.error('Error loading ETH balance:', error);
      }
    },
    async loadErc20Balance(tokenAddress) {
      try {
        if (!this.wallet_address) {
          return;
        }
        if (!tokenAddress) {
          return;
        }
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

        // Create a contract instance for the ERC20 token
        const erc20Abi = [
          // Only include the balanceOf function in the ABI
          "function balanceOf(address owner) view returns (uint256)"
        ];
        const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);

        // Fetch the ERC20 balance
        const balanceBigNumber = await tokenContract.balanceOf(this.wallet_address);
        const balance = ethers.formatUnits(balanceBigNumber, 18); // Format balance to token's decimal (assuming 18 decimals)
        this.token_balance = Number(balance);

        // console.log('ERC20 Balance:', balance);
      } catch (error) {
        console.error('Error loading ERC20 balance:', error);
      }
    },
    async refreshCanBuyAmount() {
      const collateralAmount = await factory.collateral(this.token_address);
      console.log(`Current collateral for token: ${ethers.formatEther(collateralAmount)} ETH`);

      // 计算价格逻辑
      const token = new ethers.Contract(this.token_address, TokenAbi, default_provider);
      const totalSupply = await token.totalSupply(); // token 合约需要传入

      //这表示0.1个可以买到多少token
      const value = ethers.parseEther(this.amount.toString()).toString()
      const price_in_token_bn = await bondingCurve.getAmountOut(totalSupply, value);
      const price_in_token = ethers.formatEther(price_in_token_bn);

      // return price_in_token.toString();
      this.can_buy_amount = (Number)(price_in_token.toString())
    },
    async refreshCanSellAmount() {
      const token = new ethers.Contract(this.token_address, TokenAbi, default_provider);
      const totalSupply = await token.totalSupply(); // token 合约需要传入

      const value = ethers.parseEther(this.amount.toString()).toString()
      const price_in_token_bn = await bondingCurve.getFundsReceived(totalSupply, value);

      const price_in_token = ethers.formatEther(price_in_token_bn);

      // return price_in_token.toString();
      this.can_sell_amount = (Number)(price_in_token.toString())
    },
    async refreshCanBuyOnUni() {
      const decimals = 18;
      const token_contract = new ethers.Contract(this.token_address, TokenAbi, default_provider);
      const pair_address = await uni_factory_contract.getPair(this.token_address, weth_address);
      console.log('pair_address', pair_address);

      const pairContract = new ethers.Contract(pair_address, PairAbi, default_provider);

      const reserves = await pairContract.getReserves();
      const reserve0 = reserves[0];
      const reserve1 = reserves[1];
      console.log('reserves', reserves);

      // Determine which reserve corresponds to which token
      const token0 = await pairContract.token0();
      const token1 = await pairContract.token1();

      let tokenReserve, wethReserve;

      if (this.token_address.toLowerCase() === token0.toLowerCase()) {
        tokenReserve = reserve0;
        wethReserve = reserve1;
      } else {
        tokenReserve = reserve1;
        wethReserve = reserve0;
      }

      const weth = new Token(ChainId.BASE, weth_address, decimals, "weth", "weth");
      const unknown = new Token(ChainId.BASE, this.token_address, decimals, this.token.symbol, this.token.name);

      const WETH_TOKEN = new Pair(
          CurrencyAmount.fromRawAmount(weth, wethReserve.toString()),
          CurrencyAmount.fromRawAmount(unknown, tokenReserve.toString()),
      );


      const WETH_TO_TOKEN = new Route([WETH_TOKEN], weth, unknown);
      const eth_in = ethers.parseEther(this.amount.toString()).toString();
      console.log('eth_in', eth_in);
      const trade = new Trade(WETH_TO_TOKEN, CurrencyAmount.fromRawAmount(weth, eth_in), TradeType.EXACT_INPUT);

      const slippageTolerance = new Percent(this.slippage_tolerance.toString(), '100'); // 5% slippage
      const minimumAmountOut = trade.minimumAmountOut(slippageTolerance);
      // console.log('minimumAmountOut',minimumAmountOut)
      const amountOut = minimumAmountOut.toSignificant(6);
      this.can_buy_amount = (Number)(amountOut);
    },
    async refreshCanSellOnUni() {
      const decimals = 18;
      const token_contract = new ethers.Contract(this.token_address, TokenAbi, default_provider);
      const pair_address = await uni_factory_contract.getPair(this.token_address, weth_address);
      console.log('pair_address', pair_address);

      const pairContract = new ethers.Contract(pair_address, PairAbi, default_provider);
      const reserves = await pairContract.getReserves();
      const reserve0 = reserves[0];
      const reserve1 = reserves[1];
      console.log('reserves', reserves);

      // Determine which reserve corresponds to which token
      const token0 = await pairContract.token0();
      const token1 = await pairContract.token1();

      let tokenReserve, wethReserve;

      if (this.token_address.toLowerCase() === token0.toLowerCase()) {
        tokenReserve = reserve0;
        wethReserve = reserve1;
      } else {
        tokenReserve = reserve1;
        wethReserve = reserve0;
      }

      const weth = new Token(ChainId.BASE, weth_address, decimals, "weth", "weth");
      const unknown = new Token(ChainId.BASE, this.token_address, decimals, this.token.symbol, this.token.name);

      const TOKEN_WETH = new Pair(
          CurrencyAmount.fromRawAmount(unknown, tokenReserve.toString()),
          CurrencyAmount.fromRawAmount(weth, wethReserve.toString())
      );

      const TOKEN_TO_WETH = new Route([TOKEN_WETH], unknown, weth);
      const token_in = ethers.parseEther(this.amount.toString()).toString();
      console.log('token_in', token_in);
      const trade = new Trade(TOKEN_TO_WETH, CurrencyAmount.fromRawAmount(unknown, token_in), TradeType.EXACT_INPUT);

      const slippageTolerance = new Percent(this.slippage_tolerance.toString(), '100'); // 5% slippage
      const minimumAmountOut = trade.minimumAmountOut(slippageTolerance);
      // console.log('minimumAmountOut',minimumAmountOut)
      const amountOut = minimumAmountOut.toSignificant(6);
      this.can_sell_amount = (Number)(amountOut);
    },
    onClickPercent(pct) {
      if (pct === 100) {
        pct = 99;
      }
      this.amount = Math.ceil(this.token_balance * pct / 100);
      this.onChangeAmount()
    },
  },
  mounted() {
    this.load()

    //从querystring中获取到invitor参数
    const invitor = new URLSearchParams(window.location.search).get("invitor");
    console.log("invitor", invitor)
    if (invitor) {
      //保存到localstore
      localStorage.setItem("invitor", invitor)
    }

    setInterval(() => {
      if (this.wallet_address) {
        this.loadEthBalance()
        this.loadErc20Balance(this.token_address);
      }
    }, 1000);

  }
}
</script>
