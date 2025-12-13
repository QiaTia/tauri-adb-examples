import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
import { Layout, Typography } from 'antd';
import { getCurrentWindow } from '@tauri-apps/api/window';

const appWindow = getCurrentWindow();

const headerStyle: React.CSSProperties = {
  height: 54,
  paddingInline: 0,
  paddingTop: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  position: 'relative',
};
const AppBarStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 12,
}

const AppHeader = ({ title }: { title: string }) => (
  <Layout.Header data-tauri-drag-region style={headerStyle}>
    <AppBar style={AppBarStyle} />
    <Typography.Title level={5} style={{ pointerEvents: 'none' }}>{ title }</Typography.Title>
  </Layout.Header>
);

function AppBar({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={ style } className="chagee-bar-app">
      <BarButton onClick={() => appWindow.hide() } type="red">
        <CloseOutlined style={{ marginTop: -1, marginLeft: -1 }} />
      </BarButton>
      <BarButton onClick={() => appWindow.minimize() } type="origin">
        <MinusOutlined style={{ marginTop: -1 }} />
      </BarButton>
      <BarButton disabled />
    </div>
  )
}
type BarButtonProp = {
  /** 是否禁用 */
  disabled?: boolean;
  /** Type类型, 默认为 Green */
  type?: 'red' | 'origin' | 'green';
  /** 里面图标 */
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>
};

function BarButton(props: BarButtonProp) {
  return (
    <div
      aria-disabled={props.disabled}
      onClick={props.onClick}
      className={`chagee-bar-btn ${props.type ?? ''} ${props.disabled ? 'disabled' : ''}`}>
      {
        props.children
      }
    </div>
  )
}

export default AppHeader;
