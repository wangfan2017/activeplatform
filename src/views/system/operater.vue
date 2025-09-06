<template>
  <div class="home-box">
    <el-form v-show="showSearch" :inline="true" :model="searchForm">
      <el-form-item label="账号">
        <el-input v-model="searchForm.account" placeholder="账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="searchForm.role" placeholder="角色" clearable>
          <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="操作时间" style="width: 308px;">
        <el-date-picker
            v-model="searchForm.date"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button
            style="margin-left: -16px"
            @click="searchEvent"
        >
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="addOperator"
        >
          新增
        </el-button>
      </el-form-item>
    </el-form>

    <el-card>
      <el-table
          v-loading="loading"
          :data="tableData"
          element-loading-text="加载中..."
          border
      >
        <el-table-column prop="id" label="ID" width="180"></el-table-column>
        <el-table-column prop="account" label="账号" width="180">
        </el-table-column>
        <el-table-column prop="belong" label="归属" width="280">
        </el-table-column>
        <el-table-column label="角色" width="180">
          <template #default="{ row }">
            <el-tag type="danger">{{row.roleName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template #default="{ row }">
            <span>{{row.status == "1" ? "禁用" : "正常"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="最后操作时间" width="280">
        </el-table-column>

        <el-table-column prop="" label="操作" min-width="280">
          <template #default="{ row }">
            <el-button
                type="primary"
                size="small"
                @click="onShowRoleClick(row)"
            >
              角色
            </el-button>
            <el-button v-if="row.status==2"
                type="danger"
                size="small"
                @click="onRemoveClick(row)"
            >
              禁用
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination
          v-show="total > 0"
          v-model:page="searchForm.page"
          v-model:limit="searchForm.page_size"
          :total="total"
          @pagination="getListData"
      />
    </el-card>

    <!--角色组件-->
    <roles-dialog
        v-model="roleDialogVisible"
        :user-id="selectUserId"
        @updateRole="getListData"
    >
    </roles-dialog>
    <!-- 添加用户-->
    <el-dialog
        v-model="showAddOperator"
        title="添加用户"
        width="500px"
        align-center>
      <div class="detailcontent">
        <el-form   :inline="true" >

          <el-form-item label="省区选择">
            <el-select   v-model="addData.sectId" value-key="id"  clearable filterable placeholder="选择省区">
              <el-option
                  v-for="(item,index) in addData.provAry"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input type="text" placeholder="输入需要登录的手机号" maxlength="11" />
          </el-form-item>
          <el-form-item label="角色选择">
            <el-select  v-model="addData.roleId" value-key="id"  clearable filterable placeholder="选择角色">
              <el-option
                  v-for="(item,index) in addData.roleAry"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="sureAddOperator">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.home-box {
  .header {
    margin-bottom: 22px;
    text-align: right;
  }
  ::v-deep .el-tag {
    margin-right: 6px;
  }
  ::v-deep .avatar {
    border-radius: 50%;
    width: 60px;
    height: 60px;
  }

}
:deep(.el-input) {
  width: 200px;
}
:deep(.el-textarea) {
  width: 200px;
}
</style>

<script setup>
import RolesDialog from "./components/roles.vue";
import UploadExcel from "@/components/UploadExcel";

import {ref, onMounted, watch, reactive} from "vue";
import { getAdmintorList, getRoleList } from "@/api/system";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { switchServerUrl } from "@/utils/index";

const router = useRouter();

const showSearch = ref(true);
const addData=reactive({
  provAry:[{id:1,name:'河南大区'},{id:2,name:'广东大区'},{id:3,name:'河北大区'}],
  sectId:null,
  roleAry:[{id:1,name:'大区经理'}, {id:2,name:'片区经理'},{id:3,name:'活动运营'}],
  roleId:null,
})
// 数据源
const searchForm = ref({
  id: 0,
  account: "",
  role: "",
  date: "",
  page: 1,
  page_size: 20
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);
const showAddOperator=ref(false);
onMounted(() => {
  getListData();
  getRoleData();
});

/**
 * 获取账号列表
 */
const getListData = async() => {
  loading.value = true;
  await getAdmintorList(searchForm.value)
      .then(data => {
        setTimeout(() => {
          tableData.value = data.data.data.list;
          total.value = Number(data.data.data.list.length);
          loading.value = false;
        }, 1000);
      })
      .catch(() => {
        loading.value = false;
      });
};

/**
 * 获取角色列表
 */
const getRoleData = async() => {
  await getRoleList()
      .then(data => {
        roleList.value = data.data.data.list;
      })
      .catch(() => {

      });
};
const sureAddOperator=row=>{
  ElMessage.success("用户添加成功");
  showAddOperator.value = false;
  getListData();
}
/**
 * 删除按钮点击事件
 */
const onRemoveClick = row => {
  ElMessageBox.confirm(
      "确定要禁用" + row.account + "吗",
      { type: "warning" }
  ).then(async() => {
    // await deleteUser(row._id)
    ElMessage.success("禁用成功");
    // 重新渲染数据
    await getListData();
  });
};

/**
 * 查看角色的点击事件
 */
const selectUserId = ref("");
const roleDialogVisible = ref(false);
const onShowRoleClick = row => {
  selectUserId.value = row.id;
  roleDialogVisible.value = true;
};

// 保证每次打开重新获取用户角色数据
watch(roleDialogVisible, val => {
  if (!val) selectUserId.value = "";
});

const searchEvent = () => {
  console.log(searchForm.value);
  searchForm.value.page = 1;
  getListData();
};
const addOperator=()=>{
  showAddOperator.value = true;
}

</script>

<script>
export default {
  name: "operater"
};
</script>