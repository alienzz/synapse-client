import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native-web'
import { connect } from 'react-redux'
import { Router } from 'react-router-dom'
import * as messageActions from './actions/messages/message.actions'
import Typography from '@material-ui/core/Typography'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import * as authActions from './actions/auth/auth.actions'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBrowserHistory } from "history";
import Helmet from './components/Helmet'
import Routes from './routes'
import { GuardSpinner } from 'react-spinners-kit'
import Recaptcha from './components/Captcha'

const actions = {
  ...messageActions,
  ...authActions
}

const checkStorage = () => {
  try {
    localStorage.setItem('storageCheck', '1');
    localStorage.removeItem('storageCheck');
    return true;
  } catch (err) {
    return false;
  }
}

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
  typography: {
    fontFamily:"Roboto Mono"
  }
});

export const history = createBrowserHistory()


function App(props) {
  const [fetching, setFetch] = useState(true)
  const { checkHumanToken } = props
  useEffect(() => {
    let hasStorage = checkStorage()
    if (hasStorage) {
      const token = localStorage.getItem('token')
      checkHumanToken(token, () => {
        setFetch(false)
      })
    }
  }, [checkHumanToken])
  const { human } = props
  if (fetching) {
    return (
      <View style={styles.loading}>
        <GuardSpinner />
      </View>
    )
  }
  if (!human) {
    return (
      <View style={styles.loading}>
        <Recaptcha />
          <Typography 
            align="center" 
            variant="caption" 
            style={{color: "#666", maxWidth: 250, marginTop: "1rem"}}>By checking this box you are declaring you are not a robot. You are also accepting our terms of service which forbids posting illegal content. Thank you.</Typography>
      </View>
    )
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <View>
        <Router history={history}>
          <Routes />
        </Router>
        <ToastContainer />
      </View>
      <Helmet />
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    marginTop: "20%",
    alignItems: 'center'
  },
})

const mapStateToProps = state => {
  return { 
    human: state.auth.human,
  }
}

export default connect(mapStateToProps, actions)(App)