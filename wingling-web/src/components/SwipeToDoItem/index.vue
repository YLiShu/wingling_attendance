<template>
  <div
    class="swipe-to-reject-item"
    :class="{ swiping: isSwiping }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="item-content">
      <slot name="content"></slot>
    </div>
    <div class="pc-reject" @click.stop="handleShowOptions" v-if="isPC">
      <div class="options">
        <i class="el-icon-more-outline"></i>
        <div class="options-popup" v-if="showOptions">
          <div class="option passed" @click="confirmPassed">通过</div>
          <div class="option reject">
            <wingling-popconfirm
              confirm-button-type="danger"
              cancel-button-type="info"
              confirm-button-text="确认"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              @confirm="confirmReject"
              @cancel="cancelReject"
              :title="`确认拒绝${item.userInfo.realname}的补卡申请吗？`"
            >
              <span slot="reference" @click.stop>拒绝</span>
            </wingling-popconfirm>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="reject_passed-button"
      :class="{ active: isButtonActive }"
    >
      <div class="rejectBtn" @click="confirmReject">拒绝</div>
      <div class="passedBtn" @click="confirmPassed">通过</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isSwiping: false,
      startX: 0,
      currentX: 0,
      deltaX: 0,
      isButtonActive: false,
      isPC: window.innerWidth > 820,
      showOptions: false,
    };
  },
  methods: {
    handleResize() {
      this.isPC = window.innerWidth > 820;
    },
    handleTouchStart(event) {
      this.startX = event.touches[0].clientX;
      this.currentX = this.startX;
      this.deltaX = 0;
      this.isSwiping = false;
      this.isButtonActive = false;
    },
    handleTouchMove(event) {
      const touch = event.touches[0];
      this.currentX = touch.clientX;
      this.deltaX = this.currentX - this.startX;
      this.isSwiping = Math.abs(this.deltaX) > 10;

      this.$root.$emit("hideRejectButtons", this.item);

      this.isButtonActive = this.deltaX < -80;
    },
    handleTouchEnd() {
      if (this.isSwiping) {
        this.isSwiping = false;
      }
    },
    confirmReject() {
      this.$emit("reject", this.item);
      this.isButtonActive = false;
    },
    handleShowOptions() {
      this.showOptions = true;
    },
    cancelReject() {
      this.showOptions = false;
    },
    confirmPassed() {
      this.$emit("passed", this.item);
      this.isButtonActive = false;
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.$root.$on("hideRejectButtons", (itemToExclude) => {
      if (this.item !== itemToExclude) {
        this.isButtonActive = false;
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    this.$root.$off("hideRejectButtons");
  },
};
</script>
  
<style lang="scss" scoped>
.swipe-to-reject-item {
  position: relative;
  transition: transform 0.3s;
  height: 130px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  margin-bottom: 10px;
  .swiping .item-content {
    transform: translateX(var(--deltaX));
  }
  .item-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: transform 0.3s;
    padding: 10px;
    box-sizing: border-box;
    background-color: #f6f6f6;

    @media screen and (min-width: 820px) {
      margin-right: 50px;
    }
  }
  .reject_passed-button {
    position: absolute;
    font-weight: bolder;
    top: 0;
    right: -80px;
    width: 80px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: right 0.3s;
    display: flex;
    flex-direction: column;
    .rejectBtn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      background-color: #f7b3b3;
      color: #ff4d4f;
    }

    .passedBtn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      background-color: #c2fae2;
      color: #19c37d;
    }
  }
  .active {
    right: 0;
  }

  .pc-reject {
    background-color: #f6f6f6;
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .options {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      i {
        transform: rotate(90deg);
      }

      .options-popup {
        width: 100%;
        position: absolute;
        right: 0;
        background-color: #f6f6f6;
        border-radius: 5px;
        padding: 5px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .option {
          padding: 5px;
          text-align: center;
          border-radius: 5px;
          cursor: default;
          margin-bottom: 5px;
          transition: all 0.2s ease-in-out;

          &.reject {
            color: #ff4d4f;

            &:hover {
              background-color: #f4e7e7;
              font-weight: bolder;
            }
          }

          &.passed {
            color: #19c37d;

            &:hover {
              background-color: #d9f8eb;
              font-weight: bolder;
            }
          }
        }
      }
    }
  }
}
</style>