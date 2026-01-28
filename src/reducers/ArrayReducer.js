export default function ArrayReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.data];

    case 'add_multiple':
      return [...state, ...action.data];

    case 'prepend':
      return [action.data, ...state];

    case 'remove':
      return state.filter((_, index) => index !== action.data);

    case 'remove_by_value':
      return state.filter(item => item !== action.data);

    case 'update':
      return state.map((item, index) =>
        index === action.data.index ? action.data.value : item
      );

    case 'update_by_id':
      return state.map(item =>
        item.id === action.data.id ? { ...item, ...action.data.updates } : item
      );

    case 'replace':
      return action.data;

    case 'clear':
      return [];

    case 'filter':
      return state.filter(action.data);

    case 'sort':
      return [...state].sort(action.data);

    case 'reverse':
      return [...state].reverse();

    case 'toggle':
      return state.includes(action.data)
        ? state.filter(item => item !== action.data)
        : [...state, action.data];

    case 'insert':
      const newArray = [...state];
      newArray.splice(action.data.index, 0, action.data.value);
      return newArray;

    case 'move':
      const arr = [...state];
      const [removed] = arr.splice(action.data.from, 1);
      arr.splice(action.data.to, 0, removed);
      return arr;

    default:
      return state;
  }
}
