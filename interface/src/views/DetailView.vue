<template>
  <div>
    <HeaderComponent/>
    <div class="index">
      <div class="section5">
        <div class="wrap">
          <router-link to="/" class="back">Back</router-link>
          <div class="content1 shadow">
            <div class="imgbox"><img :src="token.iconUrl" alt=""></div>
            <div class="right">
              <div class="title">{{ token.name }} ({{ token.symbol }})</div>
              <div class="dec">
                <p>
                  CA: {{ token_address }}
                  <span class="copy" @click="onClickCopyAddress"></span>
                </p>
                <p>
                  Description: {{ token.description }}
                </p>
              </div>
              <div class="link">
                <a :href="token.website" target="_blank" v-if="token.website"><img src="images/o1.png" alt=""></a>
                <a :href="token.twitter" target="_blank" v-if="token.twitter"><img src="images/o2.png" alt=""></a>
                <a :href="token.telegram" target="_blank" v-if="token.telegram"><img src="images/o3.png" alt=""></a>
              </div>
              <div class="list">
                <p>
                  <span class="s1">Price</span>
                  <span class="s2">{{ token.price.toFixed(10) }} ETH</span>
                </p>
                <p>
                  <span class="s1">Market Cap</span>
                  <span class="s2">${{ (token.marketCap * this.eth_price).toFixed(3) }}</span>
                </p>
                <p>
                  <span class="s1">Virtual Liquidity</span>
                  <span class="s2">${{ token.virtualLiquidity }}</span>
                </p>
                <p>
                  <span class="s1">24H Volume</span>
                  <span class="s2">{{ token.VolumeIn24 }} ETH</span>
                </p>
                <p>
                  <span class="s1">Rise</span>
                  <span class="s2"><b>+ {{ token.rise }}%</b></span>
                </p>
              </div>
            </div>
          </div>
          <div class="content2">
            <div class="left">
              <div class="block1 shadow">
                <div class="title"><img src="images/tic2.png" alt=""><span>{{ token.symbol }} / ETH</span></div>
                <div class="hd">
                  <a href="javascript:;" @click="reRender(60)">1m</a>
                  <a href="javascript:;" @click="reRender(60*5)">5m</a>
                  <a href="javascript:;" @click="reRender(60*15)">15m</a>
                  <a href="javascript:;" @click="reRender(60*60)">1h</a>
                  <a href="javascript:;" @click="reRender(60*60*4)">4h</a>
                  <a href="javascript:;" @click="reRender(60*60*24)">1d</a>
                </div>
                <div class="dec">
                  <!--                  Time: 2024-11-30 16:00 O: 0.0{8}129 H: 0.048}148 L: 0.0{8}129 C: 0.0{8}148 Volume: 0.10-->
                </div>
                <div class="imgbox">
                  <div class="lw-chart" ref="chartContainer"></div>
                </div>
                <!--                <div class="date">2024-11-30 15:45</div>-->
              </div>
              <div class="block2">
                <div class="titHd">
                  <a href="javascript:;"
                     :class="{'current': tab2 === 'comment'}"
                     @click="tab2='comment'">
                    <img src="images/ir1.png" alt="">
                    <span>Comments</span>
                  </a>
                  <a href="javascript:;"
                     :class="{'current': tab2 === 'history'}"
                     @click="tab2='history'">
                    <img src="images/ir2.png" alt="">
                    <span>Trading History</span>
                  </a>
                </div>
                <div v-show="tab2==='comment'" class="bd shadow">
                  <div class="model">
                    <div class="bdmodel1">
                      <div class="contxt">
                        <textarea
                            v-model="comment"
                            @input="handleCommentInput"
                            placeholder="Write your comments"
                            :maxlength="maxCommentLength">
                        </textarea>
                        <div class="total">{{ commentLength }} / {{ maxCommentLength }}</div>
                        <button type="button" class="btn" @click="submitComment">Submit</button>
                      </div>
                      <div class="items">
                        <div class="item" v-for="(item, index) in comments" :key="index">
                          <div class="txt">
                            <div class="tis">{{ short_address(item.creatorAddress) }}</div>
                            <div class="time">{{ item.createdAt }}</div>
                          </div>
                          <div class="dec">{{ item.content }}</div>
                        </div>
                      </div>
                      <div class="more">
                        <a href="javascript:;">Load more</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="tab2==='history'" class="bd shadow">
                  <div class="model">
                    <div class="bdmodel2">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" class="">
                        <tr>
                          <th>ACCOUNT</th>
                          <th>USD</th>
                          <th>ETH</th>
                          <th>{{ this.token.symbol }}</th>
                          <th>DATE</th>
                          <th>TXN</th>
                        </tr>
                        <tr v-for="history in history_list">
                          <td>{{ short_address(history.creatorAddress) }}</td>
                          <td>{{ (history.ethAmount * this.eth_price).toFixed(1) }}</td>
                          <td>{{ history.ethAmount.toFixed(2) }}</td>
                          <td>{{ formatNumber(history.tokenAmount) }}</td>
                          <td>{{ timeAgo(history.createdAt) }}</td>
                          <td><a :href="'https://basescan.org/tx/'+history.txid" class="share"></a></td>
                        </tr>
                      </table>
                      <div class="more"><a href="#">Load more</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right">
              <div class="block1 shadow">
                <div class="hd">
                  <a href="javascript:;"
                     :class="{'current': tab === 'buy'}"
                     @click="onClickSelectTab('buy')">Buy</a>
                  <a href="javascript:;"
                     :class="{'current': tab === 'sell'}"
                     @click="onClickSelectTab('sell')">Sell</a>
                </div>
                <div class="bd">
                  <div class="model">
                    <div class="bl1">
                      <div class="tit">Switch to ETH</div>
                      <a href="javascript:;" class="set" @click="onClickShow"></a>
                    </div>
                    <div class="bl2">
                      <div class="lef">
                        <input type="number" placeholder="Enter the amount" class="s1" v-model="amount"
                               @input="onChangeAmount">
                        <div class="s2" v-show="tab==='buy'">Balance : {{ eth_balance }} ETH</div>
                        <div class="s2" v-show="tab==='sell'">Balance : {{ token_balance.toFixed(3) }} {{
                            token.symbol
                          }}
                        </div>
                      </div>
                      <div class="ri" v-show="tab==='buy'">
                        ETH <img src="images/tic2.png" alt="">
                      </div>
                      <div class="ri" v-show="tab==='sell'">
                        {{ token.symbol }} <img src="images/tic2.png" alt="">
                      </div>
                    </div>
                    <div class="bl3">
                      <div class="le" v-show="tab==='sell'">
                        <span @click="onClickPercent(25)">25%</span>
                        <span @click="onClickPercent(50)">50%</span>
                        <span @click="onClickPercent(75)">75%</span>
                        <span @click="onClickPercent(100)">100%</span>
                      </div>
                      <div class="le" v-show="tab==='buy'">
                        <span @click="onClickAmount(0.1)">0.1</span>
                        <span @click="onClickAmount(0.2)">0.2</span>
                        <span @click="onClickAmount(0.5)">0.5</span>
                        <span @click="onClickAmount(1)">1</span>
                      </div>
                      <div class="ri" v-show="tab==='buy'">
                        ETH
                      </div>
                    </div>
                    <div class="can_buy" v-show="tab==='buy' && amount>0" v-loading="loading_amount">
                      {{ can_buy_amount.toFixed(10) }} {{ token.symbol }}
                    </div>
                    <div class="can_buy" v-show="tab==='sell' && amount>0" v-loading="loading_amount">
                      {{ can_sell_amount.toFixed(10) }} ETH
                    </div>
                    <a href="javascript:;" class="trade" @click="onClickTrade" v-loading="loading">Trade</a>
                  </div>
                </div>
              </div>
              <div class="block2">
                <div class="title">Bonding Curve Progress: {{ token.bondingCurveProgress.toFixed(3) }}%</div>
                <div class="line">
                  <i :style="{ width: token.bondingCurveProgress + '%' }"></i>
                </div>
                <div class="dec">
                  <p>
                    There are <b>{{ token.remain.toFixed(3) }} {{ token.symbol }}</b> still available for sale in the
                    bonding curve
                    and there are <b>
                    {{ (FUNDING_GOAL - token.collateral).toFixed(3) }} ETH</b> in the bonding curve.
                  </p>
                  <p>
                    When the market cap reaches <b>{{ FUNDING_GOAL }} ETH</b> all the liquidity from the bonding curve
                    will be
                    deposited into UniSwap and burned. Progression increases as the price goes up.
                  </p>
                </div>
              </div>
              <div class="block3">
                <div class="title">Holder Distribution</div>
                <div class="con shadow">
                  <div class="tit">
                    <div class="s1">Holder</div>
                    <div class="s2">Percentage</div>
                  </div>
                  <div class="list">
                    <p v-for="holder in holders">
                      <span class="s1">{{ short_address(holder.TokenHolderAddress) }}</span>
                      <span class="s2">{{ holder.Proportion }}</span>
                    </p>
                  </div>
                  <div class="more">
                    <a href="#">Load more</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="wrap">
        <p>
          Disclaimer: Digital assets are highly speculative and involve significant risk of loss. The value of meme
          coins is extremely volatile, and any one who wishes to trade in any meme coin should be prepared for the
          possibility of losing their entire investment. BUMP makes no representations or warranties regarding the
          success or profitability of any meme coin developed on the platform. BUMP is a public, decentralized, and
          permissionless platform.
        </p>
        <p>
          Participation by any project should not be seen as an endorsement or recommendation by BUMP . Users should
          assess their financial situation, risk tolerance, and do their own research before trading in any meme coins
          on the platform. BUMP will not be held liable for any losses, damages, or issues that may arise from trading
          in any meme coins developed on the platform.
        </p>
      </div>
    </div>

    <div class="alertModel" v-show="isVisible">
      <div class="shadowMl"></div>
      <div class="center">
        <div class="content3">
          <div class="close" @click="onClickClose"></div>
          <div class="title">Swap Config</div>
          <div class="con">
            <div class="title2">Max Slippage</div>
            <input type="text" v-model="slippage_tolerance" class="words">
            <div class="dec">Modify the max slippages for your trades. Default: 5%</div>
            <div class="title3">MEV protection</div>
            <div class="dec2">
              <p>After MEV protection is turned on, front-running and sandwich attacks will be effectively
                prevented. </p>
              <p>(Metamask wallet only)</p>
            </div>
            <button class="send" type="button" @click="onClickSave">Save</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import {createChart} from "lightweight-charts";
import axios from "@/utils/axios";
import {ElMessage} from "element-plus";
import {mapState} from "vuex";
import {ethers} from "ethers";
import {
  factory_address,
  FUNDING_GOAL,
  uni_factory_address,
  uni_router_address,
  weth_address
} from "@/store";
import {FactoryAbi} from "@/store/TokenFactory";
import {UniswapV2FactoryAbi} from "@/store/UniswapV2FactoryAbi";
import {formatNumber, short_address, timeAgo} from "../utils/utils";
import {getSigner} from "@/utils/wallet";
import {UniswapV2Router02Abi} from "@/store/UniswapV2Router02Abi";
import {ChainId, CurrencyAmount, Percent, Token, TradeType,} from '@uniswap/sdk-core'
import {Trade, Route, Pair} from '@uniswap/v2-sdk'
import {TokenAbi} from "@/store/TokenAbi";
import {PairAbi} from "@/store/PairAbi";
import {bondingCurve, default_provider, factory, uni_factory_contract} from "@/utils/ethRpc";

export default {
  name: "DetailView",
  components: {HeaderComponent},
  computed: {
    ...mapState(['wallet_address', 'wallet_type']), // 映射 state
    connected() {
      if (this.wallet_address) {
        return this.wallet_address.substr(0, 6) + '...' + this.wallet_address.substr(-4)
      } else {
        return 'Connect Wallet'
      }
    },
    FUNDING_GOAL() {
      return FUNDING_GOAL;
    },

  },
  mounted() {
    this.token_address = this.$route.query.token;
    console.log('Retrieved ID:', this.token_address);

    this.load(this.token_address);
    this.loadHolder(this.token_address);

    setInterval(() => {
      if (this.wallet_address) {
        this.loadEthBalance()
        this.loadErc20Balance(this.token_address);
      }
    }, 1000);

  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.remove();
      this.chart = null;
    }
  },
  data() {
    return {
      token: {
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
      can_buy_amount: 0,
      can_sell_amount: 0,
      comment: '', // New property for comment input
      commentLength: 0, // To track the length of the comment
      maxCommentLength: 256, // Maximum allowed length
      comments: [], // To hold submitted comments
      tab: 'buy',
      amount: 0,
      page: 1,
      pageSize: 10,
      token_address: "",
      eth_balance: 0,
      token_balance: 0,
      slippage_tolerance: 5,
      eth_price: 0,
      holders: [],
      isVisible: false,
      tab2: 'comment',
      loading: false,
      loading_amount: false,
    };
  },
  methods: {
    formatNumber,
    timeAgo,
    async onChangeAmount() {
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
      this.loading_amount = false;
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
    onClickSave() {
      this.isVisible = false;
    },
    onClickShow() {
      this.isVisible = true;
    },
    onClickClose() {
      this.isVisible = false;
    },
    short_address,
    async outerBuy() {
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

        const decimals = 18;

        const uni_factory_contract = new ethers.Contract(uni_factory_address, UniswapV2FactoryAbi, signer);
        const pair_address = await uni_factory_contract.getPair(weth_address, this.token_address);
        console.log('pair_address', pair_address);


        const weth = new Token(ChainId.BASE, weth_address, decimals, "weth", "weth");
        const unknown = new Token(ChainId.BASE, this.token_address, decimals, this.token.symbol, this.token.name);

        const pairContract = new ethers.Contract(pair_address, PairAbi, signer);
        const reserves = await pairContract.getReserves()
        const reserve0 = reserves[0]
        const reserve1 = reserves[1]
        console.log('reserves', reserves)

        const WETH_UNKNOWN = new Pair(
            CurrencyAmount.fromRawAmount(weth, reserve0.toString()),
            CurrencyAmount.fromRawAmount(unknown, reserve1.toString())
        );

        const WETH_TO_UNKNOWN = new Route([WETH_UNKNOWN], weth, unknown);
        const trade = new Trade(WETH_TO_UNKNOWN, CurrencyAmount.fromRawAmount(weth, ethers.parseEther(this.amount.toString()).toString()), TradeType.EXACT_INPUT);

        console.log('trade', trade);

        // Set slippage tolerance to 5%
        const slippageTolerance = new Percent(this.slippage_tolerance.toString(), '100'); // 5% slippage
        const minimumAmountOut = trade.minimumAmountOut(slippageTolerance);
        const amountOut = ethers.parseUnits(minimumAmountOut.toSignificant(6), decimals); // Amount of tokens to receive

        const path = [weth_address, this.token_address];

        // Initiate the transaction
        const router = new ethers.Contract(uni_router_address, UniswapV2Router02Abi, signer);

        console.log('params', [
          amountOut,
          path,
          this.wallet_address,
          Math.floor(Date.now() / 1000) + 60 * 20,
          {
            value: ethers.parseEther(this.amount.toString()).toString()
          }
        ]);

        const tx = await router.swapExactETHForTokens(
            amountOut,
            path,
            this.wallet_address,
            Math.floor(Date.now() / 1000) + 60 * 20,
            {
              value: ethers.parseEther(this.amount.toString()).toString()
            }
        );

        return tx;

      } catch (e) {
        console.error('Error:', e);
        ElMessage.error('Error: ' + e);
      }
    },
    async outerSell() {
      try {
        const signerInfo = await getSigner(this.wallet_type); // Get the signer information
        let provider, signer;

        if (Array.isArray(signerInfo) && signerInfo.length === 2) {
          [provider, signer] = signerInfo;
        } else {
          throw new Error('getSigner() did not return an array with provider and signer');
        }

        if (!this.wallet_address) {
          throw new Error('Wallet address is not defined');
        }

        const decimals = 18;
        const uni_factory_contract = new ethers.Contract(uni_factory_address, UniswapV2FactoryAbi, signer);
        const pair_address = await uni_factory_contract.getPair(this.token_address, weth_address);
        console.log('pair_address', pair_address);

        const token_contract = new ethers.Contract(this.token_address, TokenAbi, signer);
        const token_balance = await token_contract.balanceOf(this.wallet_address);
        console.log("token_balance", token_balance)

        // Check allowance
        const router = new ethers.Contract(uni_router_address, UniswapV2Router02Abi, signer);
        const allowance = await token_contract.allowance(this.wallet_address, uni_router_address);
        console.log("allowance", allowance)

        const weth = new Token(ChainId.BASE, weth_address, decimals, "weth", "weth");
        const unknown = new Token(ChainId.BASE, this.token_address, decimals, this.token.symbol, this.token.name);

        if ((Number)(ethers.formatEther(allowance).toString()) < this.amount) {
          // If allowance is insufficient, approve the router
          const txApprove = await token_contract.approve(uni_router_address, ethers.MaxUint256);
          console.log('Approval transaction hash:', txApprove.hash);
          ElMessage.success('Approval submitted: ' + txApprove.hash);
          await txApprove.wait(); // Wait for the approval transaction to be mined
          console.log('Approval confirmed');
          ElMessage.success('Approval confirmed');
        }

        const pairContract = new ethers.Contract(pair_address, PairAbi, signer);
        const reserves = await pairContract.getReserves();
        const reserve0 = reserves[0];
        const reserve1 = reserves[1];
        console.log('reserves', reserves);

        const TOKEN_WETH = new Pair(
            CurrencyAmount.fromRawAmount(unknown, reserve1.toString()),
            CurrencyAmount.fromRawAmount(weth, reserve0.toString())
        );

        const TOKEN_TO_WETH = new Route([TOKEN_WETH], unknown, weth);
        const token_in = ethers.parseEther(this.amount.toString()).toString();
        console.log('token_in', token_in);
        const trade = new Trade(TOKEN_TO_WETH, CurrencyAmount.fromRawAmount(unknown, token_in), TradeType.EXACT_INPUT);

        console.log('trade', trade);

        // Set slippage tolerance to 5%
        const slippageTolerance = new Percent(this.slippage_tolerance.toString(), '100'); // 5% slippage
        const minimumAmountOut = trade.minimumAmountOut(slippageTolerance);
        const amountOut = ethers.parseUnits(minimumAmountOut.toSignificant(6), decimals); // Amount of WETH to receive

        const path = [this.token_address, weth_address];

        // Initiate the transaction
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

        console.log('params', [
          ethers.parseEther(this.amount.toString()).toString(),
          amountOut,
          path,
          this.wallet_address,
          deadline,
          {}
        ]);

        const tx = await router.swapExactTokensForETH(
            ethers.parseEther(this.amount.toString()).toString(),
            0, // amountOut
            path,
            this.wallet_address,
            deadline,
            {
              // gasLimit: 1_000_000_000
            }
        );

        return tx;

      } catch (e) {
        console.error('Error:', e);
        ElMessage.error('Error: ' + e);
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
    async loadHolder(tokenAddress) {
      const url = '/api/holder/' + tokenAddress;
      const resp = await axios.get(url);
      if (resp.data.code === 0) {
        this.holders = resp.data.data;
      }
    },
    async loadErc20Balance(tokenAddress) {
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
    onClickPercent(pct) {
      if (pct === 100) {
        pct = 99;
      }
      this.amount = Math.ceil(this.token_balance * pct / 100);
      this.onChangeAmount()
    },
    onClickAmount(amt) {
      this.amount = amt;
      this.onChangeAmount()
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
    onClickSelectTab(tab) {
      this.tab = tab
    },
    async load(address) {
      const load_resp = await axios.get("/api/token/" + address);
      if (load_resp.data.code === 0) {
        this.token = load_resp.data.data.token;
        this.eth_price = load_resp.data.data.eth_price;
        // this.render();
        await this.loadComment(address);
        await this.loadHistory(address);
      }
      const url = "/api/token_price/" + this.token_address + "?duration=" + 60 * 15 + "&amount=25"
      const load_price_resp = await axios.get(url);
      this.render(load_price_resp.data.data.formattedData)
    },
    async loadComment(address) {
      const load_resp = await axios.post("/api/comment_list", {
        page: this.page,
        pageSize: this.pageSize,
        tokenAddress: this.token_address
      });
      if (load_resp.data.code === 0) {
        this.comments = load_resp.data.data.comments;
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
    async reRender(duration) {
      const url = "/api/token_price/" + this.token_address + "?duration=" + duration + "&amount=25"
      const load_price_resp = await axios.get(url);
      this.render(load_price_resp.data.data.formattedData)
    },
    render(data) {
      if (!this.$refs.chartContainer) {
        console.log('Render failed: chart container is not available.');
        return;
      }


      console.log('Rendering chart with data:', data);

      this.$refs.chartContainer.innerHTML = '';


      const chart = createChart(this.$refs.chartContainer, {
        width: this.$refs.chartContainer.clientWidth,
        height: this.$refs.chartContainer.clientHeight,
        layout: {
          background: {color: '#151718'},
          textColor: '#DDD',
        },
        grid: {
          vertLines: {color: '#444'},
          horzLines: {color: '#444'},
        },
        priceScale: {
          position: 'right',
          autoScale: false, // Disable auto scaling
          // min: 0,          // Set minimum value for y-axis
          // max: 1e-12       // Set maximum value for y-axis
        },
      });

      var mainSeries = chart.addLineSeries({
        priceFormat: {
          minMove: 0.00000001,
          precision: 8,
        },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: 'rgba(75, 192, 192, 1)',
        downColor: 'rgba(255, 99, 132, 1)',
        borderVisible: false,
      });

      try {
        candlestickSeries.setData(data.map(item => ({
          time: Math.floor(Date.parse(item.time) / 1000), // Keep time as integer (optional)
          open: (Number)(item.open),
          high: (Number)(item.high),
          low: (Number)(item.low),
          close: (Number)(item.close),
        })));
        //调整canvars高度
        chart.resize(this.$refs.chartContainer.clientWidth, 250);
        //刷新时间
        chart.timeScale().fitContent();
        console.log('Render successful');
      } catch (error) {
        console.error('Render failed:', error);
      }
    },
    handleCommentInput(event) {
      this.comment = event.target.value;
      this.commentLength = this.comment.length; // Update comment length
    },
    async submitComment() {
      if (!this.wallet_address) {
        ElMessage.error('Please connect wallet first.');
        return;
      }
      if (this.commentLength > 0 && this.commentLength <= this.maxCommentLength) {
        // Handle comment submission (e.g., send to an API)
        console.log("Comment submitted:", this.comment);

        await axios.post('/api/create_comment', {
          tokenAddress: this.token_address,
          creatorAddress: this.wallet_address,
          content: this.comment
        })

        this.comments.push({creatorAddress: this.wallet_address, content: "Just now", text: this.comment}); // Example
        this.comment = ''; // Clear the comment after submission
        this.commentLength = 0; // Reset length


      } else {
        ElMessage.error(`Comment must be between 1 and ${this.maxCommentLength} characters.`);
      }
    },
    onClickCopyAddress() {
      window.navigator && window.navigator.clipboard && window.navigator.clipboard.writeText(this.token_address);
      ElMessage.success('Address copied to clipboard.');
    }
  }
}
</script>

<style scoped>
.lw-chart {
  height: 300px;
  width: 100%;
}

.can_buy {
  margin-top: 16px;
  font-size: 16px
}
</style>