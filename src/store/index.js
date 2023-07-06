import { defineStore } from 'pinia'

export const useMyStore = defineStore('myStore', {
    state: () => ({
        missDays: [],
        after8Times: [],
        after12Before1330Arr:[]
    })
})
