<script>

import {mapState, mapActions} from 'vuex';

export default {
  name: "HeaderComponent",
  computed: {
    ...mapState(['wallet_address']), // 映射 state
    connected() {
      if (this.wallet_address) {
        return this.wallet_address.substr(0, 6) + '...' + this.wallet_address.substr(-4)
      } else {
        return 'Connect Wallet'
      }
    }
  },
  data() {
    return {
      isVisible: false,
      isMenuVisible: false,
    }
  },
  methods: {
    ...mapActions(['connect_wallet']), // 映射 actions
    onClickWallet: function () {
      this.isVisible = true;
    },
    onClickClose: function () {
      this.isVisible = false;
    },
    onClickMetamask: async function () {
      await this.connect_wallet('metamask');
      this.isVisible = false;
    },
    onClickOxk: async function () {
      await this.connect_wallet('okx');
      this.isVisible = false;
    },
    onClickGate: async function () {
      await this.connect_wallet('gate');
      this.isVisible = false;
    },
    onClickMenu: function () {
      this.isMenuVisible = !this.isMenuVisible
    }
  }
}
</script>

<template>
  <div>
    <div class="head">
      <div class="wrap">
        <div class="nav">
          <ul>
            <li>
              <h2 class="h2tit">
                <a href="#">Create Token</a>
              </h2>
            </li>
            <li>
              <h2 class="h2tit">
                <a href="#">Buy/Sell</a>
              </h2>
            </li>
            <li>
              <h2 class="h2tit">
                <a href="#">Exchange Rate</a>
              </h2>
            </li>
          </ul>
        </div>
      </div>
      <div class="right">
        <a href="#" class="link1"><img src="images/li1.png" alt=""></a>
        <a href="javascript:;" class="link2" @click="onClickMetamask"><span>{{connected}}</span></a>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>