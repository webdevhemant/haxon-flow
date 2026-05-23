import PropTypes from 'prop-types'
import { createContext, useContext } from 'react'

const ConfigContext = createContext()

export const ConfigProvider = ({ children }) => {
    const value = {
        config: { PLATFORM_TYPE: 'opensource' },
        loading: false,
        isEnterpriseLicensed: false,
        isCloud: false,
        isOpenSource: true
    }
    return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}

export const useConfig = () => useContext(ConfigContext)

ConfigProvider.propTypes = {
    children: PropTypes.any
}
