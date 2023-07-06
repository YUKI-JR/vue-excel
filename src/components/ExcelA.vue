<script setup>
import { ref } from "vue";
import XLSX from "xlsx";
import { useMyStore } from "../store";
import { filterEarliestTime } from "../utils/select_after8";

const lastUid = ref("");

const readFile = (file) => {
  //文件读取
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsBinaryString(file); //以二进制的方式读取
    reader.onload = (ev) => {
      resolve(ev.target.result);
    };
  });
};

// const arr = ref([]);
const after8Arr = [];
const after12Before1330 = [];
const myStore = useMyStore();

const handleChange = async (ev) => {
  let file = ev.raw;
  if (lastUid.value == file.uid) {
    return;
  }
  lastUid.value = file.uid;
  if (file) {
    if (file.name.indexOf(".xls") != -1 || file.name.indexOf(".xlsx") != -1) {
      //这里进行了判断，只能读取这两种类型的文件。
      let data = await readFile(file);
      let workbook = XLSX.read(data, { type: "binary", cellDates: true }); //解析二进制格式数据
      let worksheet = workbook.Sheets[workbook.SheetNames[0]]; //获取第一个Sheet
      let result = XLSX.utils.sheet_to_json(worksheet); //json数据格式
      result.map((item) => {
        const hours = new Date(item.clockin_time).getHours();
        const minutes = new Date(item.clockin_time).getMinutes();
        if (hours < 8) {
          after8Arr.push(item.clockin_time);
        }
        if (
          (hours === 12 && minutes >= 0) ||
          (hours > 12 && hours < 13) ||
          (hours === 13 && minutes < 30)
        ) {
          after12Before1330.push(item.clockin_time);
        }
        // if (new Date(item.clockin_time).getHours() < 8) {
        // }
      });
      //   arr.value.push(new Date(item.clockin_time).getDate());
      //   arr.value = [...new Set(arr.value)];
      //   console.log(arr.value);
      // 赋值给store里的早于八点的最早一条数据
      myStore.after8Times = filterEarliestTime(after8Arr);
      myStore.after12Before1330Arr = filterEarliestTime(after12Before1330);
      console.log(myStore.after12Before1330Arr);
      //   判断没有哪一天
      //   for (let i = 1; i <= 31; i++) {
      //     if (!arr.value.includes(i)) {
      //       myStore.missDays.push(i);
      //     }
      //   }
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
      <el-button type="primary">选择打卡表</el-button>
    </el-upload>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
