<template>
  <div class="card">
    <div class="header">
      <div class="left">
        <img :src="userInfo.avatar" alt="avatar" class="user_avatar" />
        <div class="info">
          <div class="name">{{ userInfo.realname }}</div>
          <div class="email">{{ userInfo.email }}</div>
        </div>
      </div>
      <div class="right" @click.stop="handleShowOptions" v-if="!editing">
        <div class="options">
          <i class="el-icon-more-outline"></i>
          <div class="options-popup" v-if="showOptions">
            <div class="option" @click.stop="editUserInfo">编辑</div>
            <div class="option delete">
              <wingling-popconfirm
                confirm-button-type="danger"
                cancel-button-type="info"
                confirm-button-text="确认"
                cancel-button-text="取消"
                icon="el-icon-info"
                icon-color="red"
                @confirm="confirmDelete"
                @cancel="cancelDelete"
                :title="`确认删除学号为${userInfo.username}的用户${userInfo.realname}吗？`"
              >
                <span slot="reference" @click.stop>删除</span>
              </wingling-popconfirm>
            </div>
          </div>
        </div>
      </div>
      <div class="right" v-if="editing">
        <button @click="confirmEdit" class="editBtn">确认</button>
        <button @click="cancelEdit" class="editBtn">取消</button>
      </div>
    </div>
    <div class="content">
      <div class="content_info grade">
        <div class="title">年级</div>
        <div class="value" v-if="!editing">{{ userInfo.grade }}</div>
        <div class="value" v-if="editing">
          <select v-model="gradeValue" class="editInput selectInput" >
            <option
              :value="grade"
              v-for="(grade, index) in gradeOption"
              :key="index"
            >
              {{ grade }}
            </option>
          </select>
        </div>
      </div>
      <div class="content_info-divider" v-if="shouldShowAnimation"></div>
      <div class="content_info studentId">
        <div class="title">学号</div>
        <div class="value" v-if="!editing">{{ userInfo.username }}</div>
        <div class="value" v-if="editing">
          <input type="text" class="editInput" v-model="username" />
        </div>
      </div>
      <div class="reactor-container" v-if="shouldShowAnimation">
        <div class="reactor-container-inner circle abs-center"></div>
        <div class="tunnel circle abs-center"></div>
        <div class="core-wrapper circle abs-center"></div>
        <div class="core-outer circle abs-center"></div>
        <div class="core-inner circle abs-center"></div>
        <div class="coil-container">
          <div class="coil coil-1"></div>
          <div class="coil coil-2"></div>
          <div class="coil coil-3"></div>
          <div class="coil coil-4"></div>
          <div class="coil coil-5"></div>
          <div class="coil coil-6"></div>
          <div class="coil coil-7"></div>
          <div class="coil coil-8"></div>
        </div>
      </div>
      <div class="content_info target">
        <div class="title">目标</div>
        <div class="value" v-if="!editing">{{ userInfo.targetTime }} 小时</div>
        <div class="value" v-if="editing">
          <input type="text" v-model="targetTime" class="editInput" />
        </div>
      </div>
      <div class="content_info-divider" v-if="shouldShowAnimation"></div>
      <div class="content_info admin">
        <div class="title">职位</div>
        <div class="value" v-if="!editing">
          {{ userInfo.isAdmin ? "队长" : "队员" }}
        </div>
        <div class="value" v-if="editing">
          <input type="text" class="editInput" v-model="isAdmin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputBox from "@/components/InputBox/index.vue";
import { deleteUser, updateProfile } from "@/apis/userManagement/index";
import showNotice from "@/utils/notice";

export default {
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
  },
  components: {
    InputBox,
  },
  data() {
    return {
      showOptions: false,
      editing: false,
      shouldShowAnimation: window.innerWidth > 540,
      gradeOption: ["大一", "大二", "大三"],
      gradeValue: this.userInfo.grade,
      username: this.userInfo.username,
      targetTime: this.userInfo.targetTime,
      isAdmin: this.userInfo.isAdmin ? "队长" : "队员",
    };
  },
  methods: {
    editUserInfo() {
      this.editing = true;
      this.showOptions = false;
    },
    handleShowOptions() {
      this.showOptions = !this.showOptions;
    },
    handleResize() {
      this.shouldShowAnimation = window.innerWidth > 540;
    },
    async confirmDelete() {
      try {
        await deleteUser(this.userInfo._id);
        showNotice("success", "删除成功");
        this.$emit("deleteHandler");
      } catch (err) {
        console.warn(err);
      }
    },
    cancelDelete() {
      this.showOptions = false;
    },
    async confirmEdit() {
      const params = {
        username: this.username,
        grade: this.gradeValue,
        targetTime: Number(this.targetTime),
        isAdmin: this.isAdmin === "队长" ? true : false
      };
      try {
        await updateProfile(this.userInfo._id, params);
        showNotice("success", "更新成功");
        this.$emit("deleteHandler");
      } catch (err) {
        console.log(err);
      }
      this.editing = false;
    },
    cancelEdit() {
      this.editing = false;
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  height: 200px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #fff;
  box-sizing: border-box;
  padding: 15px;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(0.99);
  }

  .header {
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px dashed #c0c4d1;

    .left {
      display: flex;
      height: 100%;
      align-items: center;

      .info {
        margin-left: 10px;
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .name {
          margin-bottom: 5px;
          font-weight: bolder;
        }

        .email {
          font-size: 14px;
          color: #999;
        }
      }

      .user_avatar {
        height: 50px;
        width: 50px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
    }

    .right {
      .editBtn {
        border-radius: 5px;
        margin-left: 10px;
        border: none;
        font-weight: bolder;
        color: #999;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .options {
        position: relative;

        i {
          transform: rotate(90deg);
        }

        .options-popup {
          width: 50px;
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          border-radius: 5px;
          padding: 5px;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .option {
            border-radius: 5px;
            padding: 5px;
            cursor: default;
            transition: all 0.2s ease-in-out;

            &:hover {
              background-color: #f5f5f5;
              font-weight: bolder;
            }

            &.delete {
              color: #ff4d4f;
            }
          }
        }
      }
    }
  }

  .content {
    margin-top: 10px;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;

    .content_info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px;
      min-width: 50px;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .title {
        font-size: 12px;
        color: #666;
      }

      .value {
        margin-top: 5px;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;

        .selectInput {
          width: 100% !important;
        }

        .editInput {
          text-align: center;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          border-radius: 5px;
          outline: none;
          padding: 2px;
          width: 85%;

          @media screen and (max-width: 768px) {
            width: 50px;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 540px) {
  .content_info-divider {
    height: 100%;
    width: 4px;
    border-radius: 5px;
    background-color: #e0e0e0;
    display: block;
    opacity: 0.8;
    position: relative;
    animation: colorAndshapeAnimate 2s infinite;
  }

  @keyframes colorAndshapeAnimate {
    0% {
      background-color: #edc89e;
      height: 100%;
      width: 5px;
    }

    25% {
      background-color: #9bc2ea;
      height: 75%;
      width: 4px;
    }

    50% {
      background-color: #f1e7b2;
      height: 50%;
      width: 3px;
    }

    75% {
      background-color: #8ab4c7;
      height: 75%;
      width: 4px;
    }
    100% {
      height: 100%;
      width: 5px;
    }
  }

  .content_info {
    min-width: 100px !important;
    position: relative;
    overflow: hidden;
  }

  .reactor-container {
    width: 50px;
    height: 50px;
    position: relative;
    border-radius: 50%;
    background-color: #384c50;
    box-shadow: 0px 0px 8px 1px rgb(18, 20, 20),
      0px 0px 2px 1px rgb(18, 20, 20) inset;

    .reactor-container-inner {
      height: 39px;
      width: 39px;
      background-color: rgb(22, 26, 27);
      box-shadow: 0px 0px 2px 1px #52fefe;
    }

    .circle {
      border-radius: 50%;
    }

    .abs-center {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }

    .core-inner {
      width: 14px;
      height: 14px;
      border: 2px solid #1b4e5f;
      background-color: #ffffff;
      box-shadow: 0px 0px 2px 2px #52fefe, 0px 0px 4px 4px #52fefe inset;
    }

    .core-outer {
      width: 24px;
      height: 24px;
      border: 1px solid #52fefe;
      background-color: #ffffff;
      box-shadow: 0px 0px 1px 1px #52fefe, 0px 0px 5px 2px #52fefe inset;
    }

    .core-wrapper {
      width: 36px;
      height: 36px;
      background-color: #073c4b;
      box-shadow: 0px 0px 2px 2px #52fefe, 0px 0px 3px 1px #52fefe inset;
    }

    .tunnel {
      width: 44px;
      height: 44px;
      background-color: #ffffff;
      box-shadow: 0px 0px 2px 1px #52fefe, 0px 0px 2px 2px #52fefe inset;
    }

    .coil-container {
      position: relative;
      width: 100%;
      height: 100%;
      animation: 3s infinite linear reactor-anim;

      .coil {
        position: absolute;
        width: 6px;
        height: 4px;
        top: calc(50% - 22px);
        left: calc(50% - 3px);
        transform-origin: 3px 22px;
        background-color: #073c4b;
        box-shadow: 0px 0px 2px #52fefe inset;
      }

      .coil-1 {
        transform: rotate(0deg);
      }

      .coil-2 {
        transform: rotate(45deg);
      }

      .coil-3 {
        transform: rotate(90deg);
      }

      .coil-4 {
        transform: rotate(135deg);
      }

      .coil-5 {
        transform: rotate(180deg);
      }

      .coil-6 {
        transform: rotate(225deg);
      }

      .coil-7 {
        transform: rotate(270deg);
      }

      .coil-8 {
        transform: rotate(315deg);
      }
    }
    @keyframes reactor-anim {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
}

@media screen and (min-width: 920px) {
  .content_info {
    min-width: 120px !important;
  }
}
</style>
