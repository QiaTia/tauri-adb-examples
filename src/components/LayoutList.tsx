import { sleep } from "@/utils/utils";
import Icon from "@ant-design/icons";
import { Flex, Spin, message } from "antd";
import React from "react";

interface ListProps {
  /** 数据组 */
  list: string[];
  style?: React.CSSProperties;
}

export default function(props: ListProps) {
  return (<Flex style={props.style} wrap="wrap">
    {
      props.list.map((item) => <></>)
    }
  </Flex>);
}

export function LayoutItem(prop: LayoutItemProps) {
  async function onTap() {
    if(prop.spin && prop.onTap) {
      const [ current, setCurrent ] = prop.spin;
      if(current !== '') {
        message.error(`正在 ${current} 中,请稍候...`);
        return Promise.reject()
      }
      setCurrent(prop.name);
      /** 延迟一下, 后面逻辑会阻塞, 导致动画不流畅 */
      await sleep(1e2);
      try {
        await prop.onTap(prop);
      } catch {}
      await sleep(1e2);
      setCurrent('');
    }
  }
  return (
    <Spin spinning={ prop.spin?.[0] === prop.name ?? false }>
      <Flex
        className="chagee-layout-item"
        vertical
        onClick={onTap}
        justify="space-evenly"
        align="center"
        style={ { width: prop.size, height: prop.size, ...(prop.style ?? {}) } }>
        <prop.icon style={prop.iconStyle} />
        <span>{ prop.name }</span>
      </Flex>
    </Spin>
  );
}

export interface LayoutItemProps {
  /** 名称 */
  name: string;
  /** 大小 */
  size?: number;
  /** 图标 */
  icon: typeof Icon;
  /** spin */
  spin?: [
    current: string,
    setSpin: (spin: string) => void
  ],
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 图标样式 */
  iconStyle?: React.CSSProperties;
  /** 点击回调 */
  onTap?: (item: LayoutItemProps) => Promise<unknown>;
}