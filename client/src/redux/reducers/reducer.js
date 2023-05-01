import {
  JOIN_ROOM,
  LEAVE_ROOM,
  UPDATE_ROOM_INFO,
  CREATE_ROOM,
  UPDATE_ALL_STATE,
  TOGGLE_CHAT_ALL,
  TOGGLE_DRAW_ALL,
  TOGGLE_DRAW_SELF,
  TOGGLE_LOCK_ROOM,
  TOGGLE_MUTE_ALL,
  TOGGLE_MUTE_SELF,
  END_CALL,
  PERMANENT_MUTE,
  LEAVE_ROOM_UPDATE_INFO,
  UPDATE_SOCKET_IDS,
  USER_LEFT_SOCKET_IDS,
} from "../actions/types";

const initialState = {
  personal: {
    username: "",
    room: "",
    creator: false,
    chatEnabled: true,
    drawEnabled: true,
    selfMute: false,
    adminMute: false,
    socketIds: [],
  },

  universal: {
    room: "",
    roomTitle: "",
    users: [],
    creator: "",
    locked: false,
    chatEnabled: true,
    drawEnabled: true,
    allMute: false,
  },
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case JOIN_ROOM:
      return {
        ...state,
        personal: {
          ...state.personal,
          username: action.payload.username,
          room: action.payload.room,
          creator: false,
        },
      };

    case UPDATE_ROOM_INFO:
      return {
        ...state,
        universal: {
          ...state.universal,
          users: [...state.universal.users, action.payload.username],
        },
      };

    case CREATE_ROOM:
      return {
        personal: {
          ...state.personal,
          username: action.payload.username,
          room: action.payload.room,
          creator: true,
        },
        universal: {
          ...state.universal,
          room: action.payload.room,
          roomTitle: action.payload.roomTitle,
          users: [action.payload.username],
          creator: action.payload.username,
          locked: false,
        },
      };

    case UPDATE_ALL_STATE:
      return {
        ...state,
        universal: {
          ...state.universal,
          room: action.payload.room,
          roomTitle: action.payload.roomTitle,
          users: action.payload.users,
          creator: action.payload.creator,
          locked: action.payload.locked,
          chatEnabled: action.payload.chatEnabled,
          drawEnabled: action.payload.drawEnabled,
          allMute: action.payload.allMute,
        },
      };

    case TOGGLE_CHAT_ALL:
      return {
        personal: {
          ...state.personal,
        },
        universal: {
          ...state.universal,
          chatEnabled: !state.universal.chatEnabled,
        },
      };

    case TOGGLE_DRAW_ALL:
      return {
        ...state,
        personal: {
          ...state.personal,
          drawEnabled: false,
        },
        universal: {
          ...state.universal,
          drawEnabled: !state.universal.drawEnabled,
        },
      };

    case TOGGLE_DRAW_SELF:
      return {
        ...state,
        personal: {
          ...state.personal,
          drawEnabled: !state.personal.drawEnabled,
        },
      };

    case TOGGLE_MUTE_ALL:
      return {
        ...state,
        personal: {
          ...state.personal,
          selfMute: true,
        },
        universal: {
          ...state.universal,
          allMute: !state.universal.allMute,
        },
      };

    case TOGGLE_MUTE_SELF:
      return {
        ...state,
        personal: {
          ...state.personal,
          selfMute: !state.personal.selfMute,
        },
      };

    case TOGGLE_LOCK_ROOM:
      return {
        ...state,
        universal: {
          ...state.universal,
          locked: !state.universal.locked,
        },
      };

    case PERMANENT_MUTE:
      return {
        ...state,
        personal: {
          ...state.personal,
          adminMute: !state.personal.adminMute,
        },
      };

    case LEAVE_ROOM: {
      var filtered = state.universal.users.filter((user) => {
        return user !== action.payload.username;
      });
      return {
        ...state,
        universal: {
          ...state.universal,
          users: filtered,
        },
      };
    }

    case LEAVE_ROOM_UPDATE_INFO: {
      return initialState;
    }

    case UPDATE_SOCKET_IDS: {
      return {
        ...state,
        personal: {
          ...state.personal,
          socketIds: [...state.personal.socketIds, action.payload.socketId]
        }
      }
    }

    case USER_LEFT_SOCKET_IDS: {
      var filtered = state.personal.socketIds.filter((user) => {
        return user !== action.payload.socketId;
      });
      return {
        ...state,
        personal: {
          ...state.personal,
          socketIds: filtered
        }
      }
    }

    case END_CALL:
      return state;

    default:
      return state;
  }
};

export default appReducer;
