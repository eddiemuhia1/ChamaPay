export function getRemoveConfirmMessage(member) {
  return `Remove ${member.name} from your group? This cannot be undone.`;
}

export function canRemoveMember(member, treasurerId) {
  return Boolean(member) && Boolean(treasurerId) && member.treasurerId === treasurerId;
}
