import React, {useEffect, useState} from 'react';
import {View, Text, Button} from '@tarojs/components';
import Taro, {usePullDownRefresh} from '@tarojs/taro';
// import Table from '../../build/Table';
import Table from '../../components/Table';

// 模拟请求数据
const getData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                new Array(20).fill(null).map((_, key) => {
                    const random = (n) => Math.ceil(Math.random() * n);
                    return {
                        user_id: key + 1,
                        username: `name_${random(1e15)}`,
                        telephone: random(1e15),
                        price: random(1e5),
                        sex: (key + 1) % 2,
                        address: `地址_${random(1e15)}`,
                        orderInfo: {
                            price: random(1e3),
                            orderName: `orderName_${key + 1}`,
                            createTime: `createTime_${key + 1}`,
                        },
                        createTime: new Date().toLocaleString(),
                        status: (Math.random() > 0.5),
                    };
                })
            );
        }, 1000);
    });
};

export default () => {
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [columns, setColumns] = useState([
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
        {
            title: '性别',
            dataIndex: 'sex',
            width: 60,
            render: (t) => {
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
            onSort: async (v) => {
                console.log('onSort -', v);

                setLoading(true);
                const data = await getData();
                setDataSource(data);
                setLoading(false);
            },
        },
        {
            title: '余额',
            dataIndex: 'price',
            sort: true,
            render: t => '￥' + t
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

            render: (t) => {
                return <Button type={t ? 'default' : 'warn'} size="mini">{t ? '启用' : '禁用'}</Button>;
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

    const fetchData = async () => {
        setLoading(true);
        const data = await getData();
        setDataSource(data);
        setLoading(false);
        return data;
    };

    return (
        <View className="example">
            <View className="btns">
                <Button
                    size="mini"
                    onClick={() => {
                        const temp = [...dataSource];
                        temp[3].price = 500;
                        temp[4].price = 600;
                        temp[5].price = 700;
                        setDataSource(temp);
                    }}
                >
                    修改数据
                </Button>
                <Button size="mini" onClick={() => {
                    const temp = [...columns];
                    temp[2].sortOrder = Math.random() > 0.5 ? 'descend' : 'ascend';
                    temp[2].title = Math.ceil(Math.random() * 1000);
                    setColumns(temp);
                }}>修改columns</Button>
                <Button size="mini" onClick={() => setColumns([])}>清空columns</Button>
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
                colStyle={{padding: '0 5px'}}
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
