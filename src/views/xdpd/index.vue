<template>
  <div class="home-box">
    <el-card class="box-card" padding="0">
      <template #header>
        <div class="card-header">
          <span>数据统计</span>
        </div>
      </template>
      <el-row :gutter="20">
        <div class="gameset">活动{{stop?'开启中':'关闭中'}}：<el-switch v-model="stop" @change="openStop" /></div>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5"><div class="grid-content ep-bg-purple" >参与人数:{{gameObj.sumPerson}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >参与人次:{{gameObj.sumPersonTimes}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >未参与场次:{{gameObj.notBetTimes}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >总场次:{{gameObj.sumTimes}}</div></el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="5"><div class="grid-content ep-bg-purple" >车主服务费:{{gameObj.sumDealerServiceScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >平台车主服务费:{{gameObj.sumPlatformServiceScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >玩家服务费:{{gameObj.sumPlayerServiceScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >总服务费:{{gameObj.sumServiceScore}}</div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5"><div class="grid-content ep-bg-purple" >车主平台奖励:{{gameObj.sumDealerTicketScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >玩家平台奖励:{{gameObj.sumPlayerTicketScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >平台车主平台奖励:{{gameObj.platformTicketScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >总平台奖励:{{gameObj.sumTicketScore}}</div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5"><div class="grid-content ep-bg-purple" >车主相差值:{{gameObj.sumDealerWinLossScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >平台车主相差值:{{gameObj.sumPlatformDealerWinLossScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >玩家相差值:{{gameObj.sumPlayerWinOrLossScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >玩家投产值（玩家投产-（车主投产+平台车主投产）:{{gameObj.sumPlayerDealerWinLossScore}}</div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5"><div class="grid-content ep-bg-purple" >兑换能量值:{{gameObj.sumExchangeFightingScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >兑换礼物值:{{gameObj.sumExchangeGiftScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >玩家剩余能量值:{{gameObj.sumSurplusScore}}</div></el-col>
        <el-col :span="5"><div class="grid-content ep-bg-purple" >今日扶正值:{{gameObj.sumPlatformProfitScore}}</div></el-col>
      </el-row>
    </el-card>
    <el-card class="box-card" padding="0">
      <template #header>
        <div class="card-header">
          <span>人物奖次数</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="5" v-for="o of peoleOpenAry[0]">
          <div class="grid-content ep-bg-purple" >{{o.sectName}}:{{o.times}}次(概率：{{(o.times/gameObj.sumTimes*100).toFixed(2)}}%)</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5" v-for="o of peoleOpenAry[1]">
          <div class="grid-content ep-bg-purple" >{{o.sectName}}:{{o.times}}次(概率：{{(o.times/gameObj.sumTimes*100).toFixed(2)}}%)</div>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <el-form v-show="showSearch" :inline="true" :model="searchForm">
        <el-form-item label="操作时间" style="width: 308px;">
          <el-date-picker
              v-model="searchForm.date"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              placeholder="时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item  >
          <el-checkbox v-model="searchForm.isPlay"  >是否参与</el-checkbox>
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
        <el-table-column prop="time" label="时间" width="160">
        </el-table-column>
        <el-table-column prop="username" label="当前车主" width="180">
        </el-table-column>
        <el-table-column prop="numbers" label="场次" width="80">
        </el-table-column>
        <el-table-column prop="sectName"  label="本局车辆" width="160">
        </el-table-column>
        <el-table-column prop="dealerScore" label="车主能量值" width="120">
        </el-table-column>
        <el-table-column prop="playerScore" label="投入能量值" width="120">
        </el-table-column>
        <el-table-column prop="playerWinScore" label="产出能量值" width="120">
        </el-table-column>
        <el-table-column prop="winLossScore" label="玩家相差值" width="120">
        </el-table-column>
        <el-table-column prop="dealerWinLossScore" label="玩家车主相差值" width="140">
        </el-table-column>
        <el-table-column prop="ticketScore" label="平台奖励" width="120">
        </el-table-column>
        <el-table-column prop="platformWinLossScore" label="平台车主相差值" width="180">
        </el-table-column>
        <el-table-column prop="serviceScore" label="服务费" width="120">
        </el-table-column>
        <el-table-column prop="bonusPoolScore" label="扶正值" width="420">
        </el-table-column>
        <el-table-column prop="address" label="操作" min-width="80">
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
          v-model:page="searchForm.currentPage"
          v-model:limit="searchForm.perPageSize"
          :total="total"
          @pagination="getListData"
      />
    </el-card>

    <el-dialog
        v-model="detailDialog"
        title="每场详细信息"
        width="720px"
        align-center>
      <div class="detailcontent">
        <el-table
            :data="detailAry"
            element-loading-text="加载中..."
            border
        >
          <el-table-column prop="username" label="用户" width="150">
          </el-table-column>
          <el-table-column prop="unionId" label="用户ID" width="80">
          </el-table-column>
          <el-table-column prop="sectName" label="预测人物" width="110">
          </el-table-column>
          <el-table-column prop="stakeScore" label="预测数量" width="100">
          </el-table-column>
          <el-table-column prop="ticketScore" label="平台奖励" width="120">
          </el-table-column>
          <el-table-column prop="winScore" label="预测结果" width="120">
          </el-table-column>

        </el-table>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="detailDialog = false">确定</el-button>
      </span>
      </template>
    </el-dialog>

    <el-dialog
        v-model="showActiveSet"
        title="派对活动设置"
        width="500px"
        align-center>
      <div class="detailcontent">
        <el-form   :inline="true" >
          <el-form-item label="是否设置">
            <el-checkbox v-model="isSet"></el-checkbox>
          </el-form-item>
          <el-form-item label="角色列表">
            <el-select :disabled="!isSet?true:false" v-model="sectId" value-key="id"  clearable filterable placeholder="选择角色">
              <el-option
                  v-for="(item,index) in gAry"
                  :key="index"
                  :label="`${item.name}-${item.times}`"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="sureSetResult">确定</el-button>
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
.gameset{
  display: flex;
  align-items: center;
  margin-left:10px;
}
.setcs{
  margin-left: 50px;
}

</style>

<script setup>


import { ref, onMounted } from "vue";
import {gameState, gameStop, getPdList, getPdListDetail } from "@/api/api";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import {getFishResultLst, getXdpdPeople, setFishResult, setXdpdResult} from "@/api/game.js";


const router = useRouter();

const showSearch = ref(true);

// 数据源
const searchForm = ref({
  account: "",
  date:[],
  currentPage: 1,
  perPageSize: 20,
  startTime:'',
  endTime:'',
  isPlay:true //参与是1 未参与是0
});

const gameObj=ref({});
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const detailDialog=ref(false);
const peoleOpenAry = ref([]);
const detailAry = ref([]);
const stop=ref(true)
onMounted(() => {
  getListData();
  initState();
  getPersonAry();
});
const openStop = () => {
  let str=stop.value?'放开':'关闭'
  ElMessageBox.confirm(`确定${str}生死时速活动?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(()=>{
    gameSet()
  }).catch(() => {
    stop.value=!stop.value
  });
}
const gameSet =async () => {
  const{code,msg}=await gameStop({gameId:16,isSwitch:stop.value?1:0});
  if(code==200){
    let str=stop.value?'放开':'关闭'
    ElMessage.info(`生死时速${str}成功`)
  }else{
    ElMessage.info(msg)
    stop.value=!stop.value
  }
}
const initState=async ()=>{
  const{code,data,msg}=await gameState();
  if(code==200){
    for(var o of data){
      if(o.gameId==16){
        stop.value=o.isSwitch==1?true:false
      }
    }
  }
}
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
  if(searchForm.value.isPlay){
    searchForm.value.type=1;
  }else{
    searchForm.value.type=0;
  }
  await getPdList(searchForm.value)
      .then(data => {
        setTimeout(() => {
          loading.value = false;
          tableData.value = data.data.result.replayDayList;
          if(data.data.result && data.data.result.sectTimeList.length>0){
            peoleOpenAry.value=[data.data.result.sectTimeList.slice(0,4),data.data.result.sectTimeList.slice(4,8)];
            gameObj.value=data.data.result;
            total.value = Number(data.data.total);
          }

        }, 1000);
      })
      .catch(() => {
        loading.value = false;
      });
};
const getDetail =async (rid,name) => {
  const {code,data,msg}=await  getPdListDetail({recordId:rid,sectName:name});
  if(code==200){
    detailDialog.value=true;
    detailAry.value=data;
  }
}
const onShowClick = (r) => {
  getDetail(r.numbers,r.sectName)
}
const searchEvent = () => {
  console.log(searchForm.value);
  searchForm.value.currentPage = 0;
  getListData();
};


const sectId=ref('');
const isSet=ref(false);
const showActiveSet=ref(false);
const gAry=ref([]);

const getPersonAry =async () => {
  const{code,data,msg}=await  getXdpdPeople({userId:1});
  if(code==200){
    gAry.value=data.sectDtoList.slice(0, 8);
  }
}
const sureSetResult =async () => {
  if(!sectId.value){
    return ElMessage.info('请选择角色')
  }
  let parms={
    sectId:sectId.value
  }
  const{code,msg}=await setXdpdResult(parms);
  if(code==200){
    showActiveSet.value=false;
  }
}
const setClick = () => {
  showActiveSet.value=true;
  sectId.value='';
  isSet.value=false;
}

</script>

<script>
export default {
  name: "Xdpd"
};
</script>