<template>
  <div class="home-box">
    <el-card class="box-card" padding="0">
      <template #header>
        <div class="card-header">
          <span>数据统计</span>
        </div>
      </template>
      <el-row>
        <el-col :span="4"><div class="grid-content ep-bg-purple" >投入值:{{totalObj.predictScore}}</div></el-col>
        <el-col :span="4"><div class="grid-content ep-bg-purple" >产出值:{{totalObj.winScore}}</div></el-col>
        <el-col :span="4"><div class="grid-content ep-bg-purple" >剩余能量值:{{totalObj.surplusScore}}</div></el-col>
        <el-col :span="4"><div class="grid-content ep-bg-purple" >兑换礼物值:{{totalObj.exchangeGiftScore}}</div></el-col>
        <el-col :span="4"><div class="grid-content ep-bg-purple" >剩余礼物值:{{totalObj.surplusGiftScore}}</div></el-col>
      </el-row>
    </el-card>
    <el-form v-show="showSearch" :inline="true" :model="searchForm">
      <el-form-item label="关键词">
        <el-input v-model="searchForm.unionId" placeholder="ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="操作时间" style="width: 308px;">
        <el-date-picker
            v-model="searchForm.date"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            placeholder="日期"
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

    <el-card>
      <el-table
          v-loading="loading"
          :data="tableData"
          element-loading-text="加载中..."
          border
      >
        <el-table-column prop="username" label="昵称" width="160">
        </el-table-column>
        <el-table-column prop="unionId" label="ID" width="80">
        </el-table-column>
        <el-table-column prop="predictScore"  label="总投入" width="180">
        </el-table-column>
        <el-table-column prop="winScore"  label="总产出" width="120">
        </el-table-column>
        <el-table-column prop="surplusScore" label="剩余能量值" width="120">
        </el-table-column>
        <el-table-column prop="exchangeGiftScore" label="兑换礼物价值" width="120">
        </el-table-column>
        <el-table-column prop="surplusGiftScore" label="兑换剩余礼物价值" width="220">
        </el-table-column>
        <el-table-column prop="sumWinOrLossScore"  label="消费礼物价值" width="120">
          <template #default="{ row }">
            {{row.exchangeGiftScore-row.surplusGiftScore}}
          </template>
        </el-table-column>
        <el-table-column prop="ticketScore" label="平台奖励值" width="120">
        </el-table-column>
        <el-table-column prop="winOrLossScore" label="相差值" width="120">
        </el-table-column>
        <el-table-column    label="闭环" width="120">
          <template #default="{ row }">
            {{row.winScore-row.surplusScore-row.exchangeGiftScore}}
          </template>
        </el-table-column>

        <el-table-column prop="address" label="操作" min-width="100">
          <template #default="{ row }">
            <el-button
                type="primary"
                size="small"
                @click="onShowClick(row)"
            >查看</el-button>
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
        v-model="showPeopleSpace"
        title="每场详细信息"
        width="1370px"
        align-center>
      <div class="detailcontent">
        <el-table
            v-loading="ploading"
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
          <el-table-column prop="sectName"  label="当前女主" width="80">
          </el-table-column>
          <el-table-column prop="stakeScore" label="投入" width="120">
          </el-table-column>
          <el-table-column prop="winScore" label="产出" width="120">
          </el-table-column>
          <el-table-column prop="serviceScore" label="服务费" width="120">
          </el-table-column>
          <el-table-column prop="ticketScore" label="平台奖励" width="120">
          </el-table-column>
          <el-table-column prop="winOrLossScore" label="相差值" width="120">
          </el-table-column>
          <el-table-column prop="address" label="扶正值" min-width="80">
            <template #default="{ row }">
              <el-button
                  type="primary"
                  size="small"
                  @click="lookByCurrentPlace(row)"
              >按人查询本场</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination
            v-show="ptotal > 0"
            v-model:page="psearchForm.currentPage"
            v-model:limit="psearchForm.perPageSize"
            :total="ptotal"
            @pagination="getListData"
        />
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="showPeopleSpace = false">确定</el-button>
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
          <el-table-column prop="sectName" label="投入女主" width="160">
          </el-table-column>
          <el-table-column prop="incomeScore" label="产出" width="160">
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
.win-rowhead{
  display: flex;
}
.win-rowhead span{
  flex: 1;
  display: flex;
  justify-content: center;
}
.win-row{
  display: flex;
  line-height: 30px;
  margin: 10px 0;
}
.win-row span{
  flex: 1;
  display: flex;
  justify-content: center;
}
</style>

<script setup>

import UploadExcel from "@/components/UploadExcel";

import { ref, onMounted, watch } from "vue";
import {
  getStarPeopleStatic,
  getPeopleAnlyCount,
  getXdpdPeopleAnlyLst,
  getXdpdPeopleAnlyCount,
  getVirtualData
} from "@/api/game";
import {getPdByCurrentPlace, getPdByPlace, getSanguoDetailGift, getSanguoDetailInfo} from "@/api/api";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import {formtTime, switchServerUrl} from "@/utils/index";
const router = useRouter();
const showSearch = ref(true);

// 数据源
const searchForm = ref({
  unionId: "",
  date:[],
  currentPage: 1,
  perPageSize: 20,
  startTime:'',
  endTime:''
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

let defTime=new Date();
let defStartTime=new Date().setDate(new Date().getDate() - 7);
onMounted(() => {
  getListData();
  getAnlyCount();
  getVirtual();
});

/**
 * 获取账号列表
 */
const getListData = async(pageObj) => {
  loading.value = true;
  if(searchForm.value.date.length>0){
    searchForm.value.startTime=searchForm.value.date[0]+' 00:00:00';
    searchForm.value.endTime=searchForm.value.date[1]+' 23:59:59';
  }else{
    //默认时间
    searchForm.value.startTime=formtTime(defStartTime)+' 00:00:00';
    searchForm.value.endTime=formtTime(defTime)+' 23:59:59';
  }
  if(pageObj){
    searchForm.value.currentPage=pageObj.page;
    searchForm.value.perPageSize=pageObj.limit;
  }
  await getXdpdPeopleAnlyLst(searchForm.value)
      .then(data => {
        setTimeout(() => {
          tableData.value = data.data.result;
          total.value = Number(data.data.total);
          loading.value = false;
        }, 1000);
      })
      .catch(() => {
        loading.value = false;
      });
};

const searchEvent = () => {
  searchForm.value.page = 0;
  getListData();
  getAnlyCount();
  getVirtual();
};

const onShowClick = row => {
  psearchForm.value.userId=row.userId;
  getPlaceDetail();
};
const placeDetailAry =ref([]);
const ptotal = ref(0);
const showPeopleSpace=ref(false);
const ploading = ref(false);
// 数据源
const psearchForm = ref({
  currentPage: 1,
  perPageSize: 100,
  startTime:'',
  endTime:'',
  userId:''
});

const currentPlaceAry =ref([]);
const stotal = ref(0);
const currentDialog=ref(false);
const totalObj=ref({});


const getPlaceDetail =async (pageObj) => {
  if(pageObj){
    psearchForm.value.currentPage=pageObj.page;
    psearchForm.value.perPageSize=pageObj.limit;
  }
  if(searchForm.value.startTime){
    psearchForm.value.startTime=searchForm.value.startTime;
    psearchForm.value.endTime=searchForm.value.endTime;
  }
  const {code,data,msg}=await  getPdByPlace(psearchForm.value);
  if(code==200){
    ploading.value = false
    showPeopleSpace.value=true;
    placeDetailAry.value=data.result;
  }
}
const getCurrentPlaceDetail =async (rid) => {
  const {code,data,msg}=await  getPdByCurrentPlace({userId:psearchForm.value.userId,recordId:rid});
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

const getAnlyCount = async () => {
  if(searchForm.value.date.length>0){
    searchForm.value.startTime=searchForm.value.date[0]+' 00:00:00';
    searchForm.value.endTime=searchForm.value.date[1]+' 23:59:59';
  }else{
    //默认时间
    searchForm.value.startTime=formtTime(defStartTime)+' 00:00:00';
    searchForm.value.endTime=formtTime(defTime)+' 23:59:59';
  }
  const {code,data}=await getXdpdPeopleAnlyCount(searchForm.value);
  if(code==200){
    totalObj.value=data;
  }
}


const virtualObj=ref({});
const getVirtual =async () => {
  if(searchForm.value.date.length>0){
    searchForm.value.startTime=searchForm.value.date[0]+' 00:00:00';
    searchForm.value.endTime=searchForm.value.date[1]+' 23:59:59';
  }else{
    //默认时间
    searchForm.value.startTime=formtTime(defStartTime)+' 00:00:00';
    searchForm.value.endTime=formtTime(defTime)+' 23:59:59';
  }
  let newform=JSON.parse(JSON.stringify( searchForm.value));
  newform.date='';
  const{code,data}=await  getVirtualData(newform.value);

  if(code==200){
    virtualObj.value=data[1];
  }
}
</script>

<script>
export default {
  name: "Xdpdpeoplestatic"
};
</script>