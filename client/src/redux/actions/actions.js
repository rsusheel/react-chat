import {
  JOIN_ROOM,
  LEAVE_ROOM,
  UPDATE_ROOM_INFO,
  CREATE_ROOM,
  UPDATE_ALL_STATE,
  TOGGLE_LOCK_ROOM,
  END_CALL,
  LEAVE_ROOM_UPDATE_INFO,
  UPDATE_SOCKET_IDS,
  USER_LEFT_SOCKET_IDS,
  UPDATE_CHAT,
} from "./types";

export const joinRoom = (roomInfo) => {
  return {
    type: JOIN_ROOM,
    payload: roomInfo,
  };
};

export const leaveRoom = (roomInfo) => {
  return {
    type: LEAVE_ROOM,
    payload: roomInfo,
  };
};

export const updateRoomInfo = (roomInfo) => {
  return {
    type: UPDATE_ROOM_INFO,
    payload: roomInfo,
  };
};

export const createRoom = (roomInfo) => {
  return {
    type: CREATE_ROOM,
    payload: roomInfo,
  };
};

export const updateAllState = (roomInfo) => {
  return {
    type: UPDATE_ALL_STATE,
    payload: roomInfo,
  };
};

export const toggleLockRoom = (roomInfo) => {
  return {
    type: TOGGLE_LOCK_ROOM,
    payload: roomInfo,
  };
};

export const endCall = (roomInfo) => {
  return {
    type: END_CALL,
    payload: roomInfo,
  };
};

export const leaveRoomUpdateInfo = (roomInfo) => {
  return {
    type: LEAVE_ROOM_UPDATE_INFO,
    payload: roomInfo,
  };
};

export const updateSocketIds = (roomInfo) => {
  return {
    type: UPDATE_SOCKET_IDS,
    payload: roomInfo
  }
}

export const userLeftSocketIds = (roomInfo) => {
  return {
    type: USER_LEFT_SOCKET_IDS,
    payload: roomInfo
  }
}

export const updateChat = (chatItem) => {
  return {
    type: UPDATE_CHAT,
    payload: chatItem
  }
}