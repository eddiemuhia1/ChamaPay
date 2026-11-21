export function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

export function isValidEmail(email) {
  return normalizeEmail(email).includes("@");
}

export function getUnpaidMembers(members) {
  return members.filter((m) => !m.paid);
}

export function shouldShowReminder(member) {
  if (!member) return false;
  return Boolean(member.reminderSentAt) && !member.paid;
}