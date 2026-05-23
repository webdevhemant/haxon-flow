import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: { name: 'Haxon User', email: 'user@haxon.ai', id: 'local' },
    isAuthenticated: true,
    isGlobal: true,
    token: null,
    permissions: [],
    features: {}
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            if (action.payload?.user) state.user = action.payload.user
        },
        logoutSuccess: () => initialState,
        workspaceSwitchSuccess: () => {},
        upgradePlanSuccess: () => {},
        userProfileUpdated: () => {},
        workspaceNameUpdated: () => {}
    }
})

export const { loginSuccess, logoutSuccess, workspaceSwitchSuccess, upgradePlanSuccess, userProfileUpdated, workspaceNameUpdated } =
    authSlice.actions
export default authSlice.reducer
