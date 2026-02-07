export default function ObjectReducer(state, action) {
  switch (action.type) {
    case "set":
      return {
        ...state,
        [action.key]: action.value,
      };

    case "replace":
      return { ...action.data };

    case "concat":
      return {
        ...state,
        ...action.data,
      };

    case "remove":
      let result = { ...state };
      for (let key of action.keys) delete result[key];
      return result;

    case "clear":
      return {};

    default:
      return state;
  }
}
