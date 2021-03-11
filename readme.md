# 简介
基于 Taro3 的微信小程序端多功能表格组件
主要功能：
- 自定义样式
- 单列多列排序
- 自定义排序
- 服务端排序
- 固定表头、固定列

![](https://github.com/qxtang/taro3-table/raw/master/preview.gif)

# 安装
```
yarn add taro3-table
```

# 使用示例
## tsx
```tsx
import React, {useEffect, useState} from 'react';
import {View, Text, Button} from '@tarojs/components';
import Table, {IColumns} from 'taro3-table';

interface AnyOptions {
    [prop: string]: any
}

// 模拟请求数据
const getData = () => {
    return new Promise<AnyOptions[]>(resolve => {
        setTimeout(() => {
            resolve(
                new Array(20).fill(null).map((_, i: number): AnyOptions => {
                    const random = (n) => String(parseInt(String(Math.random() * n)));
                    return {
                        user_id: i + 1,
                        username: `username_${random(1e15)}`,
                        telephone: random(1e15),
                        sex: (i + 1) % 2,
                        status: !!((i + 1) % 2),
                        address: `${(i + 1)}_地址地址地址_${random(1e15)}`,
                        orderInfo: {
                            price: random(1e3),
                            orderName: `orderName_${i + 1}`,
                            createTime: `createTime_${i + 1}`
                        },
                        createTime: new Date().toLocaleString(),
                    };
                })
            );
        }, 500);
    });
};

export default (): JSX.Element => {

    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<AnyOptions[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (): Promise<void> => {
        setLoading(true);
        const data: AnyOptions[] = await getData();
        setDataSource(data);
        setLoading(false);
    };

    const columns: IColumns[] = [
        {
            title: '用户名',
            dataIndex: 'username',
            sort: true,

            // 左固定列示例
            fixed: 'left',

            render: t => {
                return <Text style={{color: 'red'}}>{t}</Text>;
            }
        },

        // 服务端排序示例，结合 onSort 钩子请求后端数据
        {
            title: '手机号',
            dataIndex: 'telephone',
            sort: true,
            sorter: true,
            onSort: async (v) => {
                console.log('onSort -', v);

                setLoading(true);
                const data = await getData();
                setDataSource(data);
                setLoading(false);
            }
        },
        {
            title: '性别',
            dataIndex: 'sex',
            render: t => {
                switch (String(t)) {
                    case '0':
                        return '男';
                    case '1':
                        return '女';
                    default:
                        return '未知性别';
                }
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            sort: true,

            // 禁用点击展开功能
            expandable: false,
            render: t => {
                return (<Button size='mini'>{t.toString()}</Button>);
            }
        },
        {
            title: '地址',
            dataIndex: 'address',
        },
        {
            title: '订单信息',
            dataIndex: 'orderInfo',
            render: (_, record) => record?.orderInfo?.price,

            // 自定义排序方式示例
            sort: true,
            sorter: (a, b, sortOrder): number => {
                if (sortOrder === 'ascend') {
                    return a.orderInfo.price - b.orderInfo.price;
                } else {
                    return b.orderInfo.price - a.orderInfo.price;
                }
            }
        },
        {
            // 右固定列示例
            fixed: 'right',
            title: '创建时间',
            dataIndex: 'createTime',
        },
    ];

    return (
        <View>
            <View style={{margin: '50px 0 20px'}}>
                <Button size='mini' onClick={() => {
                    const temp = [...dataSource];
                    temp[3].telephone = 500;
                    temp[4].telephone = 600;
                    temp[5].telephone = 700;
                    setDataSource(temp);
                }}
                >修改数据</Button>
                <Button size='mini' onClick={fetchData}>刷新数据</Button>
                <Button size='mini' onClick={setDataSource.bind(this, [])}>清空数据</Button>
                <Button size='mini' onClick={setLoading.bind(this, !loading)}>loading 开关</Button>
            </View>

            <Table
                onChange={v => {
                    console.log('onChange -', v);
                }}
                columns={columns}
                dataSource={dataSource}
                rowKey='user_id'
                loading={loading}
                style={{
                    margin: '0 auto',
                    width: '92vw'
                }}

                // 固定表头、横向滚动 示例
                scroll={{
                    x: '95vw',
                    y: 400
                }}
            />
        </View>
    );
}

```

## jsx
```jsx
import React, {useEffect, useState} from 'react';
import {View, Text, Button} from '@tarojs/components';
import Table from 'taro3-table';

// 模拟请求数据
const getData = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(
                new Array(20).fill(null).map((_, i) => {
                    const random = (n) => String(parseInt(String(Math.random() * n)));
                    return {
                        user_id: i + 1,
                        username: `username_${random(1e15)}`,
                        telephone: random(1e15),
                        sex: (i + 1) % 2,
                        status: !!((i + 1) % 2),
                        address: `${(i + 1)}_地址地址地址_${random(1e15)}`,
                        orderInfo: {
                            price: random(1e3),
                            orderName: `orderName_${i + 1}`,
                            createTime: `createTime_${i + 1}`
                        },
                        createTime: new Date().toLocaleString(),
                    };
                })
            );
        }, 500);
    });
};

export default () => {

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const data = await getData();
        setDataSource(data);
        setLoading(false);
    };

    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            sort: true,

            // 左固定列示例
            fixed: 'left',

            render: t => {
                return <Text style={{color: 'red'}}>{t}</Text>;
            }
        },

        // 服务端排序示例，结合 onSort 钩子请求后端数据
        {
            title: '手机号',
            dataIndex: 'telephone',
            sort: true,
            sorter: true,
            onSort: async (v) => {
                console.log('onSort -', v);

                setLoading(true);
                const data = await getData();
                setDataSource(data);
                setLoading(false);
            }
        },
        {
            title: '性别',
            dataIndex: 'sex',
            render: t => {
                switch (String(t)) {
                    case '0':
                        return '男';
                    case '1':
                        return '女';
                    default:
                        return '未知性别';
                }
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            sort: true,

            // 禁用点击展开功能
            expandable: false,
            render: t => {
                return (<Button size='mini'>{t.toString()}</Button>);
            }
        },
        {
            title: '地址',
            dataIndex: 'address',
        },
        {
            title: '订单信息',
            dataIndex: 'orderInfo',
            render: (_, record) => record?.orderInfo?.price,

            // 自定义排序方式示例
            sort: true,
            sorter: (a, b, sortOrder) => {
                if (sortOrder === 'ascend') {
                    return a.orderInfo.price - b.orderInfo.price;
                } else {
                    return b.orderInfo.price - a.orderInfo.price;
                }
            }
        },
        {
            // 右固定列示例
            fixed: 'right',
            title: '创建时间',
            dataIndex: 'createTime',
        },
    ];

    return (
        <View>
            <View style={{margin: '50px 0 20px'}}>
                <Button size='mini' onClick={() => {
                    const temp = [...dataSource];
                    temp[3].telephone = 500;
                    temp[4].telephone = 600;
                    temp[5].telephone = 700;
                    setDataSource(temp);
                }}
                >修改数据</Button>
                <Button size='mini' onClick={fetchData}>刷新数据</Button>
                <Button size='mini' onClick={setDataSource.bind(this, [])}>清空数据</Button>
                <Button size='mini' onClick={setLoading.bind(this, !loading)}>loading 开关</Button>
            </View>

            <Table
                onChange={v => {
                    console.log('onChange -', v);
                }}
                columns={columns}
                dataSource={dataSource}
                rowKey='user_id'
                loading={loading}
                style={{
                    margin: '0 auto',
                    width: '92vw'
                }}

                // 固定表头、横向滚动 示例
                scroll={{
                    x: '95vw',
                    y: 400
                }}
            />
        </View>
    );
}
```

# 参数说明
组件参数：
```ts
interface Props extends React.PropsWithChildren<any> {
    columns: IColumns[]; // 表格列的配置描述，详见下方
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
```

表格列的配置描述，是 columns 中的一项：
```ts
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
```
