export function getGroupNameToSave(role, groupName) {
  if (role !== "treasurer") return "";
  return (groupName || "").trim();
}

export function isGroupNameMissing(role, groupName) {
  return role === "treasurer" && getGroupNameToSave(role, groupName) === "";
}

export function getGroupLabel(groupName, fallback = "Your group") {
  const cleaned = (groupName || "").trim();
  return cleaned || fallback;
}
