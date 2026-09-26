# 港口泊位与堆场协同系统

面向中小港口的船舶靠泊计划、泊位资源、堆场箱位和作业任务协同平台。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20106>

后端健康检查：<http://localhost:21106/health>

## 泊位封锁处置

泊位临时检修时，调度在泊位页提交封锁（泊位、起止时间、原因），系统自动处置受影响的靠泊计划：

- 找出该泊位上**时间重叠且未离港**的计划（`DEPARTED`/`CANCELLED`/已`PENDING_ADJUSTMENT` 不纳入）。
- 能改派到**长度和吃水都合适**且在计划时间窗内空闲、未被其他封锁覆盖的泊位时，**同步改派**；找不到则**保留原泊位**并把计划标为 `PENDING_ADJUSTMENT`（待调整），改派记录中写明冲突船舶。
- 解除封锁时**只恢复仍为待调整的计划**（回滚到封锁前状态），已改派的计划不回滚。
- 港口运行总览通过 `GET /api/dashboard/summary` 展示 `pendingAdjustmentPlans` 待调整数量；封锁与改派记录可随时通过列表接口查看。

新增接口：

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/berth-blockade` | 封锁记录列表 |
| POST | `/api/berth-blockade` | 创建封锁并同步处置受影响计划（dispatcher/admin） |
| POST | `/api/berth-blockade/:id/lift` | 解除封锁，恢复仍待调整的计划 |
| GET | `/api/berth-reassignment` | 改派/待调整记录（支持 `?blockade_id=` 过滤） |
| GET | `/api/dashboard/summary` | 总览汇总（含待调整数量、进行中封锁数） |

后端场景自测：`cd backend && npm run test:scenario`（覆盖改派、待调整、解除恢复、不回滚与异常分支）。


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

## 枚举/常量出现位置清单

- BerthPlanStatus: constants/BerthPlanStatus、types/BerthPlanStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用；新增 `PENDING_ADJUSTMENT`（待调整）用于泊位封锁处置，豁免/占用状态集合 `BLOCKADE_EXEMPT_STATUSES`、`BERTH_OCCUPYING_STATUSES` 同文件维护。
- BerthBlockadeStatus: constants/BerthBlockadeStatus（前后端各一份）、constants/statusText、utils/formatters、封锁记录展示均有引用。
- BerthReassignmentAction: constants/BerthReassignmentAction（前后端各一份）、constants/statusText、utils/formatters、改派记录展示均有引用。
- YardSlotStatus: constants/YardSlotStatus、types/YardSlotStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- WorkTaskType: constants/WorkTaskType、types/WorkTaskType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
