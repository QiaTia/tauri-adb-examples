import { Divider, Flex, Space, message, Input } from 'antd';
import { adbCommandRun } from '@/utils/SendADB'
import { useState } from 'react';
import { FieldNumberOutlined, InfoCircleOutlined, PoweroffOutlined, RedoOutlined, SafetyCertificateOutlined, UserOutlined, WifiOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import { LayoutItem, LayoutItemProps } from '@/components/LayoutList';
const { TextArea } = Input;

export default () => {
  const spinMange = useState(''),
    [isModalOpen, setIsModalOpen] = useState(false),
    list: LayoutItemProps[] = [
      {
        name: '关机',
        icon: PoweroffOutlined,
        async onTap() {
          await adbCommandRun('reboot -p')
          message.success('命令下发成功!');
        }
      }, {
        name: '重启',
        icon: RedoOutlined,
        async onTap() {
          await adbCommandRun('reboot')
          message.success('成功! 默认保存到 Download 目录');
        }
      }, {
        name: '获取SN号',
        icon: FieldNumberOutlined,
        async onTap() {
          await adbCommandRun('getprop ro.serialno');
          message.success('命令下发成功!');
        }
      },
      {
        name: "获取电量",
        icon: FieldNumberOutlined,
        async onTap() {
          await adbCommandRun('dumpsys battery');
          message.success('命令下发成功!');
        }
      },
      {
        name: "关闭WiFi",
        icon: WifiOutlined,
        async onTap() {
          await adbCommandRun('svc wifi disable');
          message.success('命令下发成功!');
        }
      },
      {
        name: "打开WiFi",
        icon: WifiOutlined,
        async onTap() {
          await adbCommandRun('svc wifi enable');
          message.success('命令下发成功!');
        }
      },
      {
        name: "电池复位",
        icon: RedoOutlined,
        async onTap() {
          await adbCommandRun('dumpsys battery reset');
          message.success('命令下发成功!');
        }
      },
      {
        name: "清除桌面缓存",
        icon: SafetyCertificateOutlined,
        async onTap() {
          await adbCommandRun('pm clear com.ssnwt.newskyui');
          message.success('命令下发成功!');
        }
      },
      {
        name: "自定义命令",
        icon: SafetyCertificateOutlined,
        async onTap() {
          setIsModalOpen(true);
        }
      }
    ];

  const handleOk = () => {
    // ...
  };

  const [customValue, setCustomValue] = useState('');

  return (
    <Flex vertical style={{ height: '100%', width: '100%', padding: 20 }}>
      <Divider>系统相关</Divider>
      <Space size={24} wrap>
        {
          list.map((item) => <LayoutItem key={item.name} spin={spinMange} {...item} />)
        }
      </Space>

      <Modal title="自定义命令" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)} confirmLoading={spinMange[0] === '自定义命令'}>

        <div className='ortherOptions'>
          <span>
            <Tooltip title="自定义adb命令，多条命令需要以“;”隔开；按照步骤写入；注意 wait-for-device是不用写入的，在命令执行的时候默认添加">
              <InfoCircleOutlined style={{ color: '#FF9800' }} />
            </Tooltip></span>
          <TextArea
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="如：adb shell root; adb shell disable-verity;adb reboot;adb root;adb remount"
            autoSize={{ minRows: 6, maxRows: 6 }}
          />
        </div>
      </Modal>
    </Flex>
  )
}
