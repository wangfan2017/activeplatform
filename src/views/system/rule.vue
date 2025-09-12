<template>
  <div class="p-4">
    <!-- 规则列表 -->
    <el-card shadow="hover" class="mb-4">
      <el-form  :inline="true" :model="searchForm">
        <el-form-item label="活动类型">
          <el-select v-model="searchForm.acttype" placeholder="活动类型" clearable>
            <el-option
                v-for="item in actList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
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
              @click="openDialog"
          >
            新增
          </el-button>
        </el-form-item>
      </el-form>


      <el-table :data="tableRules" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="规则名称" />
        <el-table-column prop="controlType" label="控件类型" />
        <el-table-column prop="ruleType" label="规则类型" />
        <el-table-column prop="activityType" label="活动类型" />
        <el-table-column prop="ruleDes" label="规则说明" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button size="small" @click="editRule(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteRule(scope.row.id)">删除</el-button>
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

    <!-- 规则添加/编辑弹框 -->
    <el-dialog v-model="dialogVisible" title="规则配置" width="600px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="规则名称">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="控件类型">
          <el-select v-model="form.controlType" placeholder="请选择">
            <el-option label="数字输入" value="number" />
            <el-option label="时间选择" value="time" />
          </el-select>
        </el-form-item>

        <!-- 如果是时间控件，显示时间模式选择 -->
        <el-form-item v-if="form.controlType === 'time'" label="时间模式">
          <el-radio-group v-model="form.timeMode">
            <el-radio label="point">单个时间点</el-radio>
            <el-radio label="range">时间段</el-radio>
          </el-radio-group>
        </el-form-item>


        <el-form-item label="规则类型">
          <el-select v-model="form.ruleType" placeholder="规则类型" clearable>
            <el-option
                v-for="item in ruleTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="活动类型">
          <el-select v-model="form.activityType" placeholder="活动类型" clearable>
            <el-option
                v-for="item in actList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规则说明">
          <el-input type="textarea" v-model="form.ruleDes" rows="=2"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRule">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {getRuleList} from "@/api/system.js";
const actList=ref([{id:1,name:'拉新活动'},{id:2,name:'骑士召回'},{id:3,name:'早晚冲单'}])
const ruleTypeList=ref([{id:1,name:'参与规则'},{id:2,name:'奖励规则'},{id:3,name:'达成规则'},{id:4,name:'特殊达成'},{id:5,name:'特殊奖励'}])
const searchForm = ref({
  id: 0,
  account: "",
  acttype: "",
  date: "",
  page: 1,
  page_size: 20
});
const tableRules = ref([]);
const total = ref(0);
const loading = ref(false);
const getListData = async() => {
  loading.value = true;

  await getRuleList(searchForm.value)
      .then(data => {
        tableRules.value = data.data.data.list;
        loading.value = false;
        total.value = Number(data.data.data.list.length);

      })
      .catch(() => {
        loading.value = false;
      });
};
const dialogVisible = ref(false);
const form = ref({
  id: 0,
  name: '',
  controlType: 'number',
  timeMode: 'point',
  ruleType:'',
  activityType: '',
  value: null,
});

// 动态渲染控件
const renderControl = computed(() => {
  if (form.value.controlType === 'number') {
    return 'el-input-number';
  }
  if (form.value.controlType === 'time') {
    return 'el-time-picker';
  }
  return 'el-input';
});



// 打开弹框
function openDialog() {
  form.value = { id: 0, name: '', controlType: 'number', timeMode: 'point', ruleType: null, activityType: '', value: null };
  dialogVisible.value = true;
}

// 编辑
function editRule(rule) {
  form.value = { ...rule };
  dialogVisible.value = true;
}

// 删除
function deleteRule(id) {
  tableRules.value = tableRules.value.filter(r => r.id !== id);
}

// 保存
function saveRule() {
  if (form.value.id === 0) {
    form.value.id = Date.now();
    tableRules.value.push({ ...form.value });
  } else {
    const index = tableRules.value.findIndex(r => r.id === form.value.id);
    if (index > -1) {
      tableRules.value[index] = { ...form.value };
    }
  }
  dialogVisible.value = false;
}
function searchEvent(){
  getListData();
}
getListData();
</script>
