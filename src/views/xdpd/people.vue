<template>
  <div class="home-box">

    <el-card>
      <el-form v-show="showSearch" :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.unionId" placeholder="用户ID" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序类型">
          <el-select  v-model="searchForm.type"
                      placeholder="默认按兑换能量最多排序"
                      clearable>
            <el-option label="按兑换能量最多排序" value="1" />
            <el-option label="按兑换礼物最多排序" value="2" />
            <el-option label="按剩余能量最多排序" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间" style="width: 308px;">
          <el-date-picker
              v-model="searchForm.date"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              placeholder="时间"
          ></el-date-picker>
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
      </el-form>


      <el-table
          v-loading="loading"
          :data="tableData"
          element-loading-text="加载中..."
          border
      >
        <el-table-column prop="lastTime" label="最后玩活动时间" width="180">
        </el-table-column>
        <el-table-column prop="username" label="用户昵称" width="180">
        </el-table-column>
        <el-table-column prop="unionId" label="ID" width="120">
        </el-table-column>
        <el-table-column prop="exchangeSeedScore"  label="兑换能量值" width="160">
        </el-table-column>
        <el-table-column prop="exchangeGiftScore" label="兑换礼物" width="120">
        </el-table-column>
        <el-table-column prop="residueSeedScore" label="剩余能量值" width="120">
        </el-table-column>
        <el-table-column prop="winLossScore" label="相差值" width="120">
        </el-table-column>
        <el-table-column prop="serviceScore" label="服务费" width="120">
        </el-table-column>
        <el-table-column prop="ticketScore" label="平台奖励" width="140">
        </el-table-column>
        <el-table-column prop="profitScore" label="扶正值" width="120">
        </el-table-column>
        <el-table-column prop="address" label="操作" min-width="100">
          <template #default="{ row }">
            <el-button
                type="primary"
                size="small"
                @click="lookByPlace(row)"
            >按人查询每场</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination
          v-show="total > 0"
          v-model:page="searchForm.currentPage"
          v-model:limit="searchForm.perPageSize"
          :total="total"
          @pagination="getListData"
      />
    </el-card>
    <el-dialog
        v-model="placeDialog"
        title="每场详细信息"
        width="1260px"
        align-center>
      <div class="detailcontent">
        <el-table
            :data="placeDetailAry"
            element-loading-text="加载中..."
            border
        >
          <el-table-column prop="time" label="时间" width="160">
          </el-table-column>
          <el-table-column prop="username" label="用户昵称" width="180">
          </el-table-column>
          <el-table-column prop="unionId" label="ID" width="100">
          </el-table-column>
          <el-table-column prop="recordId" label="场次ID" width="100">
          </el-table-column>
          <el-table-column prop="sectName"  label="开奖人物名称" width="80">
          </el-table-column>
          <el-table-column prop="stakeScore" label="投入额度" width="120">
          </el-table-column>
          <el-table-column prop="winScore" label="产出额度" width="120">
          </el-table-column>
          <el-table-column prop="serviceScore" label="服务费" width="120">
          </el-table-column>
          <el-table-column prop="ticketScore" label="平台奖励" width="120">
          </el-table-column>
          <el-table-column prop="winOrLossScore" label="盈利" width="120">
          </el-table-column>
          <el-table-column prop="address" label="操作" min-width="80">
            <template #default="{ row }">
              <el-button
                  type="primary"
                  size="small"
                  @click="lookByCurrentPlace(row)"
              >按人查询本场</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="placeDialog = false">确定</el-button>
      </span>
      </template>
    </el-dialog>

    <el-dialog
        v-model="currentDialog"
        title="本场详细信息"
        width="740px"
        align-center>
      <div class="detailcontent">
        <el-table
            :data="currentPlaceAry"
            element-loading-text="加载中..."
            border
        >

          <el-table-column prop="name" label="预测的类型" width="160">
          </el-table-column>
          <el-table-column prop="stakeScore" label="投入能量值" width="160">
          </el-table-column>
          <el-table-column prop="sectName" label="投入人物" width="160">
          </el-table-column>
          <el-table-column prop="incomeScore" label="产出能量值" width="160">
          </el-table-column>
          <el-table-column prop="times" label="倍率" width="60">
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="currentDialog = false">确定</el-button>
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
.c-title{
  font-size: 15px!important;
  font-weight: 600;
  color: #333!important;
}
.box-card{
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}
.el-row {
  margin-bottom: 10px;
}
</style>

<script setup>


import { ref, onMounted } from "vue";
import {getPdByPerson, getPdByPlace,getPdByCurrentPlace} from "@/api/api";
import { useRouter ,useRoute} from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";


const router = useRouter();

const showSearch = ref(true);

// 数据源
const searchForm = ref({
  unionId: "",
  type:'',
  date:[],
  currentPage: 1,
  perPageSize: 20,
  startTime:'',
  endTime:''
});
//传参
const { query } = useRoute();
if( query.unionId){
  searchForm.value.unionId=query.unionId;
}
const gameObj=ref({});
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const placeDialog=ref(false);
const currentDialog=ref(false);
const currentPlaceAry = ref([]);
const placeDetailAry = ref([]);
const curUserId=ref('');
onMounted(() => {
  getListData();
});

/**
 * 获取账号列表
 */
const getListData = async(pageObj) => {
  loading.value = true;
  if(pageObj){
    searchForm.value.currentPage=pageObj.page;
    searchForm.value.perPageSize=pageObj.limit;
  }
  if(searchForm.value.date.length>0){
    searchForm.value.startTime=searchForm.value.date[0];
    searchForm.value.endTime=searchForm.value.date[1];
  }
  await getPdByPerson(searchForm.value)
      .then(data => {
        tableData.value =data.data.total==0?[]: data.data.result;
        total.value = Number(data.data.total);
        loading.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
};
const getPlaceDetail =async (uid,name) => {
  const {code,data,msg}=await  getPdByPlace({userId:uid,type:searchForm.value.type});
  if(code==200){
    curUserId.value=uid;
    placeDialog.value=true;
    placeDetailAry.value=data.result;
  }
}
const getCurrentPlaceDetail =async (rid) => {
  const {code,data,msg}=await  getPdByCurrentPlace({userId:curUserId.value,recordId:rid});
  if(code==200){
    currentDialog.value=true;
    currentPlaceAry.value=data;
  }
}
const lookByPlace = (r) => {
  getPlaceDetail(r.userId)
}
const lookByCurrentPlace = (r) => {
  getCurrentPlaceDetail(r.recordId)
}
const searchEvent = () => {
  console.log(searchForm.value);
  searchForm.value.currentPage = 0;
  getListData();
};



</script>

<script>
export default {
  name: "Xdpdperson"
};
</script>