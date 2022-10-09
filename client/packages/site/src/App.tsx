import { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
// import { WagmiConfig, createClient } from 'wagmi';
// import { getDefaultProvider } from 'ethers';

import { Footer, Header, Home } from './components';
import { MetaMaskProvider } from './hooks';

import { light, dark, GlobalStyle } from './config/theme';
import { setLocalStorage, getThemePreference } from './utils';

// eslint-disable-next-line import/no-unassigned-import
import './styles/styles.css';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

// const client = createClient({
//   autoConnect: true,
//   provider: getDefaultProvider(),
// });

function App() {
  const [darkTheme, setDarkTheme] = useState(getThemePreference());

  const toggleTheme = () => {
    setLocalStorage('theme', darkTheme ? 'light' : 'dark');
    setDarkTheme(!darkTheme);
  };

  return (
    <ThemeProvider theme={darkTheme ? dark : light}>
      <MetaMaskProvider>
        <GlobalStyle />
        <Wrapper>
          <Header handleToggleClick={toggleTheme} />
          <Home />
          <Footer />
        </Wrapper>
      </MetaMaskProvider>
    </ThemeProvider>
  );
}

export default App;
