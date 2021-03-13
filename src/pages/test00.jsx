import React, {useEffect, useState} from 'react';
import {View, Text, Button} from '@tarojs/components';
// import Table from '../components/Table';
import Table from '../../build/components/Table';

const randomString = (len = 5) => {
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};
const randomNum = () => {
    return parseInt(String(Math.random() * 1e6));
};

export default () => {

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '手机号',
            dataIndex: 'telephone',
            sort: true
        },
        {
            title: '余额',
            dataIndex: 'price',
            sort: true
        },
    ];

    const dataSource = new Array(20).fill(null).map((_, k) => {
        return {
            id: k,
            username: `name_${randomString()}`,
            telephone: randomNum(),
            price: randomNum(),
        };
    });

    return (
        <View>

            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                scroll={{
                    y: '500px',
                    x: '100vw',
                }}
                // multipleSort
            />
        </View>
    );
};
