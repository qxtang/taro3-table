import React, { useEffect, useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { usePullDownRefresh } from '@tarojs/taro';
import Table, { IColumns } from 'taro3-table';
// import Table, { IColumns } from '../../components/Table';
// import Table, { IColumns } from '../../../build/Table';

const sleep = (s = 1000) => new Promise(r => setTimeout(r, s));

// 模拟请求假数据
const queryData = async (opt?: { page: number, page_size: number }): Promise<any> => {
    await sleep(1000);

    const { page = 1, page_size = 5 } = opt || {};
    const total_rows = 53;
    const size = (() => {
        const max_page = Math.ceil(total_rows / Number(page_size));
        if (Number(page) < max_page) {
            return page_size;
        }
        if (Number(page) === max_page) {
            return total_rows % Number(page_size);
        }
        return 0;
    })();

    const list = new Array(Number(size)).fill(null).map((_, index) => {
        const key = String(Math.ceil(Math.random() * 1e5));
        return {
            user_id: key,
            username: `name_${page}_${index}`,
            telephone: Math.ceil(Math.random() * 1e11),
            price: (Math.random() * 1e3).toFixed(2),
            sex: Number(Math.random() > 0.5),
            address: `地址_${page}_${key}`,
            orderInfo: {
                price: (Math.random() * 1e3).toFixed(2),
                orderName: `orderName_${key}`,
                createTime: `createTime_${key}`,
            },
            createTime: new Date().toLocaleString(),
            status: Math.random() > 0.5,
        };
    });

    return {
        data: list,
        pager: {
            page,
            page_size,
            total_rows,
        },
    };

};

export default () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [columns, setColumns] = useState<IColumns[]>([
        {
            title: '用户编号',
            width: 70,
            dataIndex: 'user_id',

            // 左固定列示例
            fixed: 'left',
        }, {
            title: '用户名',
            dataIndex: 'username',

            // 自定义render
            render: t => {
                return <Text style={{ color: 'red' }}>{t}</Text>;
            },
        },
        {
            title: '性别',
            dataIndex: 'sex',
            width: 60,
            render: t => {
                switch (String(t)) {
                    case '0':
                        return '男';
                    case '1':
                        return '女';
                    default:
                        return '-';
                }
            },
        },

        // 服务端排序示例，结合 onSort 钩子请求后端数据
        {
            title: '手机号',
            dataIndex: 'telephone',
            sort: true,
            sorter: true,
            onSort: async sortOrder => {
                console.log('onSort -', sortOrder);

                setLoading(true);
                const { data } = await queryData();
                setDataSource(data);
                setLoading(false);
            },
        },
        {
            title: '余额',
            dataIndex: 'price',
            sort: true,
            render: t => '￥' + t,
        },
        {
            title: '地址',
            dataIndex: 'address',
        },
        {
            title: '订单金额',
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
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
        },
        {
            title: '操作',
            dataIndex: 'status',

            // 右固定列示例
            fixed: 'right',

            // 禁用点击展开功能
            expandable: false,

            render: t => {
                return (
                    <Button type={t ? 'default' : 'warn'} size="mini">
                        {t ? '启用' : '禁用'}
                    </Button>
                );
            },
        },
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    // 下拉刷新示例
    usePullDownRefresh(() => {
        fetchData().then(() => {
            Taro.stopPullDownRefresh();
        });
    });

    const fetchData = async (): Promise<any[]> => {
        setLoading(true);
        const { data } = await queryData();
        setDataSource(data);
        setLoading(false);
        return data;
    };

    return (
        <View className="example">
            <View className="btns">
                <Button
                    size="mini"
                    onClick={(): void => {
                        const temp = [...dataSource];
                        temp[0].username = `修改姓名_${Math.ceil(Math.random() * 100)}`;
                        setDataSource(temp);
                    }}
                >
                    修改数据
                </Button>
                <Button
                    size="mini"
                    onClick={(): void => {
                        const temp = [...columns];
                        temp[0].title = `修改标题_${Math.ceil(Math.random() * 100)}`;
                        setColumns(temp);
                    }}
                >
                    修改columns
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
                onChange={v => {
                    console.log('onChange -', v);
                }}
                colStyle={{ padding: '0 5px' }}
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
