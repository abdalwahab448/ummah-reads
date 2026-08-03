import type { Track, UserSession } from "@/lib/types";

export function isOwner(session: UserSession) {
  return session.role === "OWNER";
}

export function isManager(session: UserSession) {
  return session.role === "MANAGER";
}

export function isSupervisor(session: UserSession) {
  return session.role === "SUPERVISOR";
}

export function canViewTrack(session: UserSession, track: Track) {
  return session.role === "OWNER" || session.track === track;
}

export function canApproveSupervisors(session: UserSession) {
  return session.role === "OWNER" || session.role === "MANAGER";
}

export function canManageCenters(session: UserSession, track?: Track) {
  if (session.role === "OWNER") {
    return true;
  }

  if (session.role === "MANAGER" && track) {
    return session.track === track;
  }

  return session.role === "MANAGER";
}

export function canAssignSupervisors(session: UserSession, track?: Track) {
  return canManageCenters(session, track);
}

export function canManageStudent(
  session: UserSession,
  studentTrack: Track,
  studentCenterId: string
) {
  if (session.role === "OWNER") {
    return true;
  }

  if (session.role === "MANAGER" && session.track === studentTrack) {
    return true;
  }

  if (
    session.role === "SUPERVISOR" &&
    session.isApproved &&
    session.centerId === studentCenterId
  ) {
    return true;
  }

  return false;
}

export function canViewStudents(session: UserSession, track?: Track) {
  if (session.role === "OWNER") {
    return true;
  }

  if (track && !canViewTrack(session, track)) {
    return false;
  }

  return ["OWNER", "MANAGER", "SUPERVISOR"].includes(session.role);
}

export function canLogReading(
  session: UserSession,
  studentTrack: Track,
  studentCenterId: string
) {
  return canManageStudent(session, studentTrack, studentCenterId);
}

export function canViewMasterBooks(session: UserSession) {
  return ["OWNER", "MANAGER", "SUPERVISOR"].includes(session.role);
}

export function canAddMasterBook(session: UserSession, track: Track) {
  if (session.role === "OWNER") {
    return true;
  }

  if (session.role === "MANAGER" || session.role === "SUPERVISOR") {
    return session.track === track;
  }

  return false;
}

export function canDeleteMasterBook(session: UserSession, track: Track) {
  if (session.role === "OWNER") {
    return true;
  }

  if (session.role === "MANAGER") {
    return session.track === track;
  }

  return false;
}
