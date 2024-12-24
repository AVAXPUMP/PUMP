<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import axios from "@/utils/axios";

export default {
  name: "RankingView",
  components: {HeaderComponent,},
  data() {
    return {
      marketCapList: [],
      bondingCurveProgressList: [],
      VolumeIn24List: [],
      riseList: [],
      eth_price:0,
    }
  },
  methods: {
    async load() {
      const market_resp = await axios.get('/api/ranking/market_cap');
      if (market_resp.data.code === 0) {
        this.marketCapList = market_resp.data.data.tokens;
        this.eth_price = market_resp.data.data.eth_price;
        // console.log(this.marketCapList)

      }
      const bond_curve_resp = await axios.get('/api/ranking/bonding_curve');
      if (bond_curve_resp.data.code === 0) {
        this.bondingCurveProgressList = bond_curve_resp.data.data.tokens;
      }
      const volume_resp = await axios.get('/api/ranking/volume');
      if (volume_resp.data.code === 0) {
        this.VolumeIn24List = volume_resp.data.data.tokens;
      }
      const rise_resp = await axios.get('/api/ranking/rise');
      if (rise_resp.data.code === 0) {
        this.riseList = rise_resp.data.data.tokens;
      }
    },
  },
  mounted() {
    this.load()
  }
}
</script>

<template>
  <div>
    <HeaderComponent/>
    <div class="index">
      <div class="section7">
        <div class="wrap">
          <div class="item">
            <div class="title">Progress Ranking</div>
            <div class="shadow content">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="">
                <tr>
                  <th></th>
                  <th>Name (Symbol)</th>
                  <th>Market Cap</th>
                  <th>BondingCurve%</th>
                </tr>
                <tr v-for="(item, index) in bondingCurveProgressList" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td class="no-wrap">
                    <img src="images/tic2.png" class="icon" alt="">
                    <span class="no-wrap">{{ item.name }} ({{ item.symbol }})</span>
                  </td>
                  <td>${{ (item.marketCap * this.eth_price).toFixed(3) }}</td>
                  <td>
                    <div class="tear">{{ item.bondingCurveProgress.toFixed(2) }}%</div>
                    <div class="line">
<!--                      <i></i>-->
                      <i :style="{ width: item.bondingCurveProgress + '%' }"></i>
                    </div>
                  </td>
                </tr>
                <tr v-if="bondingCurveProgressList.length < 10" v-for="n in (10 - bondingCurveProgressList.length)" :key="'empty-' + n">
                  <td colspan="4">&nbsp;</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="item">
            <div class="title">MarketCap Ranking</div>
            <div class="shadow content">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="">
                <tr>
                  <th></th>
                  <th>Name (Symbol)</th>
                  <th>Market Cap</th>
                </tr>
                <tr v-for="(item, index) in marketCapList" :key="index">
                  <td>{{index+1}}</td>
                  <td class="no-wrap">
                    <img src="images/tic2.png" class="icon" alt="">
                    <span class="no-wrap">{{ item.name }} ({{ item.symbol }})</span>
                  </td>
                  <td>${{ (item.marketCap * this.eth_price).toFixed(3) }}</td>
                </tr>
                <tr v-if="marketCapList.length < 10" v-for="n in (10 - marketCapList.length)" :key="'empty-' + n">
                  <td colspan="3">&nbsp;</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="item">
            <div class="title">24 Hours Gainers Ranking</div>
            <div class="shadow content">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="">
                <tr>
                  <th></th>
                  <th>Name (Symbol)</th>
                  <th>Market Cap</th>
                  <th>Rise</th>
                </tr>
                <tr v-for="(item, index) in riseList" :key="index">
                  <td>{{index+1}}</td>
                  <td class="no-wrap">
                    <img src="images/tic2.png" class="icon" alt="">
                    <span class="no-wrap">{{ item.name }} ({{ item.symbol }})</span>
                  </td>
                  <td>${{ (item.marketCap * this.eth_price).toFixed(3) }}</td>
                  <td><span class="green">{{item.rise}}%</span></td>
                </tr>
                <tr v-if="riseList.length < 10" v-for="n in (10 - riseList.length)" :key="'empty-' + n">
                  <td colspan="4">&nbsp;</td>
                </tr>
              </table>
            </div>
          </div>
          <div class="item">
            <div class="title">24 Hours Trading Volume</div>
            <div class="shadow content">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" class="">
                <tr>
                  <th></th>
                  <th>Name (Symbol)</th>
                  <th>Market Cap</th>
                  <th>Trading Volume</th>
                </tr>
                <tr v-for="(item, index) in VolumeIn24List" :key="index">
                  <td>{{index+1}}</td>
                  <td class="no-wrap">
                    <img src="images/tic2.png" class="icon" alt="">
                    <span class="no-wrap">{{ item.name }} ({{ item.symbol }})</span>
                  </td>
                  <td>${{ (item.marketCap * this.eth_price).toFixed(3) }}</td>
                  <td>${{ item.VolumeIn24}}</td>
                </tr>
                <tr v-if="VolumeIn24List.length < 10" v-for="n in (10 - VolumeIn24List.length)" :key="'empty-' + n">
                  <td colspan="4">&nbsp;</td>
                </tr>
              </table>
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

  </div>

</template>

<style scoped>
.no-wrap {
  white-space: nowrap; /* 不允许换行 */
}
th{
  white-space: nowrap; /* 不允许换行 */
}
</style>