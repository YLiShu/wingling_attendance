<template>
  <div class="clockManagement">
    <div class="title">考勤管理</div>
    <div class="clockManagement_header">
      <div class="header_left">
        <img src="/assets/images/logo.png" alt="logo-img" />
        <div class="header_title_company">翼灵物联网工作室</div>
      </div>
      <div class="header_right" @click="exportFile">
        <img src="/assets/images/clockManagement/export.png" alt="export" />
        <div class="header_right_action">导出报表</div>
      </div>
    </div>
    <div class="main" v-if="makeUpClockList.length">
      <SwipeToDoItem
        v-for="item in makeUpClockList"
        :key="item._id"
        :item="item"
        @reject="rejectItem"
        @passed="passedItem"
      >
        <template #content>
          <div class="application_item">
            <div class="item_title">
              <div class="title_left">
                {{ item.userInfo.realname }}提交的补卡
              </div>
              <div class="title_right">{{ item.date }}</div>
            </div>
            <div class="item_main">
              <div class="main_left">
                <div class="application_total">
                  补卡时长：{{ item.duration }}分钟
                </div>
                <div class="application_reason">
                  补卡理由：{{ item.reason }}
                </div>
              </div>
              <div class="main_right">
                <div class="application_time">
                  起始时间：{{ item.startTime }}
                </div>
                <div class="application_time">结束时间：{{ item.endTime }}</div>
              </div>
            </div>
            <div class="item_footer">
              <div class="footer_left">
                <img class="avatar" :src="item.userInfo.avatar" alt="avatar" />
                <div class="application_person">
                  由{{ item.userInfo.realname }}提交
                </div>
              </div>
            </div>
          </div>
        </template>
      </SwipeToDoItem>
    </div>
    <div class="main empty" v-else>
      <wingling-empty
        :image-size="200"
        description="暂无待处理补卡申请"
      ></wingling-empty>
    </div>
    <div v-if="showRejectReasonModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeRejectReasonModal">&times;</span>
        <form @submit.prevent="onSubmit">
          <InputBox
            imgSrc="/assets/images/clockManagement/reject.png"
            placeholder="拒绝原因"
            v-model="rejectReason"
            type="text"
            :minlength="5"
            tips="请正确输入拒绝原因"
          />
          <div class="form_footer">
            <button @click="cancel" class="btn cancel">取消</button>
            <button type="submit" class="btn">确定</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
  
<script>
import SwipeToDoItem from "@/components/SwipeToDoItem";
import InputBox from "@/components/InputBox";
import {
  getMakeUpClock,
  handleMakeUpClock,
  handleExportClock
} from "@/apis/clockManagement/index";
import showNotice from "@/utils/notice";
export default {
  data() {
    return {
      makeUpClockList: [],
      rejectReason: "",
      showRejectReasonModal: false,
      itemToReject: null,
      itemToPassed: null,
    };
  },
  components: {
    SwipeToDoItem,
    InputBox,
  },
  methods: {
    rejectItem(itemToReject) {
      this.itemToReject = this.makeUpClockList.find(
        (item) => item._id === itemToReject._id
      );
      if (this.itemToReject) {
        this.showRejectReasonModal = true;
      }
    },
    async passedItem(itemToPassed) {
      this.itemToPassed = this.makeUpClockList.find(
        (item) => item._id === itemToPassed._id
      );
      if (this.itemToPassed) {
        const params = {
          status: "pass",
        };
        try {
          await handleMakeUpClock(this.itemToPassed._id, params);
          showNotice("success", "处理成功");
        } catch (err) {
          console.warn(err);
        }
        this.initMakeUpClockList();
      }
    },
    async initMakeUpClockList() {
      const { data } = await getMakeUpClock();
      data.forEach((record) => {
        record.userInfo.avatar = `${process.env.VUE_APP_API_BASE_URL}${record.userInfo.avatar}`;
      });
      this.makeUpClockList = data;
    },
    closeRejectReasonModal() {
      this.showRejectReasonModal = false;
    },
    async onSubmit() {
      const params = {
        rejectReason: this.rejectReason,
        status: "reject",
      };
      try {
        await handleMakeUpClock(this.itemToReject._id, params);
        showNotice("success", "处理成功");
      } catch (err) {
        console.warn(err);
      }
      this.rejectReason = "";
      this.showRejectReasonModal = false;
      this.initMakeUpClockList();
    },
    cancel() {
      this.rejectReason = "";
      this.showRejectReasonModal = false;
    },
    exportFile() {
      handleExportClock()
    }
  },
  created() {
    this.initMakeUpClockList();
  },
};
</script>
  <style lang="scss" scoped>
.clockManagement {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 5px;
  height: calc(100% - 96px);

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    text-align: center;
    height: 40px;
    padding: 5px;
    font-size: 18px;
    font-weight: bolder;
  }

  .clockManagement_header {
    display: flex;
    height: 120px;
    background-color: #fff;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    justify-content: space-between;
    border-radius: 10px;
    margin-top: 5px;
    margin-bottom: 5px;

    .header_left {
      margin-left: 20px;
      display: flex;
      align-items: center;

      img {
        width: 55px;
        height: 55px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        margin-right: 10px;
      }
      .header_title_company {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }
    }

    .header_right {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      flex-direction: column;

      &:active {
        font-weight: bolder;
        color: #000;
      }

      img {
        width: 40px;
        height: 40px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        border-radius: 8px;
      }

      .header_right_action {
        font-size: 14px;
        color: #999;
        text-align: center;
        margin-top: 5px;
      }
    }
  }

  .main {
    margin-top: 5px;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

    .application_item {
      display: flex;
      justify-content: center;
      flex-direction: column;

      .item_title {
        display: flex;
        margin: 5px 0;
        justify-content: space-between;

        .title_left {
          font-size: 18px;
        }

        .title_right {
          font-size: 12px;
          color: #808080;
        }
      }

      .item_main {
        display: flex;
        margin: 5px 0;
        justify-content: space-between;
        color: #808080;
        font-size: 14px;

        .main_left {
          .application_reason {
            margin-top: 5px;
          }
        }

        .main_right {
          .application_time {
            margin-top: 5px;
          }
        }
      }

      .item_footer {
        display: flex;
        align-items: center;
        margin-top: 5px;
        font-size: 14px;

        .footer_left {
          display: flex;
          align-items: center;

          img {
            height: 20px;
            width: 20px;
            border-radius: 5px;
            margin-right: 2px;
            box-shadow: 5px 5px 15px -4px rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
  }

  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    display: block;
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);

    .modal-content {
      @media screen and (min-width: 768px) {
        width: 660px;
      }

      width: 85%;
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 25px;
      box-sizing: border-box;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

      .close {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
        font-weight: bolder;
        cursor: default;
      }

      form {
        .form_footer {
          display: flex;
          justify-content: flex-end;

          .cancel {
            margin-right: 10px;
          }

          .btn {
            height: 40px;
            width: 60px;
            background-color: #fff;
            border-radius: 10px;
            border: none;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            transition: transform 0.2s;
            font-weight: bolder;
            color: #808080;
            font-size: 16px;

            &:active {
              transform: translateY(2px);
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              font-size: 15px;
            }
          }
        }
      }
    }
  }
}
</style>