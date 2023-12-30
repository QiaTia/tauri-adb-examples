import { invoke } from '@tauri-apps/api/tauri';
import { ChildProcess, Command } from '@tauri-apps/api/shell';
import { message } from 'antd';

/** 直接用rs执行 Command */
export const runOtherCommand = async (command: string) => {
  try {
    const output: string = await invoke('execute_command', { command: command });
    console.log({ command, output })
    return output;
  } catch (error) {
    return null;
  }
}
/** 直接返回 Command */
export const adbCommand = (str: string, action = "shell") => new Command('run-adb', [action, str])

/**
 * 执行adb命令
 * @param str 要执行的adb命令
 * @returns 返回命令的标准输出
 */
export async function adbCommandRun (str: string, action?: string) {
  const result = await adbCommand(str, action).execute();
  console.log(result);
  await errorIntercept(result);
  return result.stdout;
}

/** 统一错误拦截 */
export function errorIntercept ({ stderr }: Pick<ChildProcess, 'stderr'>) {
  if (stderr !== '') {
    const regex = /no devices|device '\(null\)' not found|device not found/;
    if(regex.test(stderr)) message.error('未连接设备'); 
    else if(stderr.toLocaleLowerCase().includes('performing streamed install'.toLocaleLowerCase()))
      message.error('安装失败, 可能未打开usb安装或者拒绝!');
    else if (stderr.toLocaleLowerCase().includes('operation not permitted'))
      message.error('无权进行此操作!');
    return Promise.reject(stderr);
  }
}
