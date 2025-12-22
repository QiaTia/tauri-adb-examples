import { Button, Flex, Typography, Divider, Input, message } from 'antd';
import { useState } from 'react';
import { useModal, showDialog } from '@/components/Dialog';
import TextArea from 'antd/es/input/TextArea';
import { Command, ChildProcess } from '@tauri-apps/plugin-shell';

function Application() {
  
  const [customValue, setCustomValue] = useState(''),
    [fileName, setFileName] = useState(''),
    [logList, setLogList] = useState<string[]>([]),
    [modal, contextHolder] = useModal();
  async function onStart() {
    if (!customValue) {
      return message.error('请输入目标视频的url地址');
    }
    const name = fileName || (Math.random() * 9e9).toString(32).slice(-3);
    const shell = Command.create('ffmpeg', ['-i', `${customValue} -vcodec copy -acodec copy ${name}.mp4`]);
    shell.on('close', onClose);
    shell.on('error', onError);
    setLogList([]);
    shell.stdout.on('data', function(avg) {
      console.log(avg);
      setLogList((list) => [...list, avg]);
    });
    const result = await shell.spawn();
    console.log(shell, result);
  }
  function onError(arg: unknown) {
    console.log(arg);
    message.error('发生了一些问题');
  }
  function onClose(arg: unknown) {
    console.log(arg);
    message.success('over');
  }

  return (
    <Flex vertical style={{ height: '100%', width: '100%', padding: 20 }}>
      <Flex align="center" style={{ marginTop: -10 }}>
        <Divider orientation='horizontal'>
          <Typography.Title level={5}>M3U8视频合并</Typography.Title>
        </Divider>
      </Flex>
      <Flex vertical style={{ marginTop: 20 }} gap={20}>
         <TextArea
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="输入目标视频的url地址、如 https://h.cn/videos/c.m3u8"
            autoSize={{ minRows: 3, maxRows: 3 }}
          />
          <Input size="large" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="文件名称、默认会生成一个随机文件名称" />
          <Button onClick={onStart} size="large">开始</Button>
      </Flex>
      <div style={{ flex: 1, marginTop: 20, borderRadius: 4, padding: 20, borderStyle: 'solid', borderColor: 'var(--ant-color-border)', borderWidth: 1}}>
        <pre style={{ padding: 10,  }}>
          {
            logList.map((str) => <p>{str}</p>)
          }
        </pre>
      </div>
      { contextHolder }
    </Flex>
  );
};

export default Application;
