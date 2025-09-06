<template>
  <div class="home-box">

    <el-card>
      <el-form   :inline="true" >
        <el-form-item label="模版名称">
          <el-input v-model="name" placeholder="模版名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="模版类型">
          <el-select  v-model="type"
                      placeholder=""
                      clearable>
            <el-option label="拉新人" value="1" />
            <el-option label="老骑手召回" value="2" />
            <el-option label="早冲单" value="3" />
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
        <el-form-item>
          <el-button
              type="primary"
              style="margin-left: -16px"
              @click="addTemp"
          >
            添加模版
          </el-button>
        </el-form-item>
      </el-form>


      <el-table
          v-loading="loading"
          :data="tableData"
          element-loading-text="加载中..."
          border
      >
        <el-table-column prop="id" label="模版ID" width="180">
        </el-table-column>
        <el-table-column prop="time" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="name" label="模版名称" width="180">
        </el-table-column>
        <el-table-column prop="typestr" label="活动类型" width="120">
        </el-table-column>
        <el-table-column prop="province" label="省区" width="120">
        </el-table-column>
<!--        <el-table-column prop="city" label="片区" width="120">-->
<!--        </el-table-column>-->
<!--        <el-table-column prop="contry" label="营业部" width="120">-->
<!--        </el-table-column>-->
        <el-table-column prop="status" label="状态" width="140">
        </el-table-column>
        <el-table-column prop="operate" label="操作" min-width="160">
          <template #default="{ row }">
            <el-button
                type="primary"
                size="small"
                @click="editTemp(row)">
              编辑
            </el-button>
            <el-button v-if="row.status=='启用'"
                type="warning"
                size="small"
                @click="delTemp(row)">
              停用
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination
          v-show="total > 0"
          v-model:page="currentPage"
          v-model:limit="perPageSize"
          :total="total"
          @pagination="getListData"
      />
    </el-card>
    <el-dialog
        v-model="showAddTemp"
        title="添加模版"
        width="50%"
        align-center>
      <div class="detailcontent">
        <div class="d-formview">
          <el-form   :inline="true" >
            <el-form-item label="模版名称">
              <el-input type="text" v-model="tempObj.tempName" placeholder="输入模版名称" maxlength="10" />
            </el-form-item>
            <el-form-item label="省区列表">
              <el-select @change="changeProv"  v-model="tempObj.provId" value-key="id"  clearable filterable placeholder="选择省区">
                <el-option
                    v-for="(item,index) in gAry"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                </el-option>∂
              </el-select>
            </el-form-item>
            <el-form-item label="活动类型">
              <el-select @change="changeActType"  v-model="tempObj.actId" value-key="id"  clearable filterable placeholder="选择活动类型">
                <el-option
                    v-for="(item,index) in atyps"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模版样式">
              <el-select  @change="changeTheme"  v-model="tempObj.tempcsId" value-key="id"  clearable filterable placeholder="选择模版样式">
                <el-option
                    v-for="(item,index) in tempcsAry"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <div v-if="tempObj.actId==1">
              <el-form-item label="达成条件">
                <div
                    v-for="(item, index) in conditions"
                    :key="index"
                    style="display: flex; align-items: center;margin-bottom: 20px"
                >
                  <el-select
                      v-model="item.type"
                      placeholder="请选择达成条件"
                      clearable
                  >
                    <el-option
                        v-for="opt in sucOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                        :disabled="isOptionDisabled(opt.value, index)"
                    />
                  </el-select>

                  <!-- 删除按钮 -->
                  <el-button
                      v-if="conditions.length > 1"
                      type="danger"
                      circle
                      size="small"
                      icon="Delete"
                      @click="removeCondition(index)"
                      style="margin:0 0px 0 8px;"
                  />
                </div>

                <!-- 添加按钮 -->
                <el-button type="primary" plain icon="Plus" size="small" @click="addCondition" style=";margin:0 0 20px 10px">
                </el-button>
              </el-form-item>
              <el-form-item label="基础奖励">
                <div
                    v-for="(item, index) in baseconditions"
                    :key="index"
                    style="display: flex; align-items: center;margin-bottom: 20px"
                >
                  <el-select
                      v-model="item.type"
                      placeholder="请选择基础奖励条件"
                      clearable
                  >
                    <el-option
                        v-for="opt in baseOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                        :disabled="isBaseOptionDisabled(opt.value, index)"
                    />
                  </el-select>

                  <!-- 删除按钮 -->
                  <el-button
                      v-if="baseconditions.length > 1"
                      type="danger"
                      circle
                      size="small"
                      icon="Delete"
                      @click="removeBaseCondition(index)"
                      style="margin:0 0px 0 8px;"
                  />
                </div>

                <!-- 添加按钮 -->
                <el-button type="primary" plain icon="Plus" size="small" @click="addBaseCondition" style=";margin:0 0 20px 10px">
                </el-button>
              </el-form-item>


              <el-form-item label="额外达成">
                <div
                    v-for="(item, index) in spconditions"
                    :key="index"
                    style="display: flex; align-items: center;margin-bottom: 20px"
                >
                  <el-select
                      v-model="item.type"
                      placeholder="请选择额外达成条件"
                      clearable
                  >
                    <el-option
                        v-for="opt in spOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                        :disabled="isSpOptionDisabled(opt.value, index)"
                    />
                  </el-select>

                  <!-- 删除按钮 -->
                  <el-button
                      v-if="spconditions.length > 1"
                      type="danger"
                      circle
                      size="small"
                      icon="Delete"
                      @click="removeSpCondition(index)"
                      style="margin:0 0px 0 8px;"
                  />
                </div>

                <!-- 添加按钮 -->
                <el-button type="primary" plain icon="Plus" size="small" @click="addSpCondition" style=";margin:0 0 20px 10px">
                </el-button>
              </el-form-item>
              <el-form-item label="额外奖励">
              <el-select  v-model="type"
                          placeholder="请选择额外达成奖励"
                          clearable>
                <el-option label="邀请1人奖励" value="1" />
              </el-select>
            </el-form-item>
            </div>
            <div v-else-if="tempObj.actId==2">
              <el-form-item label="参与条件">
                <div
                    v-for="(item, index) in joinconditions"
                    :key="index"
                    style="display: flex; align-items: center;margin-bottom: 20px"
                >
                  <el-select
                      v-model="item.type"
                      placeholder="请选择参与条件"
                      clearable
                  >
                    <el-option
                        v-for="opt in joinOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                        :disabled="isJoinOptionDisabled(opt.value, index)"
                    />
                  </el-select>

                  <!-- 删除按钮 -->
                  <el-button
                      v-if="joinconditions.length > 1"
                      type="danger"
                      circle
                      size="small"
                      icon="Delete"
                      @click="removeJoinCondition(index)"
                      style="margin:0 0px 0 8px;"
                  />
                </div>

                <!-- 添加按钮 -->
                <el-button type="primary" plain icon="Plus" size="small" @click="addJoinCondition" style=";margin:0 0 20px 10px">
                </el-button>
              </el-form-item>
              <el-form-item label="达成条件">
                <div
                    v-for="(item, index) in zhsucconditions"
                    :key="index"
                    style="display: flex; align-items: center;margin-bottom: 20px"
                >
                  <el-select
                      v-model="item.type"
                      placeholder="请选择达成条件"
                      clearable
                  >
                    <el-option
                        v-for="opt in zhSucOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                        :disabled="isZhSucOptionDisabled(opt.value, index)"
                    />
                  </el-select>

                  <!-- 删除按钮 -->
                  <el-button
                      v-if="zhsucconditions.length > 1"
                      type="danger"
                      circle
                      size="small"
                      icon="Delete"
                      @click="removeZhSucCondition(index)"
                      style="margin:0 0px 0 8px;"
                  />
                </div>

                <!-- 添加按钮 -->
                <el-button type="primary" plain icon="Plus" size="small" @click="addZhSucCondition" style=";margin:0 0 20px 10px">
                </el-button>
              </el-form-item>
              <el-form-item label="基础奖励">
                <el-select  v-model="type"
                            placeholder=""
                            clearable>
                  <el-option label="按出勤天数奖励" value="1" />
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="d-preview">
          <div class="container">

            <div class="header" :class="currentTheme">
              <div class="activity-type">{{ activityData.type }}</div>
              <h1 class="activity-title">{{ activityData.title }}</h1>
              <div class="activity-time">
                <span class="time-tag tag"><i class="far fa-clock"></i> {{ activityData.time }}</span>
              </div>
              <div class="reward-badge" :class="currentTheme">
                <i class="fas fa-gift"></i> {{ activityData.reward }}
              </div>
              <div class="decoration">
                <i class="fas" :class="currentTheme === 'recruit' ? 'fa-motorcycle' : 'fa-trophy'"></i>
              </div>
            </div>

            <div class="illustration" :class="currentTheme">
              <i class="fas" :class="currentTheme === 'recruit' ? 'fa-handshake' : 'fa-bolt'"></i>
            </div>

            <div class="info-card">
              <div class="info-header">
                <div class="info-icon" :class="currentTheme">
                  <i class="fas fa-map-marked-alt"></i>
                </div>
                <div class="info-title">活动范围</div>
              </div>
              <div class="info-content">
                    <span class="region-tag tag" :class="currentTheme" v-for="region in activityData.regions" :key="region">
                        <i class="fas fa-map-marker-alt"></i> {{ region }}
                    </span>
              </div>
            </div>

            <div class="info-card">
              <div class="info-header">
                <div class="info-icon" :class="currentTheme">
                  <i class="fas fa-user-friends"></i>
                </div>
                <div class="info-title">活动对象</div>
              </div>
              <div class="info-content">
                    <span class="object-tag tag" :class="currentTheme" v-for="object in activityData.objects" :key="object">
                        <i class="fas fa-user"></i> {{ object }}
                    </span>
              </div>
            </div>

            <div class="info-card" v-if="currentTheme === 'incentive'">
              <div class="info-header">
                <div class="info-icon" :class="currentTheme">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="info-title">冲单排行榜</div>
              </div>
              <div class="info-content">
                <table class="ranking-list">
                  <thead>
                  <tr>
                    <th>排名</th>
                    <th>骑手</th>
                    <th>完成单数</th>
                    <th>奖励</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(rider, index) in activityData.ranking" :key="index">
                    <td><span class="rank-badge" :class="'rank-' + (index < 3 ? index+1 : 'other')">{{ index + 1 }}</span></td>
                    <td>{{ rider.name }}</td>
                    <td>{{ rider.orders }} 单</td>
                    <td>{{ rider.reward }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="info-card">
              <div class="info-header">
                <div class="info-icon" :class="currentTheme">
                  <i class="fas fa-clipboard-list"></i>
                </div>
                <div class="info-title">规则详情</div>
              </div>
              <div class="info-content">
                <div class="rule-item" v-for="(rule, index) in activityData.rules" :key="index">
                  <div class="rule-number" :class="currentTheme">{{ index + 1 }}</div>
                  <div>{{ rule }}</div>
                </div>
              </div>
            </div>

            <div class="info-card">
              <div class="info-header">
                <div class="info-icon" :class="currentTheme">
                  <i class="fas fa-info-circle"></i>
                </div>
                <div class="info-title">活动详情</div>
              </div>
              <div class="info-content">
                <ul class="detail-list">
                  <li v-for="(detail, index) in activityData.details" :key="index">
                    <i class="fas fa-check-circle" :class="currentTheme"></i>
                    <span>{{ detail }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="action-buttons">
              <button class="btn btn-primary" :class="currentTheme">
                <i class="fas fa-ticket-alt"></i> 立即参与
              </button>
              <button class="btn btn-outline" :class="currentTheme">
                <i class="fas fa-share-alt"></i> 分享活动
              </button>
            </div>

            <div class="footer">
              <p>© 2023 京东骑手活动平台 | 最终解释权归主办方所有</p>
            </div>
          </div>
        </div>

      </div>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="saveTemp">保存</el-button>
      </span>
      </template>
    </el-dialog>
  </div>

</template>
<style lang="scss" scoped>
.detailcontent{
  display: flex;
}
.d-formview{
  flex: 1;
}
.d-preview{
  flex: 1;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
  padding: 0;
  margin: 0;
  height: 500px;
  overflow: auto;
}
:deep(.el-input) {
  width: 200px;
}
:deep(.el-textarea) {
  width: 200px;
}

//预览样式



.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 15px;
}

.theme-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 15px;
  flex-wrap: wrap;
}

.theme-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.theme-btn.recruit {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
}

.theme-btn.incentive {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
}

.theme-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.header {
  padding: 25px 20px;
  border-radius: 20px;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.header.recruit {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
}

.header.incentive {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.decoration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 80px;
  opacity: 0.2;
}

.activity-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  position: relative;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
  color: white;
}

.activity-type {
  display: inline-block;
  background: rgba(255, 255, 255, 0.3);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 15px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
}

.reward-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.reward-badge.recruit {
  color: #27ae60;
}

.reward-badge.incentive {
  color: #e74c3c;
}

.info-card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 2px dotted #f0f0f0;
  padding-bottom: 12px;
}

.info-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.info-icon.recruit { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); }
.info-icon.incentive { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); }

.info-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.info-content {
  color: #555;
  font-size: 0.95rem;
}

.tag {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-right: 10px;
  margin-bottom: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  color: white;
}

.region-tag.recruit { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); }
.region-tag.incentive { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); }

.time-tag {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: 500;
}

.object-tag.recruit { background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); }
.object-tag.incentive { background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); }

.detail-list {
  list-style: none;
}

.detail-list li {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: flex-start;
}

.detail-list li:last-child {
  border-bottom: none;
}

.detail-list i {
  margin-right: 12px;
  font-size: 1.1rem;
  margin-top: 3px;
}

.detail-list i.recruit { color: #27ae60; }
.detail-list i.incentive { color: #e74c3c; }

.rule-item {
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
}

.rule-number {
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  font-size: 0.9rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.rule-number.recruit { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); }
.rule-number.incentive { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); }

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  margin-bottom: 20px;
}

.btn {
  flex: 1;
  padding: 16px 20px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  color: white;
}

.btn-primary.recruit { background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); }
.btn-primary.incentive { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); }

.btn-outline {
  background: transparent;
}

.btn-outline.recruit { border: 2px solid #2ecc71; color: #27ae60; }
.btn-outline.incentive { border: 2px solid #e74c3c; color: #c0392b; }

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.footer {
  text-align: center;
  margin-top: 40px;
  color: #888;
  font-size: 0.85rem;
  padding: 20px 0;
}

.illustration {
  text-align: center;
  margin: 20px 0;
  font-size: 100px;
  animation: float 4s ease-in-out infinite;
}

.illustration.recruit { color: #2ecc71; }
.illustration.incentive { color: #e74c3c; }

.ranking-list {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.ranking-list th {
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
}

.ranking-list td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.ranking-list tr:last-child td {
  border-bottom: none;
}

.ranking-list tr:hover {
  background: #f8f9fa;
}

.rank-badge {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.rank-1 { background: #f1c40f; }
.rank-2 { background: #95a5a6; }
.rank-3 { background: #d35400; }
.rank-other { background: #3498db; }

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@media (max-width: 480px) {
  .container {
    padding: 12px;
  }

  .activity-title {
    font-size: 1.5rem;
  }

  .illustration {
    font-size: 80px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .theme-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>

<script>
import { ref, reactive, toRefs, onMounted,defineComponent,computed} from "vue";
import {getTempList} from "@/api/active";
import {useRoute,useRouter} from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import Mock from "mockjs";
import {formtTime} from "@/utils/index.js";

export default defineComponent({
  name: 'temp',
  components: {},
  setup() {
    const { query } = useRoute();
    const router = useRouter();
    const searchForm = reactive({
      name: "",
      type:'',
      date:[],
      currentPage: 1,
      perPageSize: 20,
    });
    const pdata=reactive({
      tempObj:{tempName:'',provId:'',actId:null,tempcsId:'recruit',provName:'',actName:'',time:''},
      tableData:[],
      total:0,
      loading: false,
      showAddTemp:false,
      gAry:[{id:1,name:'河南大区'},{id:2,name:'广东大区'},{id:3,name:'河北大区'}],
      atyps:[{id:1,name:'拉新人'},{id:2,name:'骑士召回'},{id:3,name:'早晚冲单'}],
      tempcsAry:[{id:'recruit',name:'样式1'},{id:'incentive',name:'样式2'}],
      conditions:[{type:''}],
      baseconditions:[{type:''}],
      spconditions:[{type:''}],
      joinconditions:[{type:''}],
      zhsucconditions:[{type:''}],
      sucOptions:[{ label: "邀请内有效天数", value: "1" },
        { label: "单量达成最大天数", value: "2" },
        { label: "达成总单量", value: "3" },
        { label: "达成有效天单量", value: "4" }],
      baseOptions:[{ label: "邀请1人奖励", value: "1" }],
      spOptions:[{ label: "指定日期", value: "1" },{ label: "达成单量", value: "2" }],
      joinOptions:[{ label: "活跃天数", value: "1" },{ label: "未活跃时间", value: "2" },{ label: "未活跃月份", value: "3" },{ label: "新人是否参与", value: "4" }],
      zhSucOptions:[{ label: "出勤天数", value: "1" },{ label: "指定时间出勤", value: "2" },{ label: "日妥投单量", value: "3" }]
    })

    onMounted(() => {
      getListData();
    })
    const addCondition = () => {
      if (pdata.conditions.length >= pdata.sucOptions.length) {
        ElMessage.warning("所有达成条件都已添加，不能再添加了")
        return
      }
      pdata.conditions.push({ type: "" })
    }
    const removeCondition = (index) => {
      pdata.conditions.splice(index, 1)
    }
    // 禁用已选的选项（避免重复）
    const isOptionDisabled = (value, currentIndex) => {
      return pdata.conditions.some(
          (item, idx) => idx !== currentIndex && item.type === value
      )
    }
    const addBaseCondition = () => {
      if (pdata.baseconditions.length >= pdata.baseOptions.length) {
        ElMessage.warning("所有基础奖励都已添加，不能再添加了")
        return
      }
      pdata.conditions.push({ type: "" })
    }
    const removeBaseCondition = (index) => {
      pdata.baseconditions.splice(index, 1)
    }
    // 禁用已选的选项（避免重复）
    const isBaseOptionDisabled = (value, currentIndex) => {
      return pdata.baseconditions.some(
          (item, idx) => idx !== currentIndex && item.type === value
      )
    }
    const addSpCondition = () => {
      if (pdata.spconditions.length >= pdata.spOptions.length) {
        ElMessage.warning("所有额外达成条件都已添加，不能再添加了")
        return
      }
      pdata.spconditions.push({ type: "" })
    }
    const removeSpCondition = (index) => {
      pdata.spconditions.splice(index, 1)
    }
    // 禁用已选的选项（避免重复）
    const isSpOptionDisabled = (value, currentIndex) => {
      return pdata.spconditions.some(
          (item, idx) => idx !== currentIndex && item.type === value
      )
    }
    const addJoinCondition = () => {
      if (pdata.joinconditions.length >= pdata.joinOptions.length) {
        ElMessage.warning("所有参与条件都已添加，不能再添加了")
        return
      }
      pdata.joinconditions.push({ type: "" })
    }
    const removeJoinCondition = (index) => {
      pdata.joinconditions.splice(index, 1)
    }
    // 禁用已选的选项（避免重复）
    const isJoinOptionDisabled = (value, currentIndex) => {
      return pdata.joinconditions.some(
          (item, idx) => idx !== currentIndex && item.type === value
      )
    }
    const addZhSucCondition = () => {
      if (pdata.zhsucconditions.length >= pdata.zhSucOptions.length) {
        ElMessage.warning("所有达成条件都已添加，不能再添加了")
        return
      }
      pdata.zhsucconditions.push({ type: "" })
    }
    const removeZhSucCondition = (index) => {
      pdata.zhsucconditions.splice(index, 1)
    }
    // 禁用已选的选项（避免重复）
    const isZhSucOptionDisabled = (value, currentIndex) => {
      return pdata.zhsucconditions.some(
          (item, idx) => idx !== currentIndex && item.type === value
      )
    }
    const searchEvent = () => {
      searchForm.currentPage = 0;
      getListData();
    };
    const getListData = async(pageObj) => {
      pdata.loading = true;
      if(pageObj){
        searchForm.currentPage=pageObj.page;
        searchForm.perPageSize=pageObj.limit;
      }
      if(searchForm.date.length>0){
        searchForm.startTime=searchForm.date[0];
        searchForm.endTime=searchForm.date[1];
      }
      const{code,data,msg}=await getTempList(searchForm);
      if(code==200){
        console.log(localStorage.getItem('tempObj'))
        let tempary=JSON.parse(localStorage.getItem('tempObj'));
        if(tempary){
          for(let o of tempary){
            let obj={
              name: o.tempName,
              id:o.id,
              time: o.time,
              typestr: o.actName,
              status:'启用',
              province: o.provName,
            }
            data.data.list.push(obj)
          }
        }
        pdata.tableData = data.data.list;
        pdata.total = Number(data.data.list.length);
        pdata.loading = false;
      }else{
        pdata.loading = false;
      }
    };
    const addTemp = () => {
      pdata.showAddTemp=true;
    }
    const editTemp = () => {

    }
    const delTemp = () => {

    }
    const saveTemp = () => {
      if(!pdata.tempObj.tempName){
        return ElMessage.info('请输入模版名称')
      }
      if(!pdata.tempObj.provId){
        return ElMessage.info('请选择省区')
      }
      let ary=[];
      const min = 1;
      const max = 1000;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      pdata.tempObj.id=randomNumber;
      pdata.tempObj.time=formtTime(new Date());
      ary.push(pdata.tempObj)
      localStorage.setItem('tempObj',JSON.stringify(ary));
      pdata.showAddTemp=false;
      getListData();
    }

    const currentTheme = ref('recruit');
    const recruitData = {
      type: "骑手拉新活动",
      title: "推荐有奖 月入过万",
      time: "2023-07-10 至 2023-08-31",
      reward: "最高奖励2000元/人",
      regions: ["全国范围", "重点: 北上广深", "新一线城市"],
      objects: ["现有京东骑手", "新加入骑手", "推荐人"],
      rules: [
        "每成功推荐一名新骑手并通过审核，奖励500元",
        "新骑手完成首月100单，额外奖励推荐人300元",
        "新骑手完成前三个月每月200单，再奖励推荐人1200元",
        "被推荐人需通过平台审核并完成培训",
        "活动期间每位骑手最多推荐5人"
      ],
      details: [
        "推荐人需在骑手APP中填写被推荐人信息",
        "被推荐人注册时需填写推荐人骑手ID",
        "奖励将在满足条件后次月10日前发放",
        "如有争议，以平台统计结果为准",
        "活动详情可咨询骑手客服热线"
      ]
    };

    const incentiveData = {
      type: "骑手冲单活动",
      title: "极速配送 冲单有奖",
      time: "2023-07-15 至 2023-07-31",
      reward: "周冠军奖励1000元",
      regions: ["全国范围", "各城市前10名", "重点商圈"],
      objects: ["所有京东骑手", "专送骑手", "众包骑手"],
      rules: [
        "活动期间每日完成30单以上即可参与排名",
        "每周结算一次，各区取前10名给予奖励",
        "第一名奖励1000元，第二名800元，第三名500元",
        "4-10名各奖励200元冲单鼓励金",
        "恶意刷单或违规操作将取消资格"
      ],
      details: [
        "系统自动统计有效订单数",
        "每周一公布上周排名及奖励名单",
        "奖励将在公布后3个工作日内发放",
        "订单需符合平台服务标准，超时率低于5%",
        "活动期间保持良好服务态度，零投诉"
      ],
      ranking: [
        { name: "张骑手", orders: 287, reward: "1000元" },
        { name: "李骑手", orders: 265, reward: "800元" },
        { name: "王骑手", orders: 243, reward: "500元" },
        { name: "刘骑手", orders: 231, reward: "200元" },
        { name: "陈骑手", orders: 225, reward: "200元" }
      ]
    };

    const activityData = computed(() => {
      return currentTheme.value === 'recruit' ? recruitData : incentiveData;
    });

    function changeTheme(theme) {
      currentTheme.value = pdata.tempcsId;
    }
    function changeProv(val) {
      const item = pdata.gAry.find(v => v.id === val)
      pdata.tempObj.provName = item?.name || "";
    }
    function changeActType(val) {
      const item = pdata.atyps.find(v => v.id === val)
      pdata.tempObj.actName =  item.name || "";
    }
    return{addSpCondition,removeSpCondition,isSpOptionDisabled,
      addBaseCondition,removeBaseCondition,isBaseOptionDisabled,
      isOptionDisabled,addCondition,removeCondition,activityData,
      changeActType,changeTheme,saveTemp,editTemp,delTemp,
      searchEvent,getListData,addTemp,currentTheme,changeProv,
      addJoinCondition,removeJoinCondition,isJoinOptionDisabled,
      addZhSucCondition,removeZhSucCondition,isZhSucOptionDisabled,
      ...toRefs(pdata),...toRefs(searchForm)};
  }
})

</script>
