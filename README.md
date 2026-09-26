# 港口泊位与堆场协同系统

面向中小港口的船舶靠泊计划、泊位资源、堆场箱位和作业任务协同平台。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20106>

后端健康检查：<http://localhost:21106/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Angular 17 + TypeScript + RxJS + NG-ZORRO + ECharts |
| 后端 | NestJS + TypeScript + TypeORM |
| 数据库 | MySQL 8.0 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `port-yard`
- `FRONTEND_PORT`: 前端端口，默认 `20106`
- `BACKEND_PORT`: 后端端口，默认 `21106`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: port-yard`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-port-yard}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 泊位封锁处置（临时检修）

泊位页（`/berths`）提供封锁处置表单：调度填写泊位、起止时间和原因后，系统自动找出该泊位上时间重叠且未离港（非 DEPARTED/CANCELLED）的靠泊计划并逐条处置：

- 能找到长度 ≥ 船长且水深 ≥ 吃水的空闲泊位（无时间重叠计划、无生效中封锁）时，同步改派并保持原计划状态；
- 找不到时保留原泊位，计划状态置为 `PENDING_ADJUST`（待调整），并在处置记录中写明冲突船舶；
- 解除封锁只恢复仍为待调整的计划（回滚到处置前状态），已改派的计划不回滚；
- 总览页（`/dashboard`）实时显示待调整计划数量和生效中封锁数；
- 封锁记录与改派/待调整/恢复记录可随时在泊位页查看。

相关接口：

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/berth-blockade` | 封锁记录列表 |
| GET | `/api/berth-blockade/summary` | 总览统计（生效中封锁、待调整数） |
| GET | `/api/berth-blockade/adjustments` | 改派/待调整/恢复记录 |
| POST | `/api/berth-blockade` | 创建封锁并自动处置 `{berth_id, block_start, block_end, reason, dispatcher_id?}` |
| POST | `/api/berth-blockade/:id/lift` | 解除封锁，仅恢复仍待调整的计划 |

## 枚举/常量出现位置清单

- BerthPlanStatus（含 `PENDING_ADJUST` 待调整）: 前后端 constants/BerthPlanStatus、types/BerthPlanStatus、constructors、logTemplates、errorMessages、statusText、hooks/useBerthBlockade、services/BerthBlockadeService、泊位页/总览页展示组件均有引用。
- BerthBlockadeStatus（ACTIVE/LIFTED）: 前后端 constants/BerthBlockadeStatus、statusText、constructors/BerthBlockade*、services/BerthBlockadeService、泊位页与总览页展示组件均有引用。
- AdjustmentAction（REASSIGNED/PENDING_ADJUST/RESTORED）: 前后端 constants/AdjustmentAction、statusText、constructors/BerthPlanAdjustment*、services/BerthBlockadeService、泊位页处置记录表均有引用。
- YardSlotStatus: constants/YardSlotStatus、types/YardSlotStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- WorkTaskType: constants/WorkTaskType、types/WorkTaskType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
