<template>
  <div class="fixUser">
    <div class="fixUser_header">
      <img src="/assets/images/logo.png" alt="logo-img" class="left_img" />
      <div class="right">
        <div
          class="searchBar"
          :class="{ changeSearchWidth: isChangeSearchWidth }"
        >
          <div class="icon" @click="changeSearchWidth">
            <i class="el-icon-search"></i>
          </div>
          <div class="textInput">
            <input
              type="text"
              v-model="searchKeyWords"
              @input="searchHandler"
              class="search_input"
              placeholder="请输入搜索关键词"
            />
            <div class="clear" @click="clearHandler">
              <i class="el-icon-circle-close"></i>
            </div>
          </div>
        </div>
        <img :src="info.avatar" alt="avatar" class="right_img" />
      </div>
    </div>
    <div class="fixUser_main">
      <UserCard
        @deleteHandler="deleteHandler"
        v-for="(userInfo, index) in filteredUserList"
        :user-info="userInfo"
        :key="index"
      />
    </div>
    <div class="user_add" @click="goToAdd">
      <svg
        t="1690552258404"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="11599"
        width="50"
        height="50"
      >
        <path
          d="M669.86496 916.48H354.13504C218.496 916.48 107.52 805.504 107.52 669.86496V354.13504C107.52 218.496 218.496 107.52 354.13504 107.52h315.73504C805.504 107.52 916.48 218.496 916.48 354.13504v315.73504C916.48 805.504 805.504 916.48 669.86496 916.48z"
          fill="#1296db"
          opacity=".3"
          p-id="11600"
        ></path>
        <path
          d="M650.68032 477.33248h-104.00768V373.31968a34.67264 34.67264 0 0 0-69.33504 0v104.00768H373.31968a34.66752 34.66752 0 0 0 0 69.33504h104.00768v104.00768a34.67264 34.67264 0 0 0 69.33504 0V546.6624h104.00768a34.66752 34.66752 0 0 0 0.01024-69.32992z"
          fill="#1296db"
          p-id="11601"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
import { getUserList } from "@/apis/userManagement/index";
import UserCard from "./UserCard/index.vue";

export default {
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  components: {
    UserCard,
  },
  data() {
    return {
      isChangeSearchWidth: false,
      userList: [],
      filteredUserList: [],
      searchKeyWords: "",
    };
  },
  methods: {
    changeSearchWidth() {
      this.isChangeSearchWidth = !this.isChangeSearchWidth;
    },
    clearHandler() {
      this.searchKeyWords = "";
      this.filteredUserList = this.userList;
    },
    deleteHandler() {
      this.initUserList();
    },
    goToAdd() {
      const activeIndex = 1;
      this.$emit("changeTab", activeIndex);
    },
    searchHandler() {
      if (this.searchKeyWords == "") {
        return this.filteredUserList = this.userList;
      }
      this.filteredUserList = this.userList.filter(
        (item) =>
          item.realname == this.searchKeyWords ||
          item.username == this.searchKeyWords ||
          item.grade == this.searchKeyWords ||
          item.email == this.searchKeyWords
      );
    },
    async initUserList() {
      const { data } = await getUserList();
      data.forEach((item) => {
        item.avatar = `${process.env.VUE_APP_API_BASE_URL}${item.avatar}`;
      });
      this.userList = data;
      this.filteredUserList = this.userList;
    },
  },
  created() {
    this.initUserList();
  },
};
</script>

<style lang="scss" scoped>
.fixUser {
  display: flex;
  flex-direction: column;
  height: 100%;

  .fixUser_header {
    margin-top: 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    height: 60px;
    border-radius: 5px;
    background-color: #fff;

    .left_img {
      height: 50px;
      width: 50px;
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;

      .searchBar {
        width: 40px;
        height: 40px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        position: relative;
        overflow: hidden;
        transition: all 0.5s ease-in-out;

        .icon {
          height: 40px;
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;

          i {
            font-size: 25px;
            color: #138fb1;
          }
        }

        .textInput {
          width: 200px;
          height: 100%;
          position: absolute;
          top: 0;
          left: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: blue;

          input {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            font-size: 16px;
          }

          .clear {
            width: 15px;
            height: 15px;
            position: absolute;
            right: 5%;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            justify-content: center;
            align-items: center;

            i {
              color: #999;
            }
          }
        }
      }

      .changeSearchWidth {
        width: 250px;
      }
      .right_img {
        margin-left: 15px;
        height: 40px;
        width: 40px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
    }
  }

  .fixUser_main {
    margin-top: 10px;
    height: 100%;
    overflow-y: auto;
  }

  .user_add {
    position: fixed;
    bottom: 116px;
    right: 5px;
  }
}
</style>