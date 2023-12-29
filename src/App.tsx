import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ConfigProvider, Layout, theme } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { routes } from '@/router';
import AppHeader from '@/components/AppHeader';
import AppSider from '@/components/AppSider';
const LayoutStyle: React.CSSProperties = {
  height: "100%",
  width: '100%',
  paddingBottom: 8,
  paddingRight: 8,
}

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '90%',
  color: '#fff',
  borderRadius: '10px',
  backgroundColor: 'var(--bg-color)',
  overflowY: 'auto',
};
function App() {
  console.log(theme.useToken())
  return (
    <ConfigProvider locale={zhCN} theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorBgLayout: 'var(--bar-bg-color)',
        colorPrimary: '#53e3a6'
      }
    }}>
      <Layout style={LayoutStyle}>
        <AppHeader />
        <Layout>
          <Router>
            <AppSider />
            <Layout.Content style={contentStyle}>
              <Routes>
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<route.component />}
                  />
                ))}
              </Routes>
            </Layout.Content>
          </Router>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
