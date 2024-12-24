<script>

import HeaderComponent from "@/components/HeaderComponent.vue";
import {mapState} from "vuex";
import {ElMessage} from "element-plus";
import axios from "../utils/axios";

export default {
  name: "AirDropView",
  components: {HeaderComponent},
  computed: {
    ...mapState(['wallet_address', 'wallet_type']), // 映射 state
  },
  methods: {
    onClickCopy() {
      if (!this.wallet_address) {
        ElMessage.error('Please connect wallet first.');
        return;
      }
      const url = "https://www.bump.ceo/?invitor=" + this.wallet_address;
      navigator.clipboard.writeText(url);
      ElMessage.success('Copy success');
    },
    async loadUser() {
      const url = '/api/user/' + this.wallet_address;
      const resp = await axios.get(url);
      console.log('resp', resp);
      if (resp.data.code === 0) {
        this.user = resp.data.data.user;
      }
    }
  },
  data() {
    return {
      user: null
    }
  },
  mounted() {
    setInterval(() => {
      if (this.wallet_address) {
        this.loadUser();
      }
    }, 1000);
  }
}
</script>

<template>
  <div>
    <HeaderComponent/>
    <div class="index">
      <div class="section8">
        <div class="wrap">
          <div class="title">Airdrop</div>
          <div class="content shadow">
            <div class="tit">Your points</div>
            <div class="val" v-if="!user">0</div>
            <div class="val" v-if="user">{{user.point}}</div>
            <div class="dec">When you create a token for the first time; make a transaction on BUMP for the first time;
              or invite a new user to make a transaction on BUMP for the first time, you can get points. We will provide
              users with generous rewards based on the points.
            </div>
            <div class="link">
              <a href="javascript:;" @click="onClickCopy">Copy invitation link</a>
              <a href="#">To be collected</a>
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

</style>