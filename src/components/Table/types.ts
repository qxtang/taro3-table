import { CSSProperties, PropsWithChildren } from 'react';

export interface AnyOpt {
    [prop: string]: any;
}

export type FixedType = 'left' | 'right';
export type SortOrder = 'ascend' | 'descend' | undefined;
export type CompareFn<T = AnyOpt> = (a: T, b: T, sortOrder: SortOrder) => number;

export interface IColumns {
    title: string | JSX.Element; // 标题
    dataIndex: string; // 列数据在数据项中对应的路径
    key?: string; // React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性
    align?: 'left' | 'right' | 'center'; // 设置该列文本对齐方式
    style?: CSSProperties; // 该列单元格内联样式
    titleStyle?: CSSProperties; //  该列表头内联样式
    className?: string; // 该列单元格 css 类名
    titleClassName?: string; // 设置该列表头单元格 css 类名
    render?: (text?: any, record?: AnyOpt, index?: number) => JSX.Element | string; // 渲染函数
    width?: number; // 列宽，单位px，默认100
    sort?: boolean; // 表头是否显示排序按钮
    sortOrder?: SortOrder; // 排序的受控属性
    sorter?: CompareFn | boolean; // 自定义排序函数，相当于 Array.sort 的 compareFunction，需要服务端排序可设为 true
    sortLevel?: number; // 多列排序优先级
    onSort?: (sortOrder: SortOrder) => void; // 点击排序按钮钩子，常用于服务端排序
    fixed?: FixedType; // 固定列
    expandable?: boolean; // 该列是否启用点击展开收起功能，默认 true
}

export interface Props extends PropsWithChildren<any> {
    columns: IColumns[]; // 表格列的配置描述
    dataSource: AnyOpt[]; // 数据源
    rowKey: string; // 表格行 key 的取值
    className?: string; // 最外层包裹节点 css 类名
    style?: CSSProperties; // 最外层包裹节点内联样式
    colStyle?: CSSProperties; // 单元格统一样式
    colClassName?: string; // 单元格统一类名
    rowStyle?: CSSProperties; // 行统一样式
    rowClassName?: string; // 表格行 css 类名
    titleStyle?: CSSProperties; // 统一设置表头样式
    titleClassName?: string; // 统一设置表头单元格 css 类名
    loading?: boolean; // 是否加载中
    onChange?: (dataSource: AnyOpt[]) => void; // 表格数据变化钩子
    multipleSort?: boolean; // 是否开启多列排序

    // 表格是否可滚动，也可以指定滚动区域的宽、高
    scroll?: {
        x?: number | string | boolean,
        y?: number | string | boolean,
    };
}
