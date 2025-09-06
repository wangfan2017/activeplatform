<template>
  <el-row :gutter="20" >
    <el-col :span="12">
      <el-card shadow="hover" class="box-card">
        <template #header>
          <div class="card-header">
            <span>拉新活动</span>
          </div>
        </template>
        <div class="card-content">
          <span>拉新人数:{{staticData.todayLiveNum }}</span>
          <span>意向人数:{{staticData.currentLiveNum  }}</span>
          <span>转化人数:{{staticData.todayAddLiveNum   }}</span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card shadow="hover" class="box-card ">
        <template #header>
          <span>推量活动</span>
        </template>
        <div class="card-content">
          <span>单量:{{staticData.todayRechargeScore }}</span>
          <span>环比:{{staticData.todayRechargeScore }}</span>
          <span>同比:{{staticData.todayRechargeScore }}</span>
        </div>
      </el-card>
    </el-col>

  </el-row>
</template>

<style lang="scss" scoped>


.box-card {
  display: flex;
  flex-direction: column;
  justify-content: start;
  height: 300px;
}
.card-content{
  display: block;
}
.card-content span{
  display: block;
  font-size: 14px;
  color: #666;
  line-height: 30px;
}


</style>

<script setup>
import { ref, onMounted } from "vue";
import {getHomeInfo, getSanguoList} from "@/api/api";
import {common } from '../../utils/comm.js'


const staticData = ref({});
onMounted(() => {
	//initChart();
  //getStaticInfo();
});
const getStaticInfo =async () => {
  const {code,data} =await getHomeInfo()
  if(code==200){
    staticData.value=data;
  }
}

const initChart = () => {
	const chartDom = document.getElementById("main");
	const myChart = echarts.init(chartDom);
	const option = {
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "cross",
				crossStyle: {
					color: "#999"
				}
			}
		},
		toolbox: {
			feature: {
				magicType: { show: true, type: ["line", "bar"] },
				restore: { show: true },
				saveAsImage: { show: true }
			}
		},
		legend: {
			data: ["Evaporation", "Precipitation", "Temperature"]
		},
		xAxis: [
			{
				type: "category",
				data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				axisPointer: {
					type: "shadow"
				}
			}
		],
		yAxis: [
			{
				type: "value",
				name: "Precipitation",
				min: 0,
				max: 250,
				interval: 50,
				axisLabel: {
					formatter: "{value} ml"
				}
			},
			{
				type: "value",
				name: "Temperature",
				min: 0,
				max: 25,
				interval: 5,
				axisLabel: {
					formatter: "{value} °C"
				}
			}
		],
		series: [
			{
				name: "Evaporation",
				type: "bar",
				tooltip: {
					valueFormatter: function(value) {
						return value + " ml";
					}
				},
				data: [
					2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
				]
			},
			{
				name: "Precipitation",
				type: "bar",
				tooltip: {
					valueFormatter: function(value) {
						return value + " ml";
					}
				},
				data: [
					2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
				]
			},
			{
				name: "Temperature",
				type: "line",
				yAxisIndex: 1,
				tooltip: {
					valueFormatter: function(value) {
						return value + " °C";
					}
				},
				data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
			}
		]
	};
	option && myChart.setOption(option);
};

</script>