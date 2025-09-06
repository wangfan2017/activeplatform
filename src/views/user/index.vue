<template>
  <div class="home-box">
    <el-form v-show="showSearch" :inline="true" :model="searchForm">
      <el-form-item label="昵称">
        <el-input v-model="searchForm.name" placeholder="昵称" clearable></el-input>
      </el-form-item>
      <el-form-item label="ID">
        <el-input v-model="searchForm.unionid" placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="登录ip">
        <el-input v-model="searchForm.phone" placeholder="ip" clearable></el-input>
      </el-form-item>
      <el-form-item label="账户类型">
        <el-select  v-model="searchForm.role" clearable>
          <el-option label="真实" value="2" />
          <el-option label="公司" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="账户状态">
        <el-select  v-model="searchForm.status" clearable>
          <el-option label="正常" value="1" />
          <el-option label="注销" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序字段(默认降序)">
        <el-select  v-model="searchForm.order_field" clearable>
          <el-option label="剩余龙币" value=1 />
          <el-option label="累计消费" value=2 />
          <el-option label="累计充值" value=3 />
          <el-option label="兑换龙币" value=4 />
        </el-select>
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
<!--      <el-form-item >-->
<!--      <right-toolbar :haveAdd="false" :haveImport="false" :haveOut="false" :search="false"-->
<!--                     v-model:showSearch="showSearch"-->
<!--                     @queryTable="getListData"-->
<!--                     @onImportClick="handleImport"-->
<!--                     @onOutClick="onDownTemplate"-->
<!--                     @onAddClick="onDownTemplate"></right-toolbar>-->
<!--      </el-form-item>-->
    </el-form>


    <el-card>
      <el-table
          v-loading="loading"
          :data="tableData"
          element-loading-text="加载中..." cell-class-name="cellname"
          border
      >
        <el-table-column prop="name" label="昵称"      width="130px">
        </el-table-column>
        <el-table-column prop="unionid" label="ID"  >
        </el-table-column>
        <el-table-column prop="role"  label="账号类别"  width="120px">
        </el-table-column>
        <el-table-column prop="score" label="剩余龙币" width="120px"  >
        </el-table-column>
        <el-table-column prop="cumulative_consumption" label="累计消费（龙币）" width="150px" >
        </el-table-column>
        <el-table-column prop="accumulated_recharge" label="累计充值（元）" width="150px"  >
        </el-table-column>
        <el-table-column prop="exchange_dragon_coins" label="兑换龙币"  width="150px"  >
        </el-table-column>
        <el-table-column prop="status" label="账号状态" width="140px" >
        </el-table-column>
        <el-table-column prop="login_ip" label="最后登录IP" width="180px"  >
        </el-table-column>
        <el-table-column prop="login_created_time" label="最后登录时间"   width="190px" >
        </el-table-column>


        <el-table-column prop="address" label="操作" >
          <template #default="{ row }">
            <el-button
                type="primary"
                size="small"
                @click="onShowClick(row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination
          v-show="total > 0"
          v-model:page="searchForm.page"
          v-model:limit="searchForm.limit"
          :total="total"
          @pagination="getListData"
      />
    </el-card>


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
    height: 20px;
  }

}
.custom-row-height{
  height: 30px!important;
}
.cellname{
  padding: 0!important;
}
</style>

<script setup>

import UploadExcel from "@/components/UploadExcel";

import { ref, onMounted, watch } from "vue";
import { getUserList } from "@/api/api";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { switchServerUrl } from "@/utils/index";

const router = useRouter();

const showSearch = ref(true);

// 数据源
const searchForm = ref({
  name: "",
  unionid:"",
  status:'',
  role:'',
  order_type:'',
  order_field:'',
  isSort:'',
  page: 0,
  limit: 20
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

onMounted(() => {
  getListData();
});

/**
 * 获取账号列表
 */
const getListData = async(pageObj) => {
  loading.value = true;
  if(pageObj){
    searchForm.value.page=pageObj.page;
    searchForm.value.perPageSize=pageObj.limit;
  }
  if(searchForm.value.order_field){
    searchForm.value.order_type=1;
  }else{
    searchForm.value.order_type='';
  }
  await getUserList(searchForm.value)
      .then(data => {
        setTimeout(() => {
          tableData.value = data.data.data;
          total.value = Number(data.data.count);
          loading.value = false;
        }, 1000);
      })
      .catch(() => {
        loading.value = false;
      });
};




const searchEvent = () => {
  console.log(searchForm.value);
  searchForm.value.page =0;
  getListData();
};
const onShowClick=(row)=>{
  router.push({
    path: "/gamewin",
    query: {unionId:row.unionid}
  });
}

</script>

<script>
export default {
  name: "Userlist"
};
</script>