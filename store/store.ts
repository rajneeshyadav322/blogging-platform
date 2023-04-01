import {create} from "zustand";
import { User } from "firebase/auth";
import { Firebase } from "../firebase/firebase";

interface StoreState {
  user: User | null;
}

interface Actions {
  getUser: () => void;
  reset: () => void;
}

const initialState: StoreState = {
  user: null,
};

export const useStore = create<StoreState & Actions>((set) => ({
  ...initialState,
  getUser: () => {
    Firebase.auth.onAuthStateChanged((authUser: User | null) => {
      set((state) => ({ ...state, user: authUser }));
    });
  },
  reset: () => {
    set(initialState);
  },
}));
