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
            <View style={{margin: '20px 0 20px'}}>
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
