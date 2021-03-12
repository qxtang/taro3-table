// base
import React, {memo, useCallback, useEffect, useState, CSSProperties, useMemo} from 'react';
import Taro from '@tarojs/taro';
import classnames from 'classnames';

// components
import {ScrollView, Text, View} from '@tarojs/components';

// styles
import './style.css';

// constants
const DEFAULT_COL_WIDTH = 100; // 默认列宽
const MULTIPLE_SORT = true; // 是否支持多列排序
const JC_TA_MAP = {
    'left': 'flex-start',
    'center': 'center',
    'right': 'flex-end',
};

// types
export interface AnyOpt {
    [prop: string]: any;
}

export type FixedType = 'left' | 'right';
export type SortOrder = 'ascend' | 'descend' | undefined;
export type CompareFn<T = AnyOpt> = (a: T, b: T, sortOrder: SortOrder) => number;
export type DataSource = AnyOpt[];

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

interface Props extends React.PropsWithChildren<any> {
    columns: IColumns[]; // 表格列的配置描述
    dataSource: DataSource; // 数据源
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
    onChange?: (dataSource: DataSource) => void; // 表格数据变化钩子

    // 表格是否可滚动，也可以指定滚动区域的宽、高
    scroll?: {
        x?: number | string | boolean,
        y?: number | string | boolean,
    }
}

const Table = (props: Props): JSX.Element => {
    // variables
    const {
        columns: pColumns = [],
        dataSource: pDataSource = [],
        rowKey = '',
        loading = false,
        className = '',
        style = {},
        titleClassName = '',
        titleStyle = {},
        rowClassName = '',
        rowStyle = {},
        colStyle = {},
        colClassName = '',
        onChange = (): void => {
        },
        scroll = {}
    } = props;

    // states
    const [dataSource, setDataSource] = useState<DataSource>(pDataSource);
    const [columns, setColumns] = useState<IColumns[]>(pColumns);
    const [expansion, setExpansion] = useState<boolean>(false); // 是否展开

    // effects
    useEffect(() => {
        onChange(dataSource);
    }, [dataSource]);

    // 当 columns、 dataSource 有变化时进行排序
    useEffect(() => {
        // 查找需要排序的列
        const sortColumns: IColumns[] = columns.filter(item => item.sortOrder) || [];

        // 根据多列排序优先级对 sortColumns 进行排序，优先级高的放在最后
        sortColumns.sort((a, b): number => {
            return (a.sortLevel || 0) - (b.sortLevel || 0);
        });

        // console.log(new Date().toLocaleString(), '- 需要排序的列 -', sortColumns.map(i => i.dataIndex).toString());

        // 计算排序结果
        let result: DataSource = pDataSource;

        sortColumns.forEach((column: IColumns) => {
            const dataIndex: string = column.dataIndex;
            const sortOrder: SortOrder = column.sortOrder;
            const sorter: CompareFn | boolean | undefined = column.sorter;

            const temp: DataSource = [...result];

            // console.group(`${new Date().toLocaleString()} - 进行排序 - ${dataIndex} - ${sortOrder}：`);
            // console.log(new Date().toLocaleString(), '- 排序前 -', result);

            temp.sort((a, b): number => {
                if (sorter) {
                    if (typeof sorter === 'function') {
                        return sorter(a, b, sortOrder);
                    } else {
                        return 0;
                    }
                }

                return compare(a[dataIndex], b[dataIndex], sortOrder);
            });

            // console.log(new Date().toLocaleString(), '- 排序后 -', temp);
            // console.groupEnd();

            result = temp;
        });

        setDataSource(result);
    }, [columns, pDataSource]);

    // methods
    /**
     * @description 表头点击事件
     * @param item
     * @param index
     */
    const handleClickTitle = useCallback((item: IColumns, index: number): void => {
        if (!item.sort || loading) {
            return;
        }

        const temp: IColumns[] = [...columns];

        if (!MULTIPLE_SORT) {
            temp.forEach((j: IColumns, i: number): void => {
                if (i !== index) {
                    delete j.sortOrder;
                }
            });
        }

        // 连续点击循环设置排序方式
        const array: SortOrder[] = ['ascend', 'descend', undefined];
        const curr: number = array.indexOf(temp[index].sortOrder);
        const next: SortOrder = temp[index].sortOrder = array[(curr + 1) % array.length];
        item.onSort && item.onSort(next);
        setColumns(temp);
    }, [columns, loading]);

    /**
     * @description 兼容字各个数据类型的比较，如果是字符串使用 localeCompare 来比较，其他类型则转为数字来比较
     * @param a
     * @param b
     * @param sortOrder
     */
    const compare = (a, b, sortOrder: SortOrder = 'ascend'): number => {
        if (typeof a === 'string' && typeof b === 'string') {
            if (sortOrder === 'ascend') {
                return a.localeCompare(b);
            } else {
                return b.localeCompare(a);
            }
        }
        if (sortOrder === 'ascend') {
            return (Number(a || 0) - Number(b || 0)) || 0;
        } else {
            return (Number(b || 0) - Number(a || 0)) || 0;
        }
    };

    /**
     * @description 把乘以2的逻辑抽出来，并且兼容字符串
     * @param size
     */
    const getSize = (size: string | number): string => {
        if (typeof size === 'number') {
            return Taro.pxTransform((size as number) * 2);
        } else {
            return String(size);
        }
    };

    /**
     * @description 固定列的时候计算偏移量
     * @param fixedType
     * @param index
     */
    const getFixedDistance = useCallback((fixedType: FixedType, index) => {
        let result: number;
        if (fixedType === 'left') {
            result = columns.reduce(function (prev, cur, i) {
                if ((i + 1) <= index) {
                    return prev + (cur.width || DEFAULT_COL_WIDTH);
                } else {
                    return prev;
                }
            }, 0);
        } else {
            result = columns.reduceRight(function (prev, cur, i) {
                if ((i - 1) >= index) {
                    return prev + (cur.width || DEFAULT_COL_WIDTH);
                } else {
                    return prev;
                }
            }, 0);
        }

        return getSize(result);
    }, [columns]);

    const Title = (props: { key: any, column: IColumns, index: number }): JSX.Element => {
        const {
            column,
            index,
        } = props;

        return (
            <View
                onClick={handleClickTitle.bind(this, column, index)}
                className={classnames({
                    'title': true,
                    'fixed': column.fixed,
                    [column.titleClassName || '']: true,
                    [titleClassName]: true,
                })}
                style={{
                    [column.fixed as string]: column.fixed && getFixedDistance(column.fixed, index),
                    width: getSize(column.width || DEFAULT_COL_WIDTH),
                    ...column.titleStyle,
                    ...titleStyle,
                    justifyContent: column.align && JC_TA_MAP[column.align]
                }}
                key={column.key || column.dataIndex}
            >
                <Text>{column.title}</Text>
                {
                    column.sort && (
                        <View className="sortBtn">
                            <View className={classnames({
                                'btn': true,
                                'ascend': true,
                                'active': (column.sortOrder === 'ascend')
                            })}
                            />
                            <View className={classnames({
                                'btn': true,
                                'descend': true,
                                'active': (column.sortOrder === 'descend')
                            })}
                            />
                        </View>
                    )
                }
            </View>
        );
    };

    const Row = (props: { key: any, dataSourceItem: AnyOpt, index: number }): JSX.Element => {
        const {
            dataSourceItem,
            index
        } = props;

        return (
            <View
                key={dataSourceItem[rowKey]}
                className={classnames({
                    'row': true,
                    [rowClassName]: true,
                })}
                style={rowStyle}
            >
                {
                    columns.map((columnItem: IColumns, colIndex: number): JSX.Element => {
                        const text = dataSourceItem[columnItem.dataIndex];
                        const expandable = columnItem.expandable !== false;
                        let result;

                        if (columnItem.render) {
                            const render = columnItem.render(text, dataSourceItem, index);

                            if (typeof render !== 'object') {
                                result = (<Text>{render}</Text>);
                            } else {
                                result = render;
                            }
                        } else {
                            result = (<Text>{String(text)}</Text>);
                        }

                        return (
                            <View
                                onClick={expandable && setExpansion.bind(this, !expansion)}
                                key={columnItem.key || columnItem.dataIndex}
                                className={classnames({
                                    [colClassName]: true,
                                    'col': true,
                                    'fixed': columnItem.fixed,
                                    'expansion': expansion,
                                    [columnItem.className as string]: true
                                })}
                                style={{
                                    textAlign: columnItem.align || 'center',
                                    width: getSize(columnItem.width || DEFAULT_COL_WIDTH),
                                    [columnItem.fixed as string]: columnItem.fixed && getFixedDistance(columnItem.fixed, colIndex),
                                    ...columnItem.style,
                                    ...colStyle
                                }}
                            >{result}</View>
                        );
                    })
                }
            </View>
        );
    };

    const Loading = () => {
        return (
            <View className="loading">
                <View className="circle"/>
            </View>
        );
    };

    const Empty = () => {
        return (
            <View className="nothing">
                <Text>暂无数据</Text>
            </View>
        );
    };

    // memos
    const wrapWidth = useMemo((): number => {
        return columns.reduce(function (prev, cur) {
            return prev + (cur.width || DEFAULT_COL_WIDTH);
        }, 0);
    }, [columns]);

    return (
        <View
            className={classnames(['taro3table', className])}
            style={{
                width: wrapWidth,
                ...style
            }}
        >
            {loading && (<Loading/>)}
            <ScrollView
                className="table"
                scroll-x={(dataSource.length !== 0) && (scroll.x)}
                scroll-y={scroll.y}
                style={{
                    maxWidth: getSize(scroll.x as number | string),
                    maxHeight: getSize(scroll.y as number | string),
                }}
            >
                <View
                    className={classnames({
                        'head': true,
                        'scroll': scroll.y,
                    })}
                >
                    {
                        (columns.length === 0) ? (
                            <View className="nothing">
                                <Text>暂无数据</Text>
                            </View>
                        ) : columns.map((item: IColumns, index: number): JSX.Element => {
                            return (
                                <Title
                                    key={item.key || item.dataIndex}
                                    column={item}
                                    index={index}
                                />
                            );
                        })
                    }
                </View>
                <View className="body">
                    {
                        ((dataSource.length === 0) && (!loading)) ? (
                            <Empty/>
                        ) : dataSource.map((dataSourceItem: AnyOpt, index: number): JSX.Element => {
                            return (
                                <Row
                                    key={dataSourceItem[rowKey]}
                                    dataSourceItem={dataSourceItem}
                                    index={index}
                                />
                            );
                        })
                    }
                </View>
            </ScrollView>
        </View>
    );
};

export default memo(Table);
