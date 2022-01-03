# taro3-table

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

基于 Taro3、React 的微信小程序端多功能表格组件

# 主要功能

- 自定义样式
- 单列多列排序
- 自定义排序
- 服务端排序
- 固定表头、固定列

![](https://gitee.com/qx9/image-host/raw/master/20220103123016.gif)

- 有许多不足与 bug 欢迎提 [issues](https://github.com/qxtang/taro3-table/issues)

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
            telephone: '123',
        },
        {
            username: '小明',
            telephone: '456',
        },
    ];

    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
        },

        {
            title: '手机号',
            dataIndex: 'telephone',
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            // ...你的配置
        />
    );
};
```

# 示例

- [使用示例](https://github.com/qxtang/taro3-table/blob/master/src/pages/example/index.jsx)

# 参数说明

| 参数           | 描述                                       | 类型                                                                                 | 必传 | 默认值 |
| -------------- | ------------------------------------------ | ------------------------------------------------------------------------------------ | ---- | ------ |
| columns        | 表格列的配置描述，详见下方                 | IColumns[]                                                                           | 是   | []     |
| dataSource     | 数据源                                     | any[]                                                                                | 是   | []     |
| rowKey         | 表格行 key 的取值                          | string                                                                               | 是   |        |
| className      | 最外层包裹节点 css 类名                    | string                                                                               | 否   |        |
| style          | 最外层包裹节点内联样式                     | CSSProperties                                                                        | 否   |        |
| colStyle       | 单元格统一样式                             | CSSProperties                                                                        | 否   |        |
| colClassName   | 单元格统一类名                             | string                                                                               | 否   |        |
| rowStyle       | 行统一样式                                 | CSSProperties                                                                        | 否   |        |
| rowClassName   | 行统一 css 类名                            | string                                                                               | 否   |        |
| titleStyle     | 统一设置表头样式                           | CSSProperties                                                                        | 否   |        |
| titleClassName | 统一设置表头单元格 css 类名                | string                                                                               | 否   |        |
| loading        | 是否加载中                                 | boolean                                                                              | 否   |        |
| onChange       | 表格数据变化钩子                           | (dataSource: any[]) => void                                                          | 否   |        |
| multipleSort   | 是否开启多列排序                           | boolean                                                                              | 否   | false  |
| scroll         | 表格是否可滚动，也可以指定滚动区域的宽、高 | { x?: number &#124; string &#124; boolean, y?: number &#124; string &#124; boolean } | 否   |        |

## column

表格列的配置描述，是 columns 中的一项：

| 参数           | 描述                                                                            | 类型                                                                       | 必传 | 默认值   |
| -------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---- | -------- |
| title          | 标题                                                                            | string &#124; JSX.Element                                                  | 是   |          |
| dataIndex      | 列数据在数据项中对应的路径                                                      | string                                                                     | 是   |          |
| key            | React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性              | string                                                                     | 否   |          |
| align          | 设置该列文本对齐方式                                                            | 'left' &#124; 'right' &#124; 'center'                                      | 否   | 'center' |
| style          | 该列单元格内联样式                                                              | CSSProperties                                                              | 否   |          |
| titleStyle     | 该列表头内联样式                                                                | CSSProperties                                                              | 否   |          |
| className      | 该列单元格 css 类名                                                             | string                                                                     | 否   |          |
| titleClassName | 设置该列表头单元格 css 类名                                                     | string                                                                     | 否   |          |
| render         | 渲染函数                                                                        | (text?: any, record?: AnyOpt, index?: number) => JSX.Element &#124; string | 否   |          |
| width          | 列宽，单位 px，默认 100                                                         | number                                                                     | 否   | 100      |
| sort           | 表头是否显示排序按钮                                                            | boolean                                                                    | 否   |          |
| sortOrder      | 排序的受控属性                                                                  | SortOrder                                                                  | 否   |          |
| sorter         | 自定义排序函数，相当于 Array.sort 的 compareFunction，需要服务端排序可设为 true | CompareFn &#124; boolean                                                   | 否   |          |
| sortLevel      | 多列排序优先级                                                                  | number                                                                     | 否   | 0        |
| onSort         | 点击排序按钮钩子，常用于服务端排序                                              | (sortOrder: SortOrder) => void                                             | 否   |          |
| fixed          | 固定列                                                                          | 'left' &#124; 'right'                                                      | 否   |          |
| expandable     | 该列是否启用点击展开收起功能，默认 true                                         | boolean                                                                    | 否   | true     |
