import { BerthBlockadeStatusText, type BerthBlockadeStatus } from "../constants/BerthBlockadeStatus";
import { BerthReassignmentActionText, type BerthReassignmentAction } from "../constants/BerthReassignmentAction";

export const formatDate = (value: string) => new Date(value).toLocaleString("zh-CN");
export const formatStatus = (value: string) => value.replace(/_/g, " ");
export const formatNumber = (value: number) => new Intl.NumberFormat("zh-CN").format(value);
export const formatRisk = (value: string) => ({ LOW: "低", MEDIUM: "中", HIGH: "高", CRITICAL: "严重", EXTREME: "极高" }[value] ?? value);
export const formatBerthBlockadeStatus = (value: string) => BerthBlockadeStatusText[value as BerthBlockadeStatus] ?? value;
export const formatReassignmentAction = (value: string) => BerthReassignmentActionText[value as BerthReassignmentAction] ?? value;
// 改派记录展示状态：已恢复的待调整记录优先显示“已恢复”
export const formatReassignmentState = (record: { action: string; restored_at: string | null }) =>
  record.restored_at ? "已恢复" : formatReassignmentAction(record.action);
