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
} from "../actions/types";

const initialState = {
  personal: {
    username: "",
    room: "",
    creator: false,
    socketIds: [],
    chat: [],
  },

  universal: {
    room: "",
    roomTitle: "",
    users: [],
    creator: "",
    locked: false,
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
      let filtered = state.personal.socketIds.filter((user) => {
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

    case UPDATE_CHAT: {
      return {
        ...state,
        personal: {
          ...state.personal,
          chat: [...state.personal.chat, action.payload.chat]
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
