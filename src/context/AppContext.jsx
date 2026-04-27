import { createContext, useContext, useReducer, useEffect } from "react";

const AppContext = createContext();

const initialState = {
  theme: "light",
  savedSpaces: [],
  reviews: [],
  preferences: {},
  reports: [],
  searchHistory: [],
  recentlyViewed: [],
  user: { name: "Guest User", avatar: "GU" },
  toasts: [],
};

function loadFromStorage() {
  try {
    const saved = localStorage.getItem("prsf_state");
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch {
    return initialState;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME":
      return { ...state, theme: state.theme === "light" ? "dark" : "light" };

    case "TOGGLE_SAVE_SPACE": {
      const exists = state.savedSpaces.find((s) => s.id === action.payload.id);
      const savedSpaces = exists
        ? state.savedSpaces.filter((s) => s.id !== action.payload.id)
        : [...state.savedSpaces, action.payload];
      return { ...state, savedSpaces };
    }

    case "ADD_REVIEW": {
      const reviews = [...state.reviews, { ...action.payload, id: Date.now() }];
      return { ...state, reviews };
    }

    case "SET_PREFERENCES":
      return { ...state, preferences: { ...state.preferences, ...action.payload } };

    case "ADD_REPORT": {
      const reports = [...state.reports, { ...action.payload, id: Date.now() }];
      return { ...state, reports };
    }

    case "VOTE_REPORT": {
      const reports = state.reports.map((r) =>
        r.id === action.payload.id
          ? { ...r, helpful: (r.helpful || 0) + action.payload.vote }
          : r
      );
      return { ...state, reports };
    }

    case "ADD_SEARCH_HISTORY": {
      const history = [action.payload, ...state.searchHistory.filter((h) => h !== action.payload)].slice(0, 10);
      return { ...state, searchHistory: history };
    }

    case "ADD_RECENTLY_VIEWED": {
      const recentlyViewed = [
        action.payload,
        ...state.recentlyViewed.filter((r) => r.id !== action.payload.id),
      ].slice(0, 5);
      return { ...state, recentlyViewed };
    }

    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };

    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, loadFromStorage);

  useEffect(() => {
    const { toasts, ...persistable } = state;
    localStorage.setItem("prsf_state", JSON.stringify(persistable));
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    dispatch({ type: "ADD_TOAST", payload: { message, type, id } });
    setTimeout(() => dispatch({ type: "REMOVE_TOAST", payload: id }), 3500);
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
