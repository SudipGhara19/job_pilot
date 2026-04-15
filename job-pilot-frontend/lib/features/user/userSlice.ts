import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Company {
  companyName: string
  organizationType? : string
  industryType?: string
  teamSize?: string
  yearOfEstablishment?: string
  aboutUs?: string
  location?: string
  contactNumber?: string
  email?: string
}

export interface User {
  _id: string
  fullName: string
  username: string
  email: string
  token: string
  company?: Company
}

interface UserState {
  currentUser: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
    },
    clearCurrentUser: (state) => {
      state.currentUser = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setCurrentUser, clearCurrentUser, setLoading, setError } = userSlice.actions
export default userSlice.reducer
