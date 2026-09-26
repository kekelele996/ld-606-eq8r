export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  BERTH_NOT_FOUND: "泊位不存在",
  BLOCKADE_NOT_FOUND: "泊位封锁记录不存在",
  BLOCKADE_ALREADY_LIFTED: "该封锁已解除，请勿重复操作",
  BLOCKADE_TIME_INVALID: "封锁开始时间必须早于结束时间"
};
