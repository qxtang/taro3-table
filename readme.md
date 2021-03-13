<div align="center">
    <h1>taro3-table</h1>
    <p>基于 Taro3、React 的微信小程序端多功能表格组件</p>
    <p>
        <a href="https://github.com/qxtang/taro3-table/stargazers" target="_black">
          <img src="https://img.shields.io/github/stars/qxtang/taro3-table?color=%23ffca28&logo=github&style=flat-square" alt="stars" />
        </a>
        <a href="https://github.com/qxtang/taro3-table/network/members" target="_black">
          <img src="https://img.shields.io/github/forks/qxtang/taro3-table?color=%23ffca28&logo=github&style=flat-square" alt="forks" />
        </a>
        <a href="https://www.npmjs.com/package/taro3-table" target="_black">
          <img src="https://img.shields.io/npm/v/taro3-table?color=%23ffca28&logo=npm&style=flat-square" alt="version" />
        </a>
        <a href="https://www.npmjs.com/package/taro3-table" target="_black">
          <img src="https://img.shields.io/npm/dm/taro3-table?color=%23ffca28&logo=npm&style=flat-square" alt="downloads" />
        </a>
    </p>
</div>

# 主要功能
- 自定义样式
- 单列多列排序
- 自定义排序
- 服务端排序
- 固定表头、固定列

![](https://github.com/qxtang/taro3-table/raw/master/preview.gif)

# 注意
只能在基于 Taro3.x 和 React 的微信小程序项目中使用。

# 安装
```sh
# npm 安装：
npm install taro3-table

# yarn 安装：
yarn add taro3-table
```

# 使用
```jsx
import React from 'react';
import Table from 'taro3-table';

export default () => {

    const dataSource = [
        {
            username: '小红',
            telephone: '123'
        },
        {
            username: '小明',
            telephone: '456'
        }
    ]

    const columns = [
        {
            title: '用户名',
            dataIndex: 'username'
        },

        {
            title: '手机号',
            dataIndex: 'telephone'
        }
    ]

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            ...你的配置
        />
    )
}
```

# 示例
```tsx
import React, {useEffect, useState} from 'react';
import {View, Text, Button} from '@tarojs/components';
import Table, {IColumns} from 'taro3-table';

// 模拟请求数据
const getData = () => {
    return new Promise<any[]>((resolve) => {
        setTimeout(() => {
            resolve(
                new Array(20).fill(null).map((_, i: number): any => {
                    const random = (n) => String(parseInt(String(Math.random() * n)));
                    return {
                        user_id: i + 1,
                        username: `username_${random(1e15)}`,
                        telephone: random(1e15),
                        sex: (i + 1) % 2,
                        status: !!((i + 1) % 2),
                        address: `${i + 1}_地址地址地址_${random(1e15)}`,
                        orderInfo: {
                            price: random(1e3),
                            orderName: `orderName_${i + 1}`,
                            createTime: `createTime_${i + 1}`,
                        },
                        createTime: new Date().toLocaleString(),
                    };
                })
            );
        }, 1000);
    });
};

export default (): JSX.Element => {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (): Promise<void> => {
        setLoading(true);
        const data: any[] = await getData();
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

            render: (t) => {
                return <Text style={{color: 'red'}}>{t}</Text>;
            },
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
            },
        },
        {
            title: '性别',
            dataIndex: 'sex',
            render: (t) => {
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
            render: (t) => {
                return <Button size="mini">{t.toString()}</Button>;
            },
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
            },
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
                <Button
                    size="mini"
                    onClick={() => {
                        const temp = [...dataSource];
                        temp[3].telephone = 500;
                        temp[4].telephone = 600;
                        temp[5].telephone = 700;
                        setDataSource(temp);
                    }}
                >
                    修改数据
                </Button>
                <Button size="mini" onClick={fetchData}>
                    刷新数据
                </Button>
                <Button size="mini" onClick={setDataSource.bind(this, [])}>
                    清空数据
                </Button>
                <Button size="mini" onClick={setLoading.bind(this, !loading)}>
                    loading 开关
                </Button>
            </View>

            <Table
                onChange={(v) => {
                    console.log('onChange -', v);
                }}
                columns={columns}
                dataSource={dataSource}
                rowKey="user_id"
                loading={loading}
                style={{
                    margin: '0 auto',
                    width: '92vw',
                }}
                // 固定表头、横向滚动 示例
                scroll={{
                    x: '100vw',
                    y: 400,
                }}
            />
        </View>
    );
};
```

# 参数说明
| 参数 | 描述 | 类型 | 必传 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| columns | 表格列的配置描述，详见下方 | IColumns[] | 是 | [] |
| dataSource | 数据源 | any[] | 是 | [] |
| rowKey | 表格行 key 的取值 | string | 是 |  |
| className | 最外层包裹节点 css 类名 | string | 否 |  |
| style | 最外层包裹节点内联样式 | CSSProperties | 否 |  |
| colStyle | 单元格统一样式 | CSSProperties | 否 |  |
| colClassName | 单元格统一类名 | string | 否 |  |
| rowStyle | 行统一样式 | CSSProperties | 否 |  |
| rowClassName | 行统一 css 类名 | string | 否 |  |
| titleStyle | 统一设置表头样式 | CSSProperties | 否 |  |
| titleClassName | 统一设置表头单元格 css 类名 | string | 否 |  |
| loading | 是否加载中 | boolean | 否 |  |
| onChange | 表格数据变化钩子 | (dataSource: any[]) => void | 否 |  |
| multipleSort | 是否开启多列排序 | boolean | 否 | false |
| scroll | 表格是否可滚动，也可以指定滚动区域的宽、高 | { x?: number &#124; string &#124; boolean, y?: number &#124; string &#124; boolean } | 否 |  |


## column
表格列的配置描述，是 columns 中的一项：

| 参数 | 描述 | 类型 | 必传 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| title | 标题 | string &#124; JSX.Element | 是 |  |
| dataIndex | 列数据在数据项中对应的路径 | string | 是 |  |
| key | React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性 | string | 否 |  |
| align | 设置该列文本对齐方式 | 'left' &#124; 'right' &#124; 'center' | 否 | 'center' |
| style | 该列单元格内联样式 | CSSProperties | 否 |  |
| titleStyle | 该列表头内联样式 | CSSProperties | 否 |  |
| className | 该列单元格 css 类名 | string | 否 |  |
| titleClassName | 设置该列表头单元格 css 类名 | string | 否 |  |
| render | 渲染函数 | (text?: any, record?: AnyOpt, index?: number) => JSX.Element &#124; string | 否 |  |
| width | 列宽，单位px，默认100 | number | 否 | 100 |
| sort | 表头是否显示排序按钮 | boolean | 否 |  |
| sortOrder | 排序的受控属性 | SortOrder | 否 |  |
| sorter | 自定义排序函数，相当于 Array.sort 的 compareFunction，需要服务端排序可设为 true | CompareFn &#124; boolean | 否 |  |
| sortLevel | 多列排序优先级 | number | 否 | 0 |
| onSort | 点击排序按钮钩子，常用于服务端排序 | (sortOrder: SortOrder) => void | 否 |  |
| fixed | 固定列 | 'left' &#124; 'right' | 否 |  |
| expandable | 该列是否启用点击展开收起功能，默认 true | boolean | 否 | true |

<br />
如果觉得对您有帮助，<a href="https://github.com/qxtang/taro3-table" target="_blank">请给我点个 star 哦</a>，谢谢
