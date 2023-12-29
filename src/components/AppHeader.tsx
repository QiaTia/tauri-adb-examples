import { Layout, Typography } from 'antd';

const headerStyle: React.CSSProperties = {
  height: 40,
  paddingInline: 0,
  lineHeight: '60',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'move',
  backgroundColor: 'transparent'
};

const AppHeader = () => {
  return (
    <Layout.Header data-tauri-drag-region style={headerStyle}>
      <Typography.Title level={5} style={{ pointerEvents: 'none' }}>Quest ` Tools</Typography.Title>
    </Layout.Header>
  );
};

export default AppHeader;
