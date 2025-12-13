import { Avatar, List, Button, Flex, message, Typography, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { AndroidOutlined, ReloadOutlined } from '@ant-design/icons';
import { adbCommandRun, adbCommand, errorIntercept } from '@/utils/SendADB';
import { getPackageInfo } from '@/utils/api';
import { useModal, showDialog } from '@/components/Dialog';
import Schema from '@/components/Schema';

const Application = () => {
  
  const [appList, setAppList] = useState<{ title: string, description: string; icon?: string; }[]>([]),
    [modal, contextHolder] = useModal();

  const getAdbAppList = async () => {
    setAppList([]);
    const adb = adbCommand('pm list packages -3');
    // adb.stdout.on('data', (line: string) => setAppList((list) => {
    //   return [...list, { title: line.split('.').pop()?.toLocaleUpperCase() ?? '', description: line.replace('package:', '').trim(), }];
    // }));
    // adb.stderr.on('data', (line: string) => errorIntercept({ stderr: line }))
    const output = await adb.execute();
    if (output.stdout == '') return;
    const list = output.stdout.split('\n')
      .map((line) => ({ title: line.split('.').pop()?.toLocaleUpperCase() ?? '', description: line.replace('package:', '').trim(), }))
    setAppList(list);
  };
  /** 获取一些信息 */
  async function handleVersion(i: number) {
    const item = appList[i];
    const infoMap: Record<string, string> = {
      packageName: item.description,
      title: item.title,
    };
    getPackageInfo(item.description).then((result) => {
      if(!result.name) return Promise.reject();
      infoMap.description = result.description;
      infoMap.icon = result.iconUrl;
      infoMap.title = result.name;
      setAppList((list) => {
        list[i].title = result.name;
        list[i].icon = result.iconUrl;
        return [...list];
      });
    }).finally(() => {
      showDialog(modal, <Schema columns={[
        {
          name: '基本信息',
          type: 'title',
          columns: [
            { name: '应用名称', dataIndex: 'title' },
            { name: '应用包名', dataIndex: 'packageName' },
            { name: '', dataIndex: 'icon', render: () => <Avatar { ...(item.icon ? { src: <img src={item.icon} alt="avatar" /> } : { icon: <AndroidOutlined />}) } /> },
          ]
        },
        {
          name: '市场信息',
          type: 'title',
          columns: [
            { name: '应用名称', dataIndex: 'title' },
            { name: '应用描述', dataIndex: 'description' },
          ]
        },{
          name: '其他信息',
          type: 'title',
          columns: [
            { name: '应用版本', dataIndex: 'versionName' },
            { name: '内部版本号', dataIndex: 'versionCode' },
            { name: 'signatures', dataIndex: 'signatures' }
          ]
        }
      ]} values={infoMap} />);
    });
    const result = await adbCommandRun(`dumpsys package ${item.description} | grep version`);
    result.split('\n').forEach((str) => {
      const [key, value] = str.split('=');
      if (!key) return;
      infoMap[key.trim()] = value.trim() ?? '';
    });
    // notification.info({ message: JSON.stringify(infoMap) });
  }
  /** 启动APP */
  async function handleOpen(item: typeof appList[number]) {
    const result = await adbCommandRun(`dumpsys package ${item.description}`);
    const list = result.split('\n');
    let start = -1, end = 0;
    while (list[end] !== void 0) {
      if (start > -1) {
        if(/\S/.test(list[end][0])) break;
      }
      else if (list[end].toLocaleLowerCase().includes('activity')) start = end;
      end++;
    }
    // return;
    // list.findIndex(() => { });
    /** 去重, 格式化, 整理数据 */
    const reg = new RegExp(item.description + '/(\\w)');
    const activityList = Array.from(new Set(list.slice(start, end)
      .filter((str) =>reg.test(str))
      .map((str) => {
        const tempList = str.split(' ');
        return tempList.find((tempStr) => tempStr.includes(item.description))?.trim() ?? '';
      }).reverse()));
    const str = activityList.find((str) => str.toLocaleLowerCase().includes('mainactivity')) ||
      activityList.find((str) => str.toLocaleLowerCase().includes('main')) ||
      activityList[0];
    console.log(activityList);
    if (!str) return message.error('未找到 Activity, 可能改应用没有提供');
    message.info(`启动 Activity: ${str}, 请稍后...`);
    await adbCommandRun(`am start -n ${str}`);
  }
  /** 卸载app */
  async function handleDelete(item: typeof appList[number]) {
    Modal.confirm({
      content: `确定卸载应用 ${item.description}?`,
      onOk() {
        adbCommandRun(`pm uninstall ${item.description}`)
          .finally(getAdbAppList)
          .then(() => message.info(`命令已下发, 请稍后...`));
      }
    });
  }
  /** 禁用app */
  function handleDisable(item: typeof appList[number]) {
    Modal.confirm({
      content: `确定禁用应用 ${item.description}?`,
      onOk() {
        adbCommandRun(`pm disable-user ${item.description}`)
          .then(() => message.info(`命令已下发, 请稍后...`));
      }
    });
  }
  useEffect(() => {
    // adbCommandRun(`getprop ro.product.model`).then((result) => {
    //   console.log(result);
    // });
    getAdbAppList();
  }, []);
  return (
    <Flex vertical style={{ height: '100%', width: '100%' }}>
      <Flex align="center" style={{ padding: '10px 20px' }}>
        <Typography.Title level={5}>第三方应用列表</Typography.Title>
        {/* <Divider orientation="left"></Divider> */}
        <Flex justify="end" flex={1}>
          <Button size="small" icon={<ReloadOutlined/>} type="primary" onClick={getAdbAppList}>刷新</Button>
        </Flex>
      </Flex>
      <List
        itemLayout="horizontal"
        dataSource={appList}
        style={{ flex: 1, overflowY: 'auto', textAlign: 'left', padding: 10 }}
        renderItem={(item, index) => (
          <List.Item
            key={item.description}
            actions={[
              <Button danger onClick={() => handleDelete(item)} type="text">Delete</Button>,
              <Button danger onClick={() => handleDisable(item)} type="text">Disable</Button>,
              <Button onClick={() => handleOpen(item)} type="link">Start</Button>,
              <Button onClick={() => handleVersion(index)} type="text">Info</Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar { ...(item.icon ? { src: <img src={item.icon} alt="avatar" /> } : { icon: <AndroidOutlined />}) } />}
              {...item}
            />
          </List.Item>
        )}
      />
      { contextHolder }
    </Flex>
  );
};

export default Application;
