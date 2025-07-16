<template>
  <div>
    <h2>选中的风险数据</h2>
    <template v-if="selectedDataList.length > 0">
      <table>
        <thead>
          <tr>
            <th>序号</th>
            <th>年龄</th>
            <th>性别</th>
            <th>体质指数</th>
            <th>腰臀比</th>
            <!-- 根据需要增加更多列 -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in selectedDataList" :key="item.序号">
            <td>{{ item.序号 }}</td>
            <td>{{ item.年龄 }}</td>
            <td>{{ item.性别 }}</td>
            <td>{{ item.体质指数 }}</td>
            <td>{{ item.腰臀比 }}</td>
            <!-- 显示更多数据 -->
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <p>没有选中的数据。</p>
    </template>
  </div>
</template>

<script>
export default {
  name: "SelectedData",
  props: {
    selectedDataList: Array,  // 接收从父组件传递的数据
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}
</style>