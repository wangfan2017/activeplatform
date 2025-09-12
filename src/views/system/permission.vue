<template>
  <div class="home-box">
    <el-form v-show="showSearch" :inline="true" :model="searchForm">
      <el-form-item label="权限名称">
        <el-input v-model="searchForm.name" placeholder="权限名称" clearable></el-input>
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
        <el-button  plain icon="Plus" type="primary" @click="openAddDialog">新增菜单</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-table
          :data="tableMenu"
          border
          style="width: 100%"
      >
        <el-table-column prop="id" label="菜单ID" width="120" />
        <el-table-column prop="label" label="菜单名称" width="280">
          <template #default="{ row }">
          <span :style="{ paddingLeft: row.level * 20 + 'px' }">
            {{ row.label }}
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="操作" width="120" >
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="onEdit(row)">编辑</el-button>
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
    <!-- 添加/编辑菜单 弹框 -->
    <el-dialog v-model="showDialog" :title="isEdit ? '编辑菜单' : '新增菜单'" width="500px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="菜单名称">
          <el-input v-model="formData.label" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-select v-model="formData.parentId" placeholder="请选择父级菜单" clearable>
            <el-option :value="null" label="一级菜单" />
            <el-option
                v-for="item in tableMenu.filter(i => i.level === 0)"
                :key="item.id"
                :value="item.id"
                :label="item.label"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
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
import { getPermission } from "@/api/system";
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

const menuData = ref([]);
const total = ref(0);
const loading = ref(false);

const tableMenu = ref([]);
const getListData = async() => {
  loading.value = true;

  await getPermission(searchForm.value)
      .then(data => {
        menuData.value = data.data.data.list;
        loading.value = false;
        tableMenu.value=flattenMenu(data.data.data.list)
        total.value = Number(tableMenu.value.length);

      })
      .catch(() => {
        loading.value = false;
      });
};



const searchEvent = () => {
  searchForm.value.page = 1;
  getListData();
};
// 递归拍平成一维数组，并加上 level 层级标记
function flattenMenu(list, level = 0) {
  return list.reduce((acc, item) => {
    acc.push({ ...item, level });
    if (item.children && item.children.length > 0) {
      acc.push(...flattenMenu(item.children, level + 1));
    }
    return acc;
  }, []);
}
// 弹框数据
const showDialog = ref(false);
const isEdit = ref(false);
const formData = ref({
  id: null,
  label: "",
  parentId: null,
});
// 打开新增
function openAddDialog() {
  isEdit.value = false;
  formData.value = { id: null, label: "", parentId: null };
  showDialog.value = true;
}

// 编辑
function onEdit(row) {
  isEdit.value = true;
  formData.value = { id: row.id, label: row.label, parentId: findParentId(row.id) };
  showDialog.value = true;
}
function refreshFlatMenu() {
  tableMenu.value = flattenMenu(menuData.value);
}
function onSave() {
  if (!formData.value.label) {
    ElMessage.error("菜单名称不能为空");
    return;
  }

  if (isEdit.value) {
    // 编辑逻辑
    updateMenu(menuData.value, formData.value.id, formData.value.label);
    ElMessage.success("编辑成功");
  } else {
    // 新增逻辑
    const newId = Date.now(); // 简单生成唯一ID
    if (formData.value.parentId) {
      const parent = findMenuById(menuData.value, formData.value.parentId);
      parent.children = parent.children || [];
      parent.children.push({ id: newId, label: formData.value.label, children: [] });
    } else {
      menuData.value.push({ id: newId, label: formData.value.label, children: [] });
    }
    ElMessage.success("新增成功");
  }
  refreshFlatMenu();
  showDialog.value = false;
}
// 递归找到父级ID
function findParentId(id, list = menuData.value, parentId = null) {
  for (let item of list) {
    if (item.id === id) return parentId;
    if (item.children) {
      const found = findParentId(id, item.children, item.id);
      if (found !== null) return found;
    }
  }
  return null;
}

// 递归找到菜单
function findMenuById(list, id) {
  for (let item of list) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findMenuById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}
// 递归更新菜单
function updateMenu(list, id, newLabel) {
  for (let item of list) {
    if (item.id === id) {
      item.label = newLabel;
      return true;
    }
    if (item.children) {
      if (updateMenu(item.children, id, newLabel)) return true;
    }
  }
  return false;
}

</script>
<script>
export default {
  name: "role"
};
</script>