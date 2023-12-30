import { Divider, Flex, message, Space } from 'antd';
import { adbCommandRun, runOtherCommand } from '@/utils/SendADB';
import { useState } from 'react';
import { open, OpenDialogOptions } from '@tauri-apps/api/dialog';
import { LayoutItem, LayoutItemProps } from '@/components/LayoutList';
import { AndroidOutlined, FileSyncOutlined, UsbOutlined } from '@ant-design/icons';

type FileItem =  {
  /** 文件名称 */
  fileName: string;
  /** 文件夹路径 */
  folderPath: string;
  /** 文件路径 */
  filePath: string;
  /** 文件后缀 */
  fileType: string;
}
/** 文件路径拆分 */
function splitFilePath(filePath: string): FileItem {
  const fileName = filePath.replace(/^.*[\\\/]/, '');
  const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
  const fileType = filePath.substring(filePath.lastIndexOf('.') + 1);
  return { fileName, folderPath, filePath, fileType };
}

/** 文件选择 */
async function selectFile(options: OpenDialogOptions) {
  const files = await open(options);
  if(files === null) return Promise.reject();
  if(Array.isArray(files))
    return files.map(splitFilePath);
  else return splitFilePath(files);
}

export default () => {
  const list: LayoutItemProps[] = [
    {
      name: '应用安装',
      icon: AndroidOutlined,
      async onTap() {
        const file = await selectFile({ multiple: false }) as FileItem;
        if(file.fileType != 'apk') return message.error('请选择apk后缀的安卓应用文件');
        await adbCommandRun(file.filePath, 'install');
        message.success('命令下发成功!');
      }
    }, {
      name: '文件传输',
      icon: FileSyncOutlined,
      async onTap() {
        const file = await selectFile({ multiple: false }) as FileItem;
        // await adbCommandRun( + '" "', 'push');
        await runOtherCommand(`push;${file.filePath};\/sdcard\/Download\/`)
        message.success('成功! 默认保存到 Download 目录');
      }
    }, {
      name: '打开Usb安装',
      icon: UsbOutlined,
      async onTap() {
        await adbCommandRun('settings put system adb_install_enabled 1').catch((e) => {
          console.log(e);
          message.error(`失败,可能不支持该命令`);
          return Promise.reject();
        });
        message.success('命令下发成功!');
      }
    }
  ],
  spinMange = useState('');
  return (
    <Flex vertical style={{ height: '100%', width: '100%', padding: 20 }}>
      <Divider>文件相关</Divider>
      <Space size={24} wrap>
        {
          list.map((item) => <LayoutItem key={item.name} spin={spinMange} {...item} />)
        }
      </Space>
    </Flex>
  )
}