<template>
  <div class="home-box">
    <el-form v-show="showSearch" :inline="true" :model="searchForm">
      <el-form-item label="角色名称">
        <el-input v-model="searchForm.name" placeholder="角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
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
            @click="addRole"
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
        <el-table-column prop="id" label="角色ID" width="180">
        </el-table-column>
        <el-table-column prop="name" label="角色名称" width="180">
        </el-table-column>

        <el-table-column label="操作时间" min-width="160">
          <template #default="{ row }">
            {{$filters.dateFilter(row.operator, 'YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>

        <el-table-column prop="address" label="操作" min-width="160">
          <template #default="{ row }">
            <el-button
                type="primary"
                size="small"
                @click="handleEdit(row)"
            >
              配置权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total > 0"
          v-model:page="searchForm.page"
          v-model:limit="searchForm.page_size"
          :total="total"
          @pagination="getListData"
      />
    </el-card>

    <distribute-permission
        v-model="distributePermissionVisible"
        :role-id="selectRoleId"
    >
    </distribute-permission>
    <!-- 添加角色-->
    <el-dialog
        v-model="addData.showAddRole"
        title="添加角色"
        width="500px"
        align-center>
      <div class="detailcontent">
        <el-form   :inline="true" >
          <el-form-item label="如果省区内需要区分不同的角色名称则要选省区，否则去掉省区"></el-form-item>
          <el-form-item label="省区选择">
            <el-select  v-model="addData.sectId" value-key="id"  clearable filterable placeholder="选择角色">
              <el-option
                  v-for="(item,index) in addData.provAry"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色名称">
            <el-input type="text" placeholder="输入需要登录的手机号" maxlength="11" />
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
  .pagination {
    display: flex;
    justify-content: end;
    margin-top: 20px;
  }

}
</style>

<script setup>
import DistributePermission from "./components/distributePermission.vue";

import {ref, onMounted, reactive} from "vue";
import { getRoleList } from "@/api/system";
import { ElMessage } from "element-plus";

const showSearch = ref(true);
const addData=reactive({
  provAry:[{id:1,name:'河南大区'},{id:2,name:'广东大区'},{id:3,name:'河北大区'}],
  sectId:null,
  showAddRole:false,
})
onMounted(() => {
  getListData();
});

// 数据源
const searchForm = ref({
  id: 0,
  name: "",
  date: "",
  page: 1,
  page_size: 10
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
/**
 * 获取角色列表
 */
const getListData = async() => {
  loading.value = true;

  await getRoleList(searchForm.value)
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
 * 分配权限
 */
const distributePermissionVisible = ref(false);
const selectRoleId = ref("");
const handleEdit = row => {
  selectRoleId.value = row.id;
  distributePermissionVisible.value = true;
};

const searchEvent = () => {
  searchForm.value.page = 1;
  getListData();
};
const addRole = () => {
  addData.showAddRole =true;
}
const sureAddOperator=row=>{
  ElMessage.success("角色添加成功");
  addData.showAddRole=false;
  getListData();
}
</script>
<script>
export default {
  name: "role"
};
</script>