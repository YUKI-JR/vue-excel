<script setup>
import { ref } from "vue";
import XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useMyStore } from "../store";

const lastUid = ref("");
const myStore = useMyStore();

const handleChange = async (ev) => {
  let file = ev.raw;
  if (lastUid.value == file.uid) {
    return;
  }
  lastUid.value = file.uid;
  if (file) {
    if (file.name.indexOf(".xls") != -1 || file.name.indexOf(".xlsx") != -1) {
      let workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file);

      let worksheet = workbook.worksheets[0];

      const newData = [];

      const data = {};
      const dates = Object.values(myStore.after8Times).map((value) => {
        const date = new Date(value);
        return date.getDate();
      });
      console.log(dates);
      //   循环判断哪天没打卡，有打卡则赋值，没打卡赋空字符串
      for (let j = 1; j <= 31; j++) {
        const columnName = `Column${j}`;
        const columnValue = dates.includes(j)
          ? myStore.after8Times.find((item) => {
              const date = new Date(item);
              return date.getDate() === j;
            }) || ""
          : "";
        data[columnName] = columnValue;
      }

      newData.push(data);
      console.log(newData);

      // 将新数据从D7单元格开始插入
      const startRow = 7;
      const startColumn = 4; // 列索引从1开始，D对应的索引为4

      //   写入数据
      newData.forEach((data, index) => {
        Object.keys(data).forEach((key, columnIndex) => {
          worksheet.getCell(startRow + index, startColumn + columnIndex).value =
            data[key];
        });
      });

      // 将修改后的工作簿写入新的Excel文件
      const newFileData = await workbook.xlsx.writeBuffer();

      // 创建Blob对象并保存文件
      const newBlob = new Blob([newFileData], {
        type: "application/octet-stream",
      });
      saveAs(newBlob, file.name);
    }
  }
};
</script>

<template>
  <div>
    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      action=""
      multiple
      :on-change="handleChange"
      :limit="1"
    >
      <el-button type="primary">选择考勤表</el-button>
    </el-upload>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
