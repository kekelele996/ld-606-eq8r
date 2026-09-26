export const LOG_TEMPLATES = {
  Vessel: ["Vessel.create", "Vessel.update", "Vessel.status", "Vessel.export"],
  Berth: ["Berth.create", "Berth.update", "Berth.status", "Berth.export"],
  BerthPlan: ["BerthPlan.create", "BerthPlan.update", "BerthPlan.status", "BerthPlan.export", "BerthPlan.reassign", "BerthPlan.pendingAdjustment"],
  BerthBlockade: ["BerthBlockade.create", "BerthBlockade.lift", "BerthBlockade.status", "BerthBlockade.export"],
  BerthReassignment: ["BerthReassignment.create", "BerthReassignment.restore", "BerthReassignment.status", "BerthReassignment.export"],
  YardSlot: ["YardSlot.create", "YardSlot.update", "YardSlot.status", "YardSlot.export"],
  WorkTask: ["WorkTask.create", "WorkTask.update", "WorkTask.status", "WorkTask.export"]
};
