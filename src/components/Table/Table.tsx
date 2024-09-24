// base
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import useDeepCompareEffect from 'use-deep-compare-effect';

// components
import { ScrollView, Text, View } from '@tarojs/components';

// styles
import './style.css';

// types
import { AnyOpt, CompareFn, FixedType, IColumns, Props, SortOrder } from './types';

const Row = (props: {
    key: any;
    dataSourceItem: AnyOpt;
    index: number;
    rowKey: string;
    rowClassName: string;
    rowStyle: any;
    columns: IColumns[];
    expansion: boolean;
    setExpansion: (val: boolean) => void;
    colClassName: string;
    getSize: (size: string | number) => string;
    DEFAULT_COL_WIDTH: number;
    calculateFixedDistance: (val: any) => string;
    colStyle: any;
  }): JSX.Element => {
    const {
      dataSourceItem,
      index,
      rowKey,
      rowClassName,
      rowStyle,
      columns,
      expansion,
      setExpansion,
      colClassName,
      getSize,
      DEFAULT_COL_WIDTH,
      calculateFixedDistance,
      colStyle,
    } = props;

    return (
      <View
        key={dataSourceItem[rowKey]}
        className={classnames({
          taro3table_row: true,
          [rowClassName]: true,
        })}
        style={rowStyle}
      >
        {columns.map((columnItem: IColumns, colIndex: number): JSX.Element => {
          const text = dataSourceItem[columnItem.dataIndex];
          const expandable = columnItem.expandable !== false;
          let result;
  
          if (columnItem.render) {
            const render = columnItem.render(text, dataSourceItem, index);
  
            if (typeof render !== "object") {
              result = <Text>{render}</Text>;
            } else {
              result = render;
            }
          } else {
            result = <Text>{String(text)}</Text>;
          }
  
          return (
            <View
              onClick={expandable && setExpansion.bind(this, !expansion)}
              key={columnItem.key || columnItem.dataIndex}
              className={classnames({
                [colClassName]: true,
                taro3table_col: true,
                taro3table_fixed: columnItem.fixed,
                taro3table_expansion: expansion,
                [columnItem.className as string]: true,
              })}
              style={{
                textAlign: columnItem.align || "center",
                width: getSize(columnItem.width || DEFAULT_COL_WIDTH),
                [columnItem.fixed as string]:
                  columnItem.fixed &&
                  calculateFixedDistance({
                    fixedType: columnItem.fixed,
                    index: colIndex,
                    columns,
                  }),
                ...columnItem.style,
                ...colStyle,
              }}
            >
              {result}
            </View>
          );
        })}
      </View>
    );
};

// constants
const DEFAULT_COL_WIDTH = 100; // 默认列宽
const JC_TA_MAP = {
    'left': 'flex-start',
    'center': 'center',
    'right': 'flex-end',
};

const getSize = (size: string | number): string => {
    if (typeof size === 'number') {
        return Taro.pxTransform((size as number) * 2);
    } else {
        return String(size);
    }
};

const compare = (a, b, sortOrder: SortOrder = 'ascend'): number => {
    if (isNaN(Number(a)) || isNaN(Number(b))) {
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

const doSort = (opts: { columns: IColumns[]; dataSource: AnyOpt[] }) => {
    const { columns, dataSource } = opts;

    // 查找需要排序的列
    const sortColumns: IColumns[] = columns.filter(item => item.sortOrder) || [];

    if (sortColumns.length === 0) {
        return dataSource;
    }

    // 根据多列排序优先级对 sortColumns 进行排序，优先级高的放在最后
    sortColumns.sort((a, b): number => {
        return (a.sortLevel || 0) - (b.sortLevel || 0);
    });

    // 计算排序结果
    let result: AnyOpt[] = dataSource;

    sortColumns.forEach((column: IColumns) => {
        const dataIndex: string = column.dataIndex;
        const sortOrder: SortOrder = column.sortOrder;
        const sorter: CompareFn | boolean | undefined = column.sorter;

        const temp: AnyOpt[] = [...result];

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

        result = temp;
    });

    return result;
};

// 固定列的时候计算偏移量
const calculateFixedDistance = (opt: { fixedType: FixedType; index: number; columns: IColumns[] }) => {
    const { fixedType, index, columns } = opt;
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
};

const Loading = () => {
    return (
        <View className="taro3table_loading">
            <View className="taro3table_circle"/>
        </View>
    );
};

const Empty = () => {
    return (
        <View className="taro3table_empty">
            <Text>暂无数据</Text>
        </View>
    );
};

const Table = (props: Props): JSX.Element | null => {
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
        multipleSort = false,
        scroll = {}
    } = props;

    const [dataSource, setDataSource] = useState<AnyOpt[]>(pDataSource);
    const [columns, setColumns] = useState<IColumns[]>(pColumns);
    const [expansion, setExpansion] = useState<boolean>(false); // 是否展开

    useEffect(() => {
        onChange(dataSource);
    }, [dataSource]);

    useDeepCompareEffect(() => {
        setColumns(pColumns);
    }, [pColumns]);

    // 排序
    useEffect(() => {
        const result = doSort({ columns, dataSource: pDataSource });
        setDataSource(result);
    }, [columns, pColumns, pDataSource]);

    // 表头点击事件
    const handleClickTitle = useCallback((item: IColumns, index: number): void => {
        if (!item.sort || loading) {
            return;
        }

        const temp: IColumns[] = [...columns];

        if (!multipleSort) {
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

    const Title = (props: { key: any, column: IColumns, index: number }): JSX.Element => {
        const {
            column,
            index,
        } = props;

        return (
            <View
                onClick={handleClickTitle.bind(this, column, index)}
                className={classnames({
                    'taro3table_title': true,
                    'taro3table_fixed': column.fixed,
                    [column.titleClassName || '']: true,
                    [titleClassName]: true,
                })}
                style={{
                    [column.fixed as string]: column.fixed && calculateFixedDistance({ fixedType: column.fixed, index, columns }),
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
                        <View className="taro3table_sortBtn">
                            <View className={classnames({
                                'taro3table_btn': true,
                                'taro3table_ascend': true,
                                'taro3table_active': (column.sortOrder === 'ascend')
                            })}
                            />
                            <View className={classnames({
                                'taro3table_btn': true,
                                'taro3table_descend': true,
                                'taro3table_active': (column.sortOrder === 'descend')
                            })}
                            />
                        </View>
                    )
                }
            </View>
        );
    };

    
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
                className="taro3table_table"
                scroll-x={(dataSource.length !== 0) && (scroll.x)}
                scroll-y={scroll.y}
                style={{
                    maxWidth: getSize(scroll.x as number | string),
                    maxHeight: getSize(scroll.y as number | string),
                }}
            >
                <View
                    className={classnames({
                        'taro3table_head': true,
                        'taro3table_scroll': scroll.y,
                    })}
                >
                    {
                        (columns.length === 0) ? (
                            <Empty/>
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
                <View className="taro3table_body">
                    {
                        (dataSource.length > 0) ? dataSource.map((dataSourceItem: AnyOpt, index: number): JSX.Element => {
                            return (
                                <Row
                                    key={dataSourceItem[rowKey]}
                                    dataSourceItem={dataSourceItem}
                                    index={index}
                                    rowKey={rowKey}
                                    rowClassName={rowClassName}
                                    rowStyle={rowStyle}
                                    columns={columns}
                                    expansion={expansion}
                                    setExpansion={setExpansion}
                                    colClassName={colClassName}
                                    getSize={getSize}
                                    DEFAULT_COL_WIDTH={DEFAULT_COL_WIDTH}
                                    calculateFixedDistance={calculateFixedDistance}
                                    colStyle={colStyle}
                                />
                            );
                        }) : (<Empty/>)
                    }
                </View>
            </ScrollView>
        </View>
    );
};

export default memo(Table);
