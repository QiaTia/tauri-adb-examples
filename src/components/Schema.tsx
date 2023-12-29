import { Collapse, Descriptions, Typography } from "antd";
import type { Rule } from "antd/es/form";

/** 基础类型 */
type BaseType = string | number | boolean;
/** 类型枚举 */
type TypeEnum = 'text' | 'select' | 'title' | 'radio';
type SpanOption = Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', number> | number;

/** 列数据 */
export type ColumnOption = {
  name: string,
  type?: TypeEnum,
  /** 数据 */
  value?: BaseType | BaseType[],
  dataIndex?: string,
  /** 自定义返回类型 */
  render?: (values: Record<string, BaseType | BaseType[]>, info: unknown) => React.ReactNode,
  columns?: ColumnOption[],
  rules?: Rule[],
  span?: number
}

interface SchemaProp {
  columns: ColumnOption[],
  values?: Record<string, BaseType | BaseType[]>,
  render?: Record<TypeEnum, (value: BaseType | BaseType[], info: unknown) => string>,
  span?: SpanOption,
  collapse?: boolean;
  defaultValue?: string
}

/** Schema - 数据简单展示渲染组件 */
function Schema({ columns, values, render, span, defaultValue = '-', collapse = false }: SchemaProp) {
  function CalculatorFilled(prop: ColumnOption, index: number) {
    const originValue = prop.value || prop.dataIndex && values && values[prop.dataIndex] || defaultValue;
    const rederFn = prop.render || render && render[prop.type || 'title'];
    return (
      <Descriptions.Item
        key={`${prop.name} - ${index}`}
        span={prop.span}
        label={prop.name}>{ rederFn ? rederFn(originValue as any, values) : originValue}</Descriptions.Item>
    );
  }
  return (
    <Collapse collapsible={collapse ?'header': 'disabled'} defaultActiveKey={columns.map((_, i) => i)} style={{ width: '100%',  }} ghost>{
      columns.map(function (item, index) {
        switch (item.type) {
          case 'title':
            return <Collapse.Panel
              showArrow={false} key={index}
              header={<Typography.Title level={5}>{item.name}</Typography.Title>}>
              <Descriptions column={span || item.span}>
                {
                  item.columns && item.columns.map((t, i) => CalculatorFilled(t, i))
                }
                <Schema columns={item.columns!} values={values} render={render} />
              </Descriptions>
            </Collapse.Panel>
          default:
            return CalculatorFilled(item, index)
        }
      })}
    </Collapse>
  )
}

export default Schema;