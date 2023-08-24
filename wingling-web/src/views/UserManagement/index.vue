<template>
  <div class="userManagement">
    <Tab :activeTab="activeTab" :tabs="tabs" @changeTab="handleTabChange">
      <FixUser
        :info="info"
        v-if="activeTab === 0"
        @changeTab="handleTabChange"
      />
      <AddUser v-else-if="activeTab === 1" :info="info" />
    </Tab>
  </div>
</template>

<script>
import Tab from "@/components/Tab/index.vue";
import AddUser from "./AddUser/index.vue";
import FixUser from "./FixUser/index.vue";
import { mapState } from "vuex";

export default {
  components: {
    Tab,
    AddUser,
    FixUser,
  },
  data() {
    return {
      tabs: [
        {
          title: "查看成员",
        },
        {
          title: "新增成员",
        },
      ],
      activeTab: 0,
    };
  },
  methods: {
    handleTabChange(index) {
      this.activeTab = index;
    },
  },
  computed: {
    ...mapState("user", ["info"]),
  },
};
</script>

<style lang="scss" scoped>
.userManagement {
  height: calc(100% - 96px);
  box-sizing: border-box;
  padding: 5px;
}
</style>