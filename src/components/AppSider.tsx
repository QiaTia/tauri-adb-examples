import { useState, useEffect } from 'react';
import { Flex, Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { routes } from '@/router/index';
const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '100%',
  color: '#fff',
  paddingInline: 10,
  backgroundColor: 'transparent'
};

const AppSider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathName, setPathName] = useState('');
  useEffect(() => {
    setPathName(location.pathname);
  }, [location]);
  function handleTap(item: typeof routes[number]) {
    navigate(item.path);
  }
  return (
    <Layout.Sider width={64} style={siderStyle} trigger={null} collapsible collapsed={true}>
      <Flex align="center" justify="center" vertical>
        {
          routes.map((item, index) => 
            <Flex align="center" justify="center" onClick={() => handleTap(item)} className={`sider-item ${pathName === item.path ? "active" : ""}`} key={index}>
              <item.icon />
            </Flex>
          )
        }
      </Flex>
    </Layout.Sider>
  );
};

export default AppSider;
