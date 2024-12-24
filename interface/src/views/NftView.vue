<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import {mapState} from "vuex";
import {ElMessage} from "element-plus";

export default {
  name: "NftView",
  components: {HeaderComponent},
  computed: {
    ...mapState(['wallet_address', 'wallet_type']), // 映射 state
  },
  data() {
    return {}
  },
  mounted() {

  },
  methods: {
    async onClickMint() {

    },
    onClickCopy() {
      if (!this.wallet_address) {
        ElMessage.error('Please connect wallet first.');
        return;
      }
      const url = "https://www.bump.ceo/?invitor=" + this.wallet_address;
      navigator.clipboard.writeText(url);
      ElMessage.success('Copy success');
    }
  }
}
</script>

<template>
  <div>
    <HeaderComponent/>
    <div class="index">
      <div class="section4">
        <div class="wrap">
          <div class="content1">
            <div class="imgbox"><img src="images/nft.png" alt=""></div>
            <div class="right" style="">
              <div class="dec1" style="background-color: transparent;width: 100%;padding:0;margin-bottom: 18px;">
                <!--                <p>-->
                <!--                  Created by: 0x7AFF...aDe7-->
                <!--                </p>-->
                <!--                <p>-->
                <!--                  Funds raised : 10.26 BNB-->
                <!--                </p>-->
                <!--                <p>-->
                <!--                  Participants: 5-->
                <!--                </p>-->
                <!--                <p>-->
                <!--                  Len Sassaman (LEN): Hail the creator of Bitcoin. The real Satoshi Nakamoto. Hail Len Sassaman!-->
                <!--                </p>-->
                <p>
                  BUMP OG Passcard<br/>
                </p>
                <p>
                  quantity： 1000/1000<br/>
                  Mint Price： Fair mint<br/>
                  The first issue of OG PASS card is limited to 1,000 pieces.<br/>
                  1. 0.1ETH can mint 1 NFT. Minting is limited to once per address.<br/>
                  2. Users holding OG pass cards can obtain BUMP’s exclusive DID identity certificate<br/>
                  3. Holding the OG card can continuously obtain BUMP cooperation project token airdrops<br/>
                  4. Holding an OG card can continuously receive dividends from the BUMP platform's handling fees.<br/>
                </p>
              </div>
              <div class="dec2">BUMP ($ BUMP)</div>
              <div class="lines">
                <div class="title">Casting progress: $ 10k (10%)</div>
                <div class="line"><i></i></div>
              </div>
            </div>
          </div>
          <div class="content2">
            <div class="item">
              <div class="dec1">
                BUMP OG PASS Card is an exclusive NFT offering from the BUMP platform. Holders gain access to:<br/>
                1.Exclusive Platform Benefits: Unlock unique features and privileges.<br/>
                2.Transaction Fee Dividends: Earn a share of platform growth.<br/>
                In the future, we will launch a decentralized DID system based on ENS. BUMP OG PASS holders will receive
                a free DID domain as part of this rollout.<br/>
                The BUMP OG PASS is your gateway to the Web3 world—join us and explore the possibilities!<br/>
              </div>
            </div>
            <div class="item">
              <div class="dec2">
                <p>
                  Prepare your ETH on the BASE chain to immediately mint your exclusive NFT."
                </p>
                <p>
                  you have cast：1 OG PASS
                </p>
                <p>
                  your recommendation：2 OG PASS
                </p>
              </div>
              <div class="link">
                <a href="javascript:;" @click="onClickCopy"><span>Copy your invitation link</span></a>
                <a href="javascript:;" @click="onClickMint"><span>MINT</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>