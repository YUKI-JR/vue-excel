<template>
    <div class="content">
        <excelA></excelA>
        <excelB></excelB>
    </div>
</template>
<script setup>
import excelA from '../components/ExcelA.vue';
import excelB from '../components/ExcelB.vue';
</script>
<style>
.content {
  width: 300px;
  display: flex;
  justify-content: space-between;
}
</style>